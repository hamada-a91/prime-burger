import { ArrowUpRight } from 'lucide-react';
import { useSiteInfo } from '@/hooks';
import { useT, usePick } from '@/i18n';
import { cn } from '@/lib/utils';

const LOGOS: Record<string, { src: string; className?: string }> = {
    lieferando: { src: '/assets/logo-lieferando.png' },
    ubereats: { src: '/assets/logo-ubereats.webp', className: 'rounded-md' },
    wolt: { src: '/assets/logo-wolt.svg', className: 'rounded-md bg-[#00c2e8] p-2' },
};

export function DeliveryPlatforms({ className }: { className?: string }) {
    const t = useT();
    const pick = usePick();
    const { delivery } = useSiteInfo();

    if (delivery.length === 0) return null;

    return (
        <ul className={cn('grid gap-4 sm:grid-cols-3', className)}>
            {delivery.map((platform) => {
                const logo = LOGOS[platform.key];
                return (
                    <li key={platform.key}>
                        <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/60"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex h-14 w-24 items-center">
                                    {logo ? (
                                        <img src={logo.src} alt={platform.name} className={cn('max-h-14 w-auto max-w-full object-contain', logo.className)} loading="lazy" width={96} height={56} />
                                    ) : (
                                        <span className="font-display text-2xl">{platform.name}</span>
                                    )}
                                </div>
                                {platform.badge && (
                                    <span className="rounded-sm bg-primary/15 px-2 py-1 text-xs font-bold text-primary">{pick(platform.badge)}</span>
                                )}
                            </div>
                            <p className="mt-5 text-sm text-muted-foreground">{t('home.deliveryEta', { eta: platform.eta })}</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                {t('common.orderNow')}
                                <ArrowUpRight className="size-4" aria-hidden />
                            </p>
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
