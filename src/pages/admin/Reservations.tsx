import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, Mail, Phone, Search, Trash2, X } from 'lucide-react';
import { useAdminReservations, useDeleteReservation, useUpdateReservationStatus } from '@/hooks/api';
import { formatDate } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StatusBadge, STATUS_LABELS } from '@/components/admin/StatusBadge';
import { telHref } from '@/lib/opening-hours';
import { cn } from '@/lib/utils';
import type { Reservation, ReservationStatus } from '@/types/api';

const STATUSES: ReservationStatus[] = ['new', 'confirmed', 'declined', 'archived'];

export function Reservations() {
    const [params, setParams] = useSearchParams();
    const status = (params.get('status') ?? '') as ReservationStatus | '';
    const date = params.get('date') ?? '';
    const search = params.get('search') ?? '';
    const page = Number(params.get('page') ?? '1');

    const { data, isLoading, isFetching } = useAdminReservations({ status, date, search, page });
    const updateStatus = useUpdateReservationStatus();
    const remove = useDeleteReservation();
    const [selected, setSelected] = useState<Reservation | null>(null);
    const [toDelete, setToDelete] = useState<Reservation | null>(null);

    const setParam = (key: string, value: string) => {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== 'page') next.delete('page');
        setParams(next);
    };

    const changeStatus = async (reservation: Reservation, next: ReservationStatus) => {
        try {
            const updated = await updateStatus.mutateAsync({ id: reservation.id, status: next });
            setSelected((current) => (current?.id === updated.id ? updated : current));
            toast.success(
                updated.mail_sent
                    ? `Bestätigt. ${updated.name} hat die Zusage per E-Mail erhalten.`
                    : `Status: ${STATUS_LABELS[next]}`
            );
        } catch {
            toast.error('Status konnte nicht geändert werden.');
        }
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        try {
            await remove.mutateAsync(toDelete.id);
            toast.success('Anfrage gelöscht.');
            setToDelete(null);
            setSelected(null);
        } catch {
            toast.error('Löschen fehlgeschlagen.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-4">
                <div className="flex flex-wrap gap-1" role="group" aria-label="Status">
                    {(['', ...STATUSES] as const).map((s) => (
                        <button
                            key={s || 'all'}
                            type="button"
                            onClick={() => setParam('status', s)}
                            aria-pressed={status === s}
                            className={cn(
                                'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
                                status === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {s ? STATUS_LABELS[s] : 'Alle'}
                        </button>
                    ))}
                </div>
                <div className="ml-auto flex flex-wrap items-end gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="filter-date" className="text-xs">Datum</Label>
                        <Input id="filter-date" type="date" value={date} onChange={(e) => setParam('date', e.target.value)} className="h-9 w-40" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="filter-search" className="text-xs">Suche</Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                            <Input id="filter-search" defaultValue={search} placeholder="Name, E-Mail, Telefon" onKeyDown={(e) => e.key === 'Enter' && setParam('search', (e.target as HTMLInputElement).value)} onBlur={(e) => setParam('search', e.target.value)} className="h-9 w-56 pl-8" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={cn('overflow-hidden rounded-lg border border-border bg-card transition-opacity', isFetching && 'opacity-70')}>
                {isLoading ? (
                    <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
                ) : !data?.data.length ? (
                    <p className="p-10 text-center text-sm text-muted-foreground">Keine Anfragen gefunden.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">Termin</th>
                                    <th className="px-4 py-3">Gast</th>
                                    <th className="px-4 py-3">Personen</th>
                                    <th className="px-4 py-3">Kontakt</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Eingegangen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.data.map((r) => (
                                    <tr key={r.id} onClick={() => setSelected(r)} className="cursor-pointer transition-colors hover:bg-secondary/60">
                                        <td className="px-4 py-3 font-semibold tabular whitespace-nowrap">{formatDate(r.date, 'de')} <span className="text-muted-foreground">{r.time}</span></td>
                                        <td className="px-4 py-3">
                                            <span className="block font-semibold">{r.name}</span>
                                            {r.notes && <span className="block max-w-xs truncate text-xs text-muted-foreground">{r.notes}</span>}
                                        </td>
                                        <td className="px-4 py-3 tabular">{r.guests}</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            <span className="block">{r.phone}</span>
                                            <span className="block truncate max-w-[200px]">{r.email}</span>
                                        </td>
                                        <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                                        <td className="px-4 py-3 text-right text-muted-foreground tabular whitespace-nowrap">{formatDate(r.created_at, 'de', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {data && data.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
                        <span className="text-muted-foreground">Seite {data.current_page} von {data.last_page} ({data.total} Anfragen)</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setParam('page', String(page - 1))}>Zurück</Button>
                            <Button variant="outline" size="sm" disabled={page >= data.last_page} onClick={() => setParam('page', String(page + 1))}>Weiter</Button>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="max-w-xl">
                    {selected && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                    {selected.name} <StatusBadge status={selected.status} />
                                </DialogTitle>
                                <DialogDescription>
                                    {formatDate(selected.date, 'de', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} um {selected.time} Uhr, {selected.guests} {selected.guests === 1 ? 'Person' : 'Personen'}
                                </DialogDescription>
                            </DialogHeader>

                            <dl className="grid gap-3 text-sm sm:grid-cols-2">
                                <div>
                                    <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Telefon</dt>
                                    <dd><a href={telHref(selected.phone)} className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"><Phone className="size-3.5" />{selected.phone}</a></dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">E-Mail</dt>
                                    <dd><a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Ihre Reservierung bei Prime Burger am ${formatDate(selected.date, 'de')}`)}`} className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline break-all"><Mail className="size-3.5 shrink-0" />{selected.email}</a></dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sprache des Gastes</dt>
                                    <dd className="font-semibold uppercase">{selected.locale}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Eingegangen</dt>
                                    <dd className="font-semibold tabular">{formatDate(selected.created_at, 'de', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Besondere Wünsche</dt>
                                    <dd className="whitespace-pre-wrap">{selected.notes || <span className="text-muted-foreground">Keine</span>}</dd>
                                </div>
                            </dl>

                            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                                {selected.status !== 'confirmed' && (
                                    <Button onClick={() => changeStatus(selected, 'confirmed')} disabled={updateStatus.isPending}><Check /> Bestätigt</Button>
                                )}
                                {selected.status !== 'declined' && (
                                    <Button variant="outline" onClick={() => changeStatus(selected, 'declined')} disabled={updateStatus.isPending}><X /> Abgelehnt</Button>
                                )}
                                {selected.status !== 'archived' && (
                                    <Button variant="ghost" onClick={() => changeStatus(selected, 'archived')} disabled={updateStatus.isPending}>Archivieren</Button>
                                )}
                                {selected.status !== 'new' && (
                                    <Button variant="ghost" onClick={() => changeStatus(selected, 'new')} disabled={updateStatus.isPending}>Als neu markieren</Button>
                                )}
                                <Button variant="ghost" className="ml-auto text-destructive hover:text-destructive" onClick={() => setToDelete(selected)}><Trash2 /> Löschen</Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                „Bestätigt“ schickt dem Gast automatisch eine Zusage per E-Mail (in seiner Sprache). Für Absagen und Rückfragen bitte anrufen oder auf die E-Mail antworten.
                            </p>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!toDelete}
                title="Anfrage löschen?"
                description={toDelete ? `Die Anfrage von ${toDelete.name} wird dauerhaft entfernt.` : undefined}
                loading={remove.isPending}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
}
