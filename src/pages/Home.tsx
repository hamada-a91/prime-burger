import { useState } from 'react';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { useGallery } from '@/hooks/api';
import { useSiteInfo } from '@/hooks';
import { useT, usePick } from '@/i18n';
import { dayKeyFor } from '@/lib/opening-hours';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo';
import { DeliveryPlatforms } from '@/components/site/DeliveryPlatforms';
import { LocaleLink } from '@/components/site/LocaleLink';
import { OpeningStatus } from '@/components/site/OpeningStatus';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Marquee } from '@/components/site/Marquee';
import { CardSpotlight } from '@/components/site/CardSpotlight';
import { cn } from '@/lib/utils';

export function Home() {
    const t = useT();
    const pick = usePick();
    const info = useSiteInfo();
    const { data: featured } = useGallery({ featured: true });

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 18;
        setMousePos({ x, y });
    };

    const handleHeroMouseLeave = () => {
        setMousePos({ x: 0, y: 0 });
    };

    const today = info.hours?.[dayKeyFor(new Date())];
    const headline = pick(info.settings.hero_headline) || t('common.siteNameLong');
    const subline = pick(info.settings.hero_subline);
    const story = pick(info.settings.about_story);
    const philosophy = pick(info.settings.about_philosophy);

    const badges = [
        { src: '/assets/badge-hausgemacht.webp', title: t('home.badges.homemade'), text: t('home.badges.homemadeText') },
        { src: '/assets/badge-frische-zutaten.webp', title: t('home.badges.fresh'), text: t('home.badges.freshText') },
        { src: '/assets/badge-exzellenter-genuss.webp', title: t('home.badges.taste'), text: t('home.badges.tasteText') },
    ];

    const creations = featured ?? [];
    const [lead, ...rest] = creations;

    return (
        <>
            <SEOHead title={t('home.seoTitle')} description={t('home.seoDescription')} routeKey="home" />

            {/* Hero: interactive mouse parallax, floating burger, ambient glow */}
            <section
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={handleHeroMouseLeave}
                className="relative isolate overflow-hidden bg-background grain min-h-[100svh] flex flex-col justify-end pt-[72px] lg:flex-row lg:items-center lg:justify-start lg:pt-0"
            >
                <div
                    className="absolute inset-0 -z-10 glow-amber-animated transition-transform duration-700 ease-out"
                    style={{
                        transform: `translate3d(${-mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px, 0)`,
                    }}
                    aria-hidden
                />
                {/* Mobile/Tablet: the burger sits as a real block above the text (top 55 % of the viewport).
                    Desktop: absolutely positioned on the right, blended in with a mask. */}
                <picture
                    className="block h-[55svh] min-h-[320px] w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[58%] lg:[mask-image:linear-gradient(to_right,transparent,black_30%)] lg:transition-transform lg:duration-700 lg:ease-out -z-10"
                    style={{
                        transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
                    }}
                >
                    <source media="(min-width: 1024px)" srcSet="/assets/hero-burger.webp" />
                    <img
                        src="/assets/hero-burger-mobile.webp"
                        alt=""
                        width={900}
                        height={1200}
                        fetchPriority="high"
                        className="h-full w-full object-cover object-[55%_30%] lg:object-[60%_center] animate-float"
                    />
                </picture>

                <div className="container-site -mt-24 pb-16 lg:mt-0 lg:py-24">
                    <div className="max-w-2xl">
                        <p className="eyebrow mb-5 fade-up">{t('home.heroEyebrow')}</p>
                        <h1 className="font-display display-hero text-foreground fade-up" style={{ animationDelay: '90ms' }}>
                            {headline}
                        </h1>
                        {subline && (
                            <p className="mt-6 max-w-lg text-lg text-muted-foreground md:text-xl fade-up" style={{ animationDelay: '180ms' }}>
                                {subline}
                            </p>
                        )}
                        <div className="mt-9 flex flex-wrap gap-3.5 fade-up" style={{ animationDelay: '270ms' }}>
                            <Button asChild size="xl">
                                <LocaleLink to="reservation">{t('common.reserve')}</LocaleLink>
                            </Button>
                            <Button asChild size="xl" variant="outline">
                                <LocaleLink to="menu">{t('common.viewMenu')}</LocaleLink>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Infinite Brand Highlights Marquee */}
            <Marquee />

            {/* Info strip with staggered entrance */}
            <section className="border-b border-border bg-surface">
                <div className="container-site grid gap-6 py-7 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
                    <Reveal variant="fade-up" delay={0}>
                        <a href={info.mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 md:pr-8">
                            <MapPin className="mt-0.5 size-5 shrink-0 text-primary transition-transform duration-300 group-hover:scale-125" aria-hidden />
                            <span>
                                <span className="block font-semibold text-foreground group-hover:text-primary transition-colors">{info.address.street}</span>
                                <span className="block text-sm text-muted-foreground">{info.address.zip} {info.address.city}. {t('home.infoAddress')}</span>
                            </span>
                        </a>
                    </Reveal>

                    <Reveal variant="fade-up" delay={80}>
                        <a href={info.phoneHref} className="group flex items-start gap-4 md:px-8">
                            <Phone className="mt-0.5 size-5 shrink-0 text-primary transition-transform duration-300 group-hover:scale-125" aria-hidden />
                            <span>
                                <span className="block font-semibold text-foreground group-hover:text-primary transition-colors">{info.phone}</span>
                                <span className="block text-sm text-muted-foreground">{t('home.infoPhone')}</span>
                            </span>
                        </a>
                    </Reveal>

                    <Reveal variant="fade-up" delay={160}>
                        <div className="flex items-start gap-4 md:pl-8">
                            <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                            <span>
                                <span className="block font-semibold text-foreground tabular">
                                    {t('hours.today')}: {today ? (today.closed ? t('hours.closed') : `${today.open} - ${today.close}`) : ''}
                                </span>
                                <OpeningStatus className="text-sm mt-0.5" />
                            </span>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Story + badges with interactive spotlights */}
            <section className="section">
                <div className="container-site grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20 items-center">
                    <Reveal variant="fade-right">
                        <SectionHeading title={t('home.storyTitle')} text={t('home.storyLead')} />
                        <div className="mt-8 space-y-7 max-w-[60ch]">
                            {story && (
                                <div>
                                    <h3 className="font-display display-sm text-foreground">{t('about.storyTitle')}</h3>
                                    <p className="mt-2 text-muted-foreground">{story}</p>
                                </div>
                            )}
                            {philosophy && (
                                <div>
                                    <h3 className="font-display display-sm text-foreground">{t('about.philosophyTitle')}</h3>
                                    <p className="mt-2 text-muted-foreground">{philosophy}</p>
                                </div>
                            )}
                        </div>
                        <Button asChild variant="link" className="group mt-6 px-0 text-base">
                            <LocaleLink to="about">
                                {t('home.storyMore')}{' '}
                                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
                            </LocaleLink>
                        </Button>
                    </Reveal>

                    <Reveal variant="fade-left" delay={120} className="relative">
                        <div className="group relative overflow-hidden rounded-lg">
                            <img
                                src="/assets/story-burger.webp"
                                alt=""
                                width={1200}
                                height={1200}
                                loading="lazy"
                                className="aspect-square w-full rounded-lg object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                            />
                            <div className="absolute -left-3 -top-3 -z-10 h-full w-full rounded-lg border border-primary/40 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" aria-hidden />
                        </div>
                        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                            {badges.map((badge, idx) => (
                                <Reveal key={badge.title} delay={idx * 80} variant="zoom-in" as="li">
                                    <CardSpotlight className="flex items-center gap-3 sm:block h-full">
                                        <img
                                            src={badge.src}
                                            alt=""
                                            width={768}
                                            height={512}
                                            loading="lazy"
                                            className="w-28 shrink-0 rounded-sm sm:w-full transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div>
                                            <p className="font-bold text-foreground text-sm sm:mt-3">{badge.title}</p>
                                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{badge.text}</p>
                                        </div>
                                    </CardSpotlight>
                                </Reveal>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* Signature creations */}
            {creations.length > 0 && (
                <section className="section bg-surface border-y border-border">
                    <div className="container-site">
                        <Reveal variant="blur-in" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <SectionHeading eyebrow={t('home.signature')} title={t('home.creationsTitle')} text={t('home.creationsText')} />
                            <Button asChild variant="outline" size="lg" className="self-start md:self-auto">
                                <LocaleLink to="menu">{t('home.creationsCta')}</LocaleLink>
                            </Button>
                        </Reveal>

                        <div className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_2fr]">
                            {lead && (
                                <Reveal variant="fade-up" delay={50}>
                                    <CreationTile image={lead} large />
                                </Reveal>
                            )}
                            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {rest.map((image, i) => (
                                    <Reveal key={image.id} as="li" delay={100 + i * 60} variant="zoom-in">
                                        <CreationTile image={image} />
                                    </Reveal>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            {/* Delivery */}
            <section className="section">
                <div className="container-site">
                    <Reveal variant="fade-up">
                        <SectionHeading title={t('home.deliveryTitle')} text={t('home.deliveryText')} />
                    </Reveal>
                    <Reveal delay={120} variant="fade-up">
                        <DeliveryPlatforms className="mt-10" />
                    </Reveal>
                </div>
            </section>

            {/* Ambience: full-bleed photo with overlay text */}
            <section className="relative isolate overflow-hidden group">
                <img
                    src="/assets/ambience-wide.webp"
                    alt=""
                    width={1280}
                    height={720}
                    loading="lazy"
                    className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/95 via-background/70 to-background/20" aria-hidden />
                <div className="container-site py-28 md:py-40">
                    <Reveal variant="blur-in" className="max-w-xl">
                        <h2 className="font-display display-xl text-foreground">{t('home.ambienceTitle')}</h2>
                        <p className="mt-4 text-lg text-muted-foreground">{t('home.ambienceText')}</p>
                        <Button asChild size="lg" className="mt-8">
                            <LocaleLink to="gallery">{t('common.viewGallery')}</LocaleLink>
                        </Button>
                    </Reveal>
                </div>
            </section>

            {/* Reservation CTA */}
            <section className="relative isolate overflow-hidden border-t border-border bg-surface grain">
                <div className="absolute inset-0 -z-10 glow-amber-animated" aria-hidden />
                <div className="container-site py-20 md:py-28 text-center">
                    <Reveal variant="zoom-in">
                        <h2 className="font-display display-xl text-foreground">{t('home.ctaTitle')}</h2>
                        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">{t('home.ctaText')}</p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                            <Button asChild size="xl">
                                <LocaleLink to="reservation">{t('common.reserve')}</LocaleLink>
                            </Button>
                            <Button asChild size="xl" variant="outline">
                                <a href={info.phoneHref}>
                                    <Phone aria-hidden /> {info.phone}
                                </a>
                            </Button>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
}

function CreationTile({
    image,
    large = false,
}: {
    image: {
        url: string;
        thumb_url: string;
        featured_title?: { de?: string | null; en?: string | null } | null;
        featured_subtitle?: { de?: string | null; en?: string | null } | null;
        caption?: { de?: string | null; en?: string | null } | null;
        width?: number | null;
        height?: number | null;
    };
    large?: boolean;
}) {
    const pick = usePick();
    const title = pick(image.featured_title) || pick(image.caption);
    const subtitle = pick(image.featured_subtitle);

    return (
        <LocaleLink
            to="menu"
            className={cn(
                'group relative block overflow-hidden rounded-lg bg-card transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 ring-1 ring-border/60 hover:ring-primary/40',
                large ? 'aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[520px]' : 'aspect-square'
            )}
        >
            <img
                src={large ? image.url : image.thumb_url}
                alt={title}
                width={image.width ?? undefined}
                height={image.height ?? undefined}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108 group-hover:brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute inset-x-0 bottom-0 p-4 pt-16 md:p-6 transition-transform duration-300 ease-out group-hover:-translate-y-1">
                <p className={cn('font-display text-foreground transition-colors duration-200 group-hover:text-primary', large ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl')}>
                    {title}
                </p>
                {subtitle && <p className={cn('text-muted-foreground transition-colors group-hover:text-foreground/90', large ? 'text-base' : 'text-xs md:text-sm')}>{subtitle}</p>}
            </div>
        </LocaleLink>
    );
}
