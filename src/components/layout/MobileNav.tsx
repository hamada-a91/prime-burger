import { Phone } from 'lucide-react';
import { useSiteInfo } from '@/hooks';
import { useT } from '@/i18n';
import { Button } from '@/components/ui/button';
import { LocaleLink, LocaleNavLink } from '@/components/site/LocaleLink';
import { OpeningStatus } from '@/components/site/OpeningStatus';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './Header';

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
    const t = useT();
    const { phone, phoneHref } = useSiteInfo();

    return (
        <div
            id="mobile-nav"
            className={cn(
                'lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-[45] bg-background transition-opacity duration-200',
                open ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
            aria-hidden={!open}
        >
            <nav className="container-site flex h-full flex-col py-8" aria-label="Mobile Navigation">
                <ul className="space-y-2">
                    {NAV_ITEMS.map((item, i) => (
                        <li key={item.key} className={cn(open && 'fade-up')} style={{ animationDelay: `${i * 50}ms` }}>
                            <LocaleNavLink
                                to={item.key}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    cn('font-display block py-2 text-5xl transition-colors', isActive ? 'text-primary' : 'text-foreground hover:text-primary')
                                }
                            >
                                {t(item.label)}
                            </LocaleNavLink>
                        </li>
                    ))}
                </ul>

                <div className="mt-auto space-y-4 border-t border-border pt-6">
                    <OpeningStatus />
                    <div className="grid grid-cols-2 gap-3">
                        <Button asChild variant="outline" size="lg">
                            <a href={phoneHref}>
                                <Phone aria-hidden /> {t('common.call')}
                            </a>
                        </Button>
                        <Button asChild size="lg">
                            <LocaleLink to="reservation" onClick={onClose}>{t('nav.reservation')}</LocaleLink>
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                </div>
            </nav>
        </div>
    );
}
