import { cn } from '@/lib/utils';
import type { ReservationStatus } from '@/types/api';

export const STATUS_LABELS: Record<ReservationStatus, string> = {
    new: 'Neu',
    confirmed: 'Bestätigt',
    declined: 'Abgelehnt',
    archived: 'Archiviert',
};

const STYLES: Record<ReservationStatus, string> = {
    new: 'bg-amber-100 text-amber-900',
    confirmed: 'bg-emerald-100 text-emerald-900',
    declined: 'bg-red-100 text-red-900',
    archived: 'bg-stone-200 text-stone-700',
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
    return <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-bold', STYLES[status])}>{STATUS_LABELS[status]}</span>;
}
