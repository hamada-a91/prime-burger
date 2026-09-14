import { Facebook, Instagram, MapPin } from 'lucide-react';
import { useSiteConfig, useSiteInfo } from '@/hooks';
import { useT } from '@/i18n';
import { HoursTable } from '@/components/site/HoursTable';
import { LocaleLink } from '@/components/site/LocaleLink';
import { NAV_ITEMS } from './Header';

export function Footer() {
    const t = useT();
    const site = useSiteConfig();
    const info = useSiteInfo();
    const year = new Date().getFullYear();

    const socials = [
        { key: 'instagram', url: info.social.instagram, Icon: Instagram, label: 'Instagram' },
        { key: 'facebook', url: info.social.facebook, Icon: Facebook, label: 'Facebook' },
        { key: 'tripadvisor', url: info.social.tripadvisor, Icon: MapPin, label: 'Tripadvisor' },
    ].filter((s) => s.url);

    return (
        <footer className="border-t border-border bg-surface">
            <div className="container-site py-16">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div className="space-y-5">
                        <LocaleLink to="home" className="inline-flex items-center gap-3" aria-label={site.name}>
                            <img src={site.logo} alt="" width={64} height={57} className="h-14 w-auto" loading="lazy" />
                            <span className="font-display text-3xl text-foreground">Prime Burger</span>
                        </LocaleLink>
                        <p className="max-w-xs text-sm text-muted-foreground">{t('footer.tagline')}</p>
                        {socials.length > 0 && (
                            <div className="flex gap-2">
                                {socials.map(({ key, url, Icon, label }) => (
                                    <a
                                        key={key}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="inline-flex size-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                                    >
                                        <Icon className="size-5" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="font-display text-xl text-foreground mb-4">{t('footer.navigation')}</h2>
                        <ul className="space-y-2.5 text-sm">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.key}>
                                    <LocaleLink to={item.key} className="text-muted-foreground transition-colors hover:text-primary">
                                        {t(item.label)}
                                    </LocaleLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-display text-xl text-foreground mb-4">{t('contact.address')}</h2>
                        <address className="not-italic space-y-2.5 text-sm text-muted-foreground">
                            <p>
                                {info.address.street}
                                <br />
                                {info.address.zip} {info.address.city}
                            </p>
                            <p>
                                <a href={info.phoneHref} className="transition-colors hover:text-primary">{info.phone}</a>
                            </p>
                            <p>
                                <a href={`mailto:${info.email}`} className="transition-colors hover:text-primary break-all">{info.email}</a>
                            </p>
                            <p>
                                <a href={info.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                                    {t('contact.route')}
                                </a>
                            </p>
                        </address>
                    </div>

                    <div>
                        <h2 className="font-display text-xl text-foreground mb-4">{t('hours.title')}</h2>
                        <HoursTable />
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>© {year} {info.name}. {t('footer.rights')}</p>
                    <ul className="flex gap-5">
                        <li><LocaleLink to="imprint" className="hover:text-foreground">{t('nav.imprint')}</LocaleLink></li>
                        <li><LocaleLink to="privacy" className="hover:text-foreground">{t('nav.privacy')}</LocaleLink></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
