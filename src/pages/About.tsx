import { Phone } from 'lucide-react';
import { useSiteInfo } from '@/hooks';
import { useDictionary, useT, usePick } from '@/i18n';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo';
import { HoursTable } from '@/components/site/HoursTable';
import { LocaleLink } from '@/components/site/LocaleLink';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';

export function About() {
    const t = useT();
    const pick = usePick();
    const dict = useDictionary();
    const info = useSiteInfo();
    const story = pick(info.settings.about_story);
    const philosophy = pick(info.settings.about_philosophy);

    const badges = [
        { src: '/assets/badge-hausgemacht.webp', title: t('home.badges.homemade'), text: t('home.badges.homemadeText') },
        { src: '/assets/badge-frische-zutaten.webp', title: t('home.badges.fresh'), text: t('home.badges.freshText') },
        { src: '/assets/badge-exzellenter-genuss.webp', title: t('home.badges.taste'), text: t('home.badges.tasteText') },
    ];

    return (
        <>
            <SEOHead title={t('about.seoTitle')} description={t('about.seoDescription')} routeKey="about" />
            <PageHero title={t('about.title')} lead={t('about.lead')} image="/assets/ambience-1.webp" imagePosition="center 55%" />

            {/* Story: two text columns beside a tall photo */}
            <section className="section">
                <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
                    <Reveal>
                        <img src="/assets/table-of-food.webp" alt="" width={1200} height={1500} loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover" />
                    </Reveal>
                    <div className="space-y-12 lg:pt-6">
                        <Reveal>
                            <h2 className="font-display display-lg text-foreground">{t('about.storyTitle')}</h2>
                            <p className="mt-5 text-muted-foreground max-w-[62ch]">{story}</p>
                        </Reveal>
                        <Reveal delay={80}>
                            <h2 className="font-display display-lg text-foreground">{t('about.philosophyTitle')}</h2>
                            <p className="mt-5 text-muted-foreground max-w-[62ch]">{philosophy}</p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Quote band */}
            <section className="border-y border-border bg-surface grain relative isolate">
                <div className="absolute inset-0 -z-10 glow-amber" aria-hidden />
                <div className="container-site py-20 md:py-28">
                    <Reveal>
                        <blockquote className="mx-auto max-w-4xl text-center">
                            <p className="font-display display-xl text-foreground">{t('about.quote')}</p>
                            <footer className="mt-6 text-sm font-semibold text-primary">Prime Burger Leipzig</footer>
                        </blockquote>
                    </Reveal>
                </div>
            </section>

            {/* Timeline */}
            <section className="section">
                <div className="container-site">
                    <Reveal>
                        <h2 className="font-display display-lg text-foreground">{t('about.timelineTitle')}</h2>
                    </Reveal>
                    <ol className="mt-12 grid gap-10 border-l border-border pl-8 md:grid-cols-3 md:gap-8 md:border-l-0 md:border-t md:pl-0 md:pt-10">
                        {dict.about.timeline.map((step, i) => (
                            <Reveal as="li" key={step.year} delay={i * 100} className="relative">
                                <span className="absolute -left-[37px] top-1.5 size-2.5 rounded-full bg-primary md:-top-[45px] md:left-0" aria-hidden />
                                <p className="font-display text-4xl text-primary">{step.year}</p>
                                <h3 className="mt-3 text-lg font-bold text-foreground">{step.title}</h3>
                                <p className="mt-2 text-muted-foreground">{step.text}</p>
                            </Reveal>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Values with badge images */}
            <section className="border-t border-border bg-surface">
                <div className="container-site section">
                    <Reveal>
                        <h2 className="font-display display-lg text-foreground">{t('about.valuesTitle')}</h2>
                    </Reveal>
                    <ul className="mt-10 grid gap-6 md:grid-cols-3">
                        {badges.map((badge, i) => (
                            <Reveal as="li" key={badge.title} delay={i * 80} className="overflow-hidden rounded-lg border border-border bg-card">
                                <img src={badge.src} alt="" width={768} height={512} loading="lazy" className="w-full" />
                                <div className="p-5">
                                    <h3 className="font-display text-2xl text-foreground">{badge.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{badge.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Ambience photos + visit info */}
            <section className="section">
                <div className="container-site grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
                    <Reveal className="grid grid-cols-2 gap-4">
                        <img src="/assets/ambience-2.webp" alt="" width={1200} height={1500} loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover" />
                        <img src="/assets/ambience-3.webp" alt="" width={1200} height={1500} loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover mt-10" />
                    </Reveal>
                    <Reveal delay={100} className="lg:pt-4">
                        <h2 className="font-display display-lg text-foreground">{t('about.visitTitle')}</h2>
                        <p className="mt-4 text-muted-foreground">{t('about.visitText')}</p>
                        <address className="not-italic mt-6 text-foreground font-semibold">
                            {info.address.street}
                            <br />
                            {info.address.zip} {info.address.city}
                        </address>
                        <div className="mt-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">{t('hours.title')}</h3>
                            <HoursTable />
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild size="lg">
                                <LocaleLink to="reservation">{t('common.reserve')}</LocaleLink>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <a href={info.phoneHref}>
                                    <Phone aria-hidden /> {t('common.call')}
                                </a>
                            </Button>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
