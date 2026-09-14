import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Loader2, Pencil, Star, Trash2, Upload } from 'lucide-react';
import { useAdminGallery, useDeleteImage, useReorderImages, useUpdateImage, useUploadImages, type GalleryUpdate } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { TranslatedInput } from '@/components/admin/TranslatedInput';
import { cn } from '@/lib/utils';
import type { GalleryCategory, GalleryImage } from '@/types/api';

const CATEGORIES: { key: GalleryCategory; label: string }[] = [
    { key: 'burger', label: 'Burger' }, { key: 'food', label: 'Food' }, { key: 'ambience', label: 'Ambiente' }, { key: 'drinks', label: 'Drinks' }, { key: 'misc', label: 'Weitere' },
];

export function GalleryAdmin() {
    const { data: images, isLoading } = useAdminGallery();
    const upload = useUploadImages();
    const update = useUpdateImage();
    const remove = useDeleteImage();
    const reorder = useReorderImages();

    const [filter, setFilter] = useState<GalleryCategory | 'all' | 'featured'>('all');
    const [uploadCategory, setUploadCategory] = useState<GalleryCategory>('food');
    const [dragOver, setDragOver] = useState(false);
    const [editing, setEditing] = useState<GalleryImage | null>(null);
    const [toDelete, setToDelete] = useState<GalleryImage | null>(null);

    const visible = useMemo(
        () => (images ?? []).filter((img) => (filter === 'all' ? true : filter === 'featured' ? img.is_featured : img.category === filter)),
        [images, filter]
    );

    const handleFiles = useCallback(
        async (list: FileList | File[]) => {
            const files = Array.from(list).filter((f) => f.type.startsWith('image/'));
            if (!files.length) return toast.error('Bitte nur Bilddateien (JPG, PNG, WebP).');
            if (files.some((f) => f.size > 15 * 1024 * 1024)) return toast.error('Maximal 15 MB pro Bild.');
            try {
                const created = await upload.mutateAsync({ files, category: uploadCategory });
                toast.success(`${created.length} ${created.length === 1 ? 'Bild' : 'Bilder'} hochgeladen.`);
            } catch {
                toast.error('Upload fehlgeschlagen.');
            }
        },
        [upload, uploadCategory]
    );

    const move = (image: GalleryImage, dir: -1 | 1) => {
        if (!images) return;
        const ids = images.map((i) => i.id);
        const index = ids.indexOf(image.id);
        const target = index + dir;
        if (target < 0 || target >= ids.length) return;
        [ids[index], ids[target]] = [ids[target], ids[index]];
        reorder.mutate(ids, { onError: () => toast.error('Reihenfolge konnte nicht gespeichert werden.') });
    };

    const toggleFeatured = (image: GalleryImage) => {
        update.mutate({ id: image.id, is_featured: !image.is_featured }, { onError: () => toast.error('Speichern fehlgeschlagen.') });
    };

    return (
        <div className="space-y-6">
            {/* Upload */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                className={cn('rounded-lg border-2 border-dashed bg-card p-6 transition-colors', dragOver ? 'border-primary bg-primary/5' : 'border-border')}
            >
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        {upload.isPending ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Bilder hierher ziehen oder auswählen</p>
                        <p className="text-sm text-muted-foreground">JPG, PNG oder WebP, max. 15 MB. Bilder werden automatisch verkleinert und als WebP gespeichert.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value as GalleryCategory)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="Kategorie für neue Bilder">
                            {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                        </select>
                        <Button asChild disabled={upload.isPending}>
                            <label className="cursor-pointer">
                                Auswählen
                                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
                            </label>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-1" role="group" aria-label="Filter">
                {([{ key: 'all', label: 'Alle' }, { key: 'featured', label: 'Startseite' }, ...CATEGORIES] as { key: typeof filter; label: string }[]).map((c) => (
                    <button key={c.key} type="button" onClick={() => setFilter(c.key)} aria-pressed={filter === c.key} className={cn('rounded-full border px-3 py-1.5 text-xs font-bold transition-colors', filter === c.key ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>
                        {c.label} <span className="opacity-70 tabular">{(images ?? []).filter((img) => (c.key === 'all' ? true : c.key === 'featured' ? img.is_featured : img.category === c.key)).length}</span>
                    </button>
                ))}
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}</div>
            ) : visible.length === 0 ? (
                <p className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted-foreground">Keine Bilder.</p>
            ) : (
                <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                    {visible.map((image) => (
                        <li key={image.id} className="group overflow-hidden rounded-lg border border-border bg-card">
                            <div className="relative">
                                <img src={image.thumb_url} alt={image.caption?.de ?? ''} className="aspect-square w-full object-cover" loading="lazy" />
                                {image.is_featured && (
                                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground"><Star className="size-3" /> Startseite</span>
                                )}
                                <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                                    <button type="button" onClick={() => move(image, -1)} className="rounded bg-white/90 p-1.5 text-stone-900 hover:bg-white" aria-label="Nach vorne"><ArrowLeft className="size-4" /></button>
                                    <button type="button" onClick={() => move(image, 1)} className="rounded bg-white/90 p-1.5 text-stone-900 hover:bg-white" aria-label="Nach hinten"><ArrowRight className="size-4" /></button>
                                    <button type="button" onClick={() => toggleFeatured(image)} className={cn('rounded p-1.5', image.is_featured ? 'bg-primary text-primary-foreground' : 'bg-white/90 text-stone-900 hover:bg-white')} aria-label="Auf Startseite hervorheben" aria-pressed={image.is_featured}><Star className="size-4" /></button>
                                    <button type="button" onClick={() => setEditing(image)} className="ml-auto rounded bg-white/90 p-1.5 text-stone-900 hover:bg-white" aria-label="Bearbeiten"><Pencil className="size-4" /></button>
                                    <button type="button" onClick={() => setToDelete(image)} className="rounded bg-white/90 p-1.5 text-red-700 hover:bg-white" aria-label="Löschen"><Trash2 className="size-4" /></button>
                                </div>
                            </div>
                            <div className="px-2.5 py-2 text-xs">
                                <p className="truncate font-semibold">{image.caption?.de || <span className="text-muted-foreground">Ohne Bildunterschrift</span>}</p>
                                <p className="text-muted-foreground">{CATEGORIES.find((c) => c.key === image.category)?.label}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {editing && (
                <EditDialog
                    key={editing.id}
                    image={editing}
                    onClose={() => setEditing(null)}
                    onSave={async (data) => {
                        try {
                            await update.mutateAsync({ id: editing.id, ...data });
                            toast.success('Bild gespeichert.');
                            setEditing(null);
                        } catch {
                            toast.error('Speichern fehlgeschlagen.');
                        }
                    }}
                    saving={update.isPending}
                />
            )}

            <ConfirmDialog
                open={!!toDelete}
                title="Bild löschen?"
                description="Das Bild wird dauerhaft aus der Galerie und vom Server entfernt."
                loading={remove.isPending}
                onCancel={() => setToDelete(null)}
                onConfirm={async () => {
                    if (!toDelete) return;
                    try {
                        await remove.mutateAsync(toDelete.id);
                        toast.success('Bild gelöscht.');
                        setToDelete(null);
                    } catch {
                        toast.error('Löschen fehlgeschlagen.');
                    }
                }}
            />
        </div>
    );
}

function EditDialog({ image, onClose, onSave, saving }: { image: GalleryImage; onClose: () => void; onSave: (data: GalleryUpdate) => void; saving: boolean }) {
    const [form, setForm] = useState<GalleryUpdate>({
        caption: image.caption ?? { de: '', en: '' },
        category: image.category,
        is_featured: image.is_featured,
        featured_title: image.featured_title ?? { de: '', en: '' },
        featured_subtitle: image.featured_subtitle ?? { de: '', en: '' },
    });

    return (
        <Dialog open onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-2xl">
                <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>Bild bearbeiten</DialogTitle>
                        <DialogDescription>Bildunterschrift, Kategorie und Startseiten-Hervorhebung.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
                        <img src={image.thumb_url} alt="" className="aspect-square w-full rounded-md object-cover" />
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="img-category">Kategorie</Label>
                                <select id="img-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as GalleryCategory })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                                    {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                                </select>
                            </div>
                            <TranslatedInput label="Bildunterschrift" value={form.caption} onChange={(caption) => setForm({ ...form, caption })} />
                        </div>
                    </div>
                    <fieldset className="space-y-4 rounded-md border border-border p-4">
                        <label className="flex items-center gap-3 text-sm font-semibold">
                            <Switch checked={!!form.is_featured} onCheckedChange={(is_featured) => setForm({ ...form, is_featured })} />
                            Auf der Startseite unter „Signature-Burger“ zeigen
                        </label>
                        {form.is_featured && (
                            <>
                                <TranslatedInput label="Titel auf der Startseite" value={form.featured_title} onChange={(featured_title) => setForm({ ...form, featured_title })} />
                                <TranslatedInput label="Untertitel" value={form.featured_subtitle} onChange={(featured_subtitle) => setForm({ ...form, featured_subtitle })} />
                            </>
                        )}
                    </fieldset>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Abbrechen</Button>
                        <Button type="submit" disabled={saving}>Speichern</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
