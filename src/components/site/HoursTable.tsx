import { useSiteInfo } from '@/hooks';
import { useT } from '@/i18n';
import { DAY_KEYS, dayKeyFor, groupHours } from '@/lib/opening-hours';
import { cn } from '@/lib/utils';

/** Opening hours, grouped (Mon-Thu, Fri-Sat, Sun) or per day. */
export function HoursTable({ grouped = true, className }: { grouped?: boolean; className?: string }) {
    const t = useT();
    const { hours } = useSiteInfo();
    const today = dayKeyFor(new Date());

    if (!hours) return null;

    const rows = grouped
        ? groupHours(hours).map((g) => ({
            key: g.from,
            label: g.from === g.to ? t(`hours.days.${g.from}`) : `${t(`hours.daysShort.${g.from}`)} - ${t(`hours.daysShort.${g.to}`)}`,
            day: g.day,
            isToday: DAY_KEYS.indexOf(today) >= DAY_KEYS.indexOf(g.from) && DAY_KEYS.indexOf(today) <= DAY_KEYS.indexOf(g.to),
        }))
        : DAY_KEYS.map((key) => ({ key, label: t(`hours.days.${key}`), day: hours[key], isToday: key === today }));

    const oclock = t('hours.oclock');

    return (
        <dl className={cn('grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm', className)}>
            {rows.map((row) => (
                <div key={row.key} className="contents">
                    <dt className={cn('text-muted-foreground', row.isToday && 'text-foreground font-semibold')}>{row.label}</dt>
                    <dd className={cn('tabular text-right', row.isToday && 'font-semibold')}>
                        {row.day.closed ? t('hours.closed') : `${row.day.open} - ${row.day.close}${oclock ? ` ${oclock}` : ''}`}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
