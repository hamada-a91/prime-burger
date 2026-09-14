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
        <p className={cn('inline-flex items-center gap-2 text-sm font-semibold', className)}>
            <span
                aria-hidden
                className={cn('size-2 rounded-full', status.isOpen ? 'bg-success' : 'bg-muted-foreground')}
            />
            <span>{status.isOpen ? t('hours.openNow') : t('hours.closedNow')}</span>
            {detail && <span className="text-muted-foreground font-medium">{detail}</span>}
        </p>
    );
}
