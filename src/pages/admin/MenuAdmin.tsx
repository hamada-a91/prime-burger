import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import {
    useAdminCategories, useAdminItems, useDeleteCategory, useDeleteItem, useReorderCategories, useReorderItems, useSaveCategory, useSaveItem,
    type CategoryInput, type ItemInput,
} from '@/hooks/api';
import { formatPrice } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { TranslatedInput } from '@/components/admin/TranslatedInput';
import { cn } from '@/lib/utils';
import type { Allergen, MenuCategory, MenuItem, MenuTag, MenuVariant } from '@/types/api';

const ALLERGENS: { code: Allergen; label: string }[] = [
    { code: 'A', label: 'Gluten' }, { code: 'B', label: 'Krebstiere' }, { code: 'C', label: 'Eier' }, { code: 'D', label: 'Fisch' },
    { code: 'E', label: 'Erdnüsse' }, { code: 'F', label: 'Soja' }, { code: 'G', label: 'Milch' }, { code: 'H', label: 'Schalenfrüchte' },
    { code: 'L', label: 'Sellerie' }, { code: 'M', label: 'Senf' }, { code: 'N', label: 'Sesam' }, { code: 'O', label: 'Schwefeldioxid' },
    { code: 'P', label: 'Lupinen' }, { code: 'R', label: 'Weichtiere' },
];

const TAGS: { key: MenuTag; label: string }[] = [
    { key: 'vegan', label: 'Vegan' }, { key: 'vegetarian', label: 'Vegetarisch' }, { key: 'spicy', label: 'Scharf' },
    { key: 'signature', label: 'Signature' }, { key: 'new', label: 'Neu' },
];

export function MenuAdmin() {
    const { data: categories, isLoading } = useAdminCategories();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [categoryDialog, setCategoryDialog] = useState<{ open: boolean; category?: MenuCategory }>({ open: false });
    const [itemDialog, setItemDialog] = useState<{ open: boolean; item?: MenuItem }>({ open: false });
    const [deleteCategory, setDeleteCategory] = useState<MenuCategory | null>(null);
    const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);

    const reorderCategories = useReorderCategories();
    const removeCategory = useDeleteCategory();
    const removeItem = useDeleteItem();
    const saveItem = useSaveItem();
    const reorderItems = useReorderItems();

    useEffect(() => {
        if (!selectedId && categories?.length) setSelectedId(categories[0].id);
    }, [categories, selectedId]);

    const selected = categories?.find((c) => c.id === selectedId);
    const { data: items, isLoading: itemsLoading } = useAdminItems(selectedId ?? undefined);

    const moveCategory = (index: number, dir: -1 | 1) => {
        if (!categories) return;
        const ids = categories.map((c) => c.id);
        const target = index + dir;
        if (target < 0 || target >= ids.length) return;
        [ids[index], ids[target]] = [ids[target], ids[index]];
        reorderCategories.mutate(ids, { onError: () => toast.error('Reihenfolge konnte nicht gespeichert werden.') });
    };

    const moveItem = (index: number, dir: -1 | 1) => {
        if (!items) return;
        const ids = items.map((i) => i.id);
        const target = index + dir;
        if (target < 0 || target >= ids.length) return;
        [ids[index], ids[target]] = [ids[target], ids[index]];
        reorderItems.mutate(ids, { onError: () => toast.error('Reihenfolge konnte nicht gespeichert werden.') });
    };

    const toggleAvailable = (item: MenuItem) => {
        const { id, category, sort_order, ...rest } = item;
        void category;
        void sort_order;
        saveItem.mutate({ id, ...rest, is_available: !item.is_available }, { onError: () => toast.error('Speichern fehlgeschlagen.') });
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Categories */}
            <aside className="rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h2 className="font-bold">Kategorien</h2>
                    <Button size="sm" variant="outline" onClick={() => setCategoryDialog({ open: true })}><Plus /> Neu</Button>
                </div>
                {isLoading ? (
                    <div className="space-y-2 p-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
                ) : (
                    <ul className="p-2">
                        {categories?.map((category, index) => (
                            <li key={category.id} className="group flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(category.id)}
                                    className={cn(
                                        'flex min-w-0 flex-1 items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors',
                                        selectedId === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                                    )}
                                >
                                    <span className="truncate">{category.name.de}</span>
                                    {!category.is_active && <EyeOff className="size-3.5 shrink-0 opacity-70" aria-label="ausgeblendet" />}
                                    <span className="ml-auto text-xs opacity-70 tabular">{category.items_count ?? 0}</span>
                                </button>
                                <div className="flex shrink-0 flex-col">
                                    <button type="button" onClick={() => moveCategory(index, -1)} disabled={index === 0} className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="nach oben"><ArrowUp className="size-3.5" /></button>
                                    <button type="button" onClick={() => moveCategory(index, 1)} disabled={index === categories.length - 1} className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="nach unten"><ArrowDown className="size-3.5" /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </aside>

            {/* Items */}
            <section className="rounded-lg border border-border bg-card">
                {selected ? (
                    <>
                        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
                            <div className="min-w-0 flex-1">
                                <h2 className="truncate font-bold">{selected.name.de} <span className="font-normal text-muted-foreground">/ {selected.name.en || 'EN fehlt'}</span></h2>
                                {selected.description?.de && <p className="truncate text-xs text-muted-foreground">{selected.description.de}</p>}
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => setCategoryDialog({ open: true, category: selected })}><Pencil /> Kategorie</Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteCategory(selected)}><Trash2 /></Button>
                            <Button size="sm" onClick={() => setItemDialog({ open: true })}><Plus /> Gericht</Button>
                        </div>

                        {itemsLoading ? (
                            <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
                        ) : !items?.length ? (
                            <p className="p-10 text-center text-sm text-muted-foreground">Noch keine Gerichte in dieser Kategorie.</p>
                        ) : (
                            <ul className="divide-y divide-border">
                                {items.map((item, index) => (
                                    <li key={item.id} className={cn('flex items-center gap-3 px-4 py-3', !item.is_available && 'opacity-60')}>
                                        <div className="flex shrink-0 flex-col">
                                            <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="nach oben"><ArrowUp className="size-3.5" /></button>
                                            <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="nach unten"><ArrowDown className="size-3.5" /></button>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold">
                                                {item.name.de}
                                                {item.tags?.map((tag) => (
                                                    <span key={tag} className="ml-2 rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">{TAGS.find((t) => t.key === tag)?.label}</span>
                                                ))}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {item.description?.de || 'Keine Beschreibung'}
                                                {item.allergens?.length ? ` · ${item.allergens.join(', ')}` : ''}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right text-sm font-bold tabular">
                                            {item.variants?.length
                                                ? item.variants.map((v, i) => <span key={i} className="block text-xs font-semibold text-muted-foreground">{v.label.de} {formatPrice(v.price, 'de')}</span>)
                                                : formatPrice(item.price, 'de')}
                                        </div>
                                        <Switch checked={item.is_available} onCheckedChange={() => toggleAvailable(item)} aria-label="Verfügbar" />
                                        <Button size="icon-sm" variant="ghost" onClick={() => setItemDialog({ open: true, item })} aria-label="Bearbeiten"><Pencil /></Button>
                                        <Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteItem(item)} aria-label="Löschen"><Trash2 /></Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                ) : (
                    <p className="p-10 text-center text-sm text-muted-foreground">Legen Sie zuerst eine Kategorie an.</p>
                )}
            </section>

            <CategoryDialog
                key={categoryDialog.category?.id ?? 'new'}
                open={categoryDialog.open}
                category={categoryDialog.category}
                onClose={() => setCategoryDialog({ open: false })}
                onSaved={(saved) => setSelectedId(saved.id)}
            />

            {selected && (
                <ItemDialog
                    key={itemDialog.item?.id ?? `new-${selected.id}`}
                    open={itemDialog.open}
                    item={itemDialog.item}
                    categories={categories ?? []}
                    defaultCategoryId={selected.id}
                    onClose={() => setItemDialog({ open: false })}
                />
            )}

            <ConfirmDialog
                open={!!deleteCategory}
                title="Kategorie löschen?"
                description={deleteCategory ? `„${deleteCategory.name.de}“ und alle ${deleteCategory.items_count ?? 0} Gerichte darin werden gelöscht.` : undefined}
                loading={removeCategory.isPending}
                onCancel={() => setDeleteCategory(null)}
                onConfirm={async () => {
                    if (!deleteCategory) return;
                    try {
                        await removeCategory.mutateAsync(deleteCategory.id);
                        toast.success('Kategorie gelöscht.');
                        setSelectedId(null);
                        setDeleteCategory(null);
                    } catch {
                        toast.error('Löschen fehlgeschlagen.');
                    }
                }}
            />

            <ConfirmDialog
                open={!!deleteItem}
                title="Gericht löschen?"
                description={deleteItem ? `„${deleteItem.name.de}“ wird dauerhaft entfernt.` : undefined}
                loading={removeItem.isPending}
                onCancel={() => setDeleteItem(null)}
                onConfirm={async () => {
                    if (!deleteItem) return;
                    try {
                        await removeItem.mutateAsync(deleteItem.id);
                        toast.success('Gericht gelöscht.');
                        setDeleteItem(null);
                    } catch {
                        toast.error('Löschen fehlgeschlagen.');
                    }
                }}
            />
        </div>
    );
}

function CategoryDialog({ open, category, onClose, onSaved }: { open: boolean; category?: MenuCategory; onClose: () => void; onSaved: (c: MenuCategory) => void }) {
    const save = useSaveCategory();
    const [form, setForm] = useState<CategoryInput>({
        name: category?.name ?? { de: '', en: '' },
        description: category?.description ?? { de: '', en: '' },
        is_active: category?.is_active ?? true,
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.de?.trim()) return toast.error('Deutscher Name fehlt.');
        try {
            const saved = await save.mutateAsync({ id: category?.id, ...form });
            toast.success('Kategorie gespeichert.');
            onSaved(saved);
            onClose();
        } catch {
            toast.error('Speichern fehlgeschlagen.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <form onSubmit={submit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>{category ? 'Kategorie bearbeiten' : 'Neue Kategorie'}</DialogTitle>
                        <DialogDescription>Name und optionale Beschreibung, jeweils Deutsch und Englisch.</DialogDescription>
                    </DialogHeader>
                    <TranslatedInput label="Name" required value={form.name} onChange={(name) => setForm({ ...form, name })} />
                    <TranslatedInput label="Beschreibung" multiline rows={2} value={form.description} onChange={(description) => setForm({ ...form, description })} />
                    <label className="flex items-center gap-3 text-sm font-semibold">
                        <Switch checked={form.is_active} onCheckedChange={(is_active) => setForm({ ...form, is_active })} />
                        Auf der Website anzeigen
                    </label>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Abbrechen</Button>
                        <Button type="submit" disabled={save.isPending}>Speichern</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ItemDialog({ open, item, categories, defaultCategoryId, onClose }: { open: boolean; item?: MenuItem; categories: MenuCategory[]; defaultCategoryId: number; onClose: () => void }) {
    const save = useSaveItem();
    const [priceMode, setPriceMode] = useState<'single' | 'variants'>(item?.variants?.length ? 'variants' : 'single');
    const [form, setForm] = useState<ItemInput>({
        category_id: item?.category_id ?? defaultCategoryId,
        name: item?.name ?? { de: '', en: '' },
        description: item?.description ?? { de: '', en: '' },
        price: item?.price ?? '',
        variants: item?.variants ?? [],
        price_note: item?.price_note ?? { de: '', en: '' },
        allergens: item?.allergens ?? [],
        tags: item?.tags ?? [],
        is_available: item?.is_available ?? true,
    });

    const variants = useMemo(() => form.variants ?? [], [form.variants]);
    const setVariants = (next: MenuVariant[]) => setForm({ ...form, variants: next });

    const toggle = <T,>(list: T[] | null | undefined, value: T): T[] => (list?.includes(value) ? list.filter((v) => v !== value) : [...(list ?? []), value]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.de?.trim()) return toast.error('Deutscher Name fehlt.');
        const payload: ItemInput = {
            ...form,
            price: priceMode === 'single' && form.price !== '' && form.price !== null ? Number(form.price) : null,
            variants: priceMode === 'variants' ? variants.filter((v) => v.label.de?.trim()) : null,
        };
        try {
            await save.mutateAsync({ id: item?.id, ...payload });
            toast.success('Gericht gespeichert.');
            onClose();
        } catch {
            toast.error('Speichern fehlgeschlagen. Bitte Eingaben prüfen.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-2xl">
                <form onSubmit={submit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>{item ? 'Gericht bearbeiten' : 'Neues Gericht'}</DialogTitle>
                        <DialogDescription>Pflichtfeld ist nur der deutsche Name. Ohne englische Texte wird Deutsch angezeigt.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-1">
                        <Label htmlFor="item-category">Kategorie</Label>
                        <select id="item-category" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name.de}</option>)}
                        </select>
                    </div>

                    <TranslatedInput label="Name" required value={form.name} onChange={(name) => setForm({ ...form, name })} />
                    <TranslatedInput label="Beschreibung" multiline value={form.description} onChange={(description) => setForm({ ...form, description })} />

                    <fieldset className="space-y-3 rounded-md border border-border p-4">
                        <legend className="px-1 text-sm font-semibold">Preis</legend>
                        <div className="flex gap-2" role="group">
                            {(['single', 'variants'] as const).map((mode) => (
                                <button key={mode} type="button" onClick={() => setPriceMode(mode)} aria-pressed={priceMode === mode} className={cn('rounded-full border px-3 py-1 text-xs font-bold', priceMode === mode ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground')}>
                                    {mode === 'single' ? 'Ein Preis' : 'Varianten (z. B. Größen)'}
                                </button>
                            ))}
                        </div>
                        {priceMode === 'single' ? (
                            <div className="flex items-center gap-2">
                                <Input type="number" step="0.10" min="0" value={form.price ?? ''} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-32" aria-label="Preis in Euro" />
                                <span className="text-sm text-muted-foreground">€</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {variants.map((variant, i) => (
                                    <div key={i} className="grid grid-cols-[1fr_1fr_100px_auto] items-center gap-2">
                                        <Input placeholder="Label DE (0,2 l)" value={variant.label.de ?? ''} onChange={(e) => setVariants(variants.map((v, j) => (j === i ? { ...v, label: { ...v.label, de: e.target.value } } : v)))} />
                                        <Input placeholder="Label EN (0.2 l)" value={variant.label.en ?? ''} onChange={(e) => setVariants(variants.map((v, j) => (j === i ? { ...v, label: { ...v.label, en: e.target.value } } : v)))} />
                                        <Input type="number" step="0.10" min="0" value={variant.price} onChange={(e) => setVariants(variants.map((v, j) => (j === i ? { ...v, price: Number(e.target.value) } : v)))} aria-label="Preis" />
                                        <Button type="button" size="icon-sm" variant="ghost" onClick={() => setVariants(variants.filter((_, j) => j !== i))} aria-label="Variante entfernen"><Trash2 /></Button>
                                    </div>
                                ))}
                                <Button type="button" size="sm" variant="outline" onClick={() => setVariants([...variants, { label: { de: '', en: '' }, price: 0 }])}><Plus /> Variante</Button>
                            </div>
                        )}
                        <TranslatedInput label="Preishinweis (optional)" value={form.price_note} onChange={(price_note) => setForm({ ...form, price_note })} />
                    </fieldset>

                    <fieldset className="space-y-2">
                        <legend className="text-sm font-semibold">Allergene</legend>
                        <div className="flex flex-wrap gap-1.5">
                            {ALLERGENS.map((a) => (
                                <button key={a.code} type="button" onClick={() => setForm({ ...form, allergens: toggle(form.allergens, a.code) })} aria-pressed={form.allergens?.includes(a.code)} className={cn('rounded-md border px-2 py-1 text-xs font-semibold', form.allergens?.includes(a.code) ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>
                                    <span className="font-bold">{a.code}</span> {a.label}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="space-y-2">
                        <legend className="text-sm font-semibold">Kennzeichnung</legend>
                        <div className="flex flex-wrap gap-1.5">
                            {TAGS.map((tag) => (
                                <button key={tag.key} type="button" onClick={() => setForm({ ...form, tags: toggle(form.tags, tag.key) })} aria-pressed={form.tags?.includes(tag.key)} className={cn('rounded-full border px-3 py-1 text-xs font-bold', form.tags?.includes(tag.key) ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <label className="flex items-center gap-3 text-sm font-semibold">
                        <Switch checked={form.is_available} onCheckedChange={(is_available) => setForm({ ...form, is_available })} />
                        <span className="inline-flex items-center gap-1.5">{form.is_available ? <Eye className="size-4" /> : <EyeOff className="size-4" />} Verfügbar / auf der Karte sichtbar</span>
                    </label>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Abbrechen</Button>
                        <Button type="submit" disabled={save.isPending}>Speichern</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
