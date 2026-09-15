import { useSiteInfo } from '@/hooks';
import { useT } from '@/i18n';
import { openStatus } from '@/lib/opening-hours';
import { cn } from '@/lib/utils';

export function OpeningStatus({ className }: { className?: string }) {
    const t = useT();
    const { hours } = useSiteInfo();
    const status = openStatus(hours);

    if (!status) return null;

    const detail = status.time
        ? status.isOpen
            ? t('hours.until', { time: status.time })
            : status.nextDay
              ? `${t(`hours.daysShort.${status.nextDay}`)} ${t('hours.opensAt', { time: status.time })}`
              : t('hours.opensAt', { time: status.time })
        : '';

    return (
        <p className={cn('inline-flex items-center gap-2.5 text-sm font-semibold', className)}>
            <span className="relative flex size-2.5 items-center justify-center shrink-0" aria-hidden>
                {status.isOpen && (
                    <span className="absolute inline-flex size-full rounded-full bg-success opacity-75 animate-ping-soft" />
                )}
                <span
                    className={cn(
                        'relative inline-flex size-2 rounded-full',
                        status.isOpen ? 'bg-success shadow-[0_0_8px_rgba(92,196,138,0.6)]' : 'bg-muted-foreground'
                    )}
                />
            </span>
            <span>{status.isOpen ? t('hours.openNow') : t('hours.closedNow')}</span>
            {detail && <span className="text-muted-foreground font-medium">{detail}</span>}
        </p>
    );
}
