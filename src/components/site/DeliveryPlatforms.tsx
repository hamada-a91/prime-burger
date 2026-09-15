import { ArrowUpRight } from 'lucide-react';
import { useSiteInfo } from '@/hooks';
import { useT, usePick } from '@/i18n';
import { cn } from '@/lib/utils';
import { CardSpotlight } from './CardSpotlight';

const LOGOS: Record<string, { src: string; className?: string; glow?: string }> = {
    lieferando: { src: '/assets/logo-lieferando.png', glow: 'rgba(255, 128, 0, 0.18)' },
    ubereats: { src: '/assets/logo-ubereats.webp', className: 'rounded-md', glow: 'rgba(6, 193, 103, 0.18)' },
    wolt: { src: '/assets/logo-wolt.svg', className: 'rounded-md bg-[#00c2e8] p-2', glow: 'rgba(0, 194, 232, 0.18)' },
};

export function DeliveryPlatforms({ className }: { className?: string }) {
    const t = useT();
    const pick = usePick();
    const { delivery } = useSiteInfo();

    if (delivery.length === 0) return null;

    return (
        <ul className={cn('grid gap-4 sm:grid-cols-3', className)}>
            {delivery.map((platform) => {
                const config = LOGOS[platform.key];
                return (
                    <li key={platform.key}>
                        <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                        >
                            <CardSpotlight
                                glowColor={config?.glow || 'rgba(245, 161, 26, 0.18)'}
                                className="h-full flex flex-col p-6 transition-all duration-300 hover:border-primary/50"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex h-14 w-24 items-center">
                                        {config ? (
                                            <img
                                                src={config.src}
                                                alt={platform.name}
                                                className={cn('max-h-14 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105', config.className)}
                                                loading="lazy"
                                                width={96}
                                                height={56}
                                            />
                                        ) : (
                                            <span className="font-display text-2xl">{platform.name}</span>
                                        )}
                                    </div>
                                    {platform.badge && (
                                        <span className="rounded-sm bg-primary/15 px-2 py-1 text-xs font-bold text-primary transition-transform duration-200 group-hover:scale-105">
                                            {pick(platform.badge)}
                                        </span>
                                    )}
                                </div>
                                <p className="mt-5 text-sm text-muted-foreground">{t('home.deliveryEta', { eta: platform.eta })}</p>
                                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                    {t('common.orderNow')}
                                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                                </p>
                            </CardSpotlight>
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
