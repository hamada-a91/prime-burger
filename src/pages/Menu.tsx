import { useEffect, useMemo, useRef, useState } from 'react';
import { Flame, Leaf, Printer, Sprout } from 'lucide-react';
import { useMenu } from '@/hooks/api';
import { formatPrice, useLocale, useT, usePick } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo';
import { LocaleLink } from '@/components/site/LocaleLink';
import { PageHero } from '@/components/site/PageHero';
import { cn } from '@/lib/utils';
import type { Allergen, MenuCategory, MenuItem, MenuTag } from '@/types/api';

type Filter = 'all' | 'vegan' | 'vegetarian' | 'spicy';
const FILTERS: Filter[] = ['all', 'vegan', 'vegetarian', 'spicy'];
const ALLERGENS: Allergen[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'L', 'M', 'N', 'O', 'P', 'R'];

const TAG_ICONS: Partial<Record<MenuTag, typeof Leaf>> = { vegan: Leaf, vegetarian: Sprout, spicy: Flame };

export function Menu() {
    const t = useT();
    const pick = usePick();
    const { data, isLoading, isError, refetch } = useMenu();
    const [filter, setFilter] = useState<Filter>('all');
    const [active, setActive] = useState<number | null>(null);
    const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());

    const categories = useMemo(() => {
        if (!data) return [];
        return data
            .map((category) => ({
                ...category,
                items: (category.items ?? []).filter((item) => filter === 'all' || item.tags?.includes(filter)),
            }))
            .filter((category) => filter === 'all' || category.items.length > 0);
    }, [data, filter]);

    // Scroll spy for the sticky category bar.
    useEffect(() => {
        const elements = Array.from(sectionRefs.current.values());
        if (elements.length === 0) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActive(Number((visible[0].target as HTMLElement).dataset.id));
            },
            { rootMargin: '-140px 0px -60% 0px', threshold: 0 }
        );
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [categories]);

    const scrollTo = (id: number) => {
        const el = sectionRefs.current.get(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 130;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <>
            <SEOHead title={t('menu.seoTitle')} description={t('menu.seoDescription')} routeKey="menu" />
            <PageHero title={t('menu.title')} lead={t('menu.lead')} image="/assets/dishes-wide.webp" imagePosition="center 40%" />

            {/* Sticky category bar + filters */}
            <div className="no-print sticky top-[72px] z-30 border-b border-border bg-background/95 backdrop-blur-md">
                <div className="container-site flex items-center gap-3 py-2.5">
                    <nav aria-label={t('menu.categoriesLabel')} className="no-scrollbar -mx-1 flex flex-1 gap-1 overflow-x-auto px-1">
                        {(data ?? []).map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => scrollTo(category.id)}
                                aria-current={active === category.id ? 'true' : undefined}
                                className={cn(
                                    'relative shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                                    active === category.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {pick(category.name)}
                            </button>
                        ))}
                    </nav>
                    <div className="hidden shrink-0 items-center gap-1 md:flex" role="group" aria-label="Filter">
                        {FILTERS.map((f) => (
                            <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>
                                {f === 'all' ? t('menu.filterAll') : t(`menu.filters.${f}`)}
                            </FilterChip>
                        ))}
                    </div>
                </div>
                <div className="container-site flex gap-1 pb-2.5 md:hidden" role="group" aria-label="Filter">
                    {FILTERS.map((f) => (
                        <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>
                            {f === 'all' ? t('menu.filterAll') : t(`menu.filters.${f}`)}
                        </FilterChip>
                    ))}
                </div>
            </div>

            <div className="container-site py-12 md:py-16">
                {isLoading && (
                    <div className="space-y-6" aria-busy="true" aria-label={t('common.loading')}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="grid gap-3 md:grid-cols-2">
                                <Skeleton className="h-16 rounded-md" />
                                <Skeleton className="h-16 rounded-md" />
                            </div>
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="rounded-lg border border-border bg-card p-8 text-center">
                        <p className="text-muted-foreground">{t('common.error')}</p>
                        <Button className="mt-4" onClick={() => refetch()}>{t('common.retry')}</Button>
                    </div>
                )}

                {!isLoading && !isError && categories.length === 0 && (
                    <p className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">{t('menu.noResults')}</p>
                )}

                <div className="space-y-16">
                    {categories.map((category) => (
                        <section
                            key={category.id}
                            id={`category-${category.id}`}
                            data-id={category.id}
                            ref={(el) => {
                                if (el) sectionRefs.current.set(category.id, el);
                                else sectionRefs.current.delete(category.id);
                            }}
                            className="scroll-mt-32"
                        >
                            <CategoryHeader category={category} />
                            {category.items.length === 0 ? (
                                <p className="mt-6 text-sm text-muted-foreground">{t('menu.empty')}</p>
                            ) : (
                                <ul className="mt-8 grid gap-x-12 gap-y-7 md:grid-cols-2">
                                    {category.items.map((item) => (
                                        <MenuRow key={item.id} item={item} />
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>

                {/* Allergen legend */}
                {data && data.length > 0 && (
                    <section className="mt-20 rounded-lg border border-border bg-card p-6 md:p-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="max-w-xl">
                                <h2 className="font-display display-sm text-foreground">{t('menu.allergensTitle')}</h2>
                                <p className="mt-2 text-sm text-muted-foreground">{t('menu.allergensHint')}</p>
                            </div>
                            <Button variant="outline" size="sm" className="no-print shrink-0" onClick={() => window.print()}>
                                <Printer aria-hidden /> {t('menu.print')}
                            </Button>
                        </div>
                        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
                            {ALLERGENS.map((code) => (
                                <div key={code} className="flex gap-3">
                                    <dt className="w-5 shrink-0 font-bold text-primary">{code}</dt>
                                    <dd className="text-muted-foreground">{t(`menu.allergens.${code}`)}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                )}

                <p className="no-print mt-10 text-center text-sm text-muted-foreground">
                    {t('menu.deliveryHint')}{' '}
                    <LocaleLink to="home" hash="delivery" className="font-semibold text-primary hover:underline">
                        {t('common.orderNow')}
                    </LocaleLink>
                </p>
            </div>
        </>
    );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors',
                active ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            )}
        >
            {children}
        </button>
    );
}

function CategoryHeader({ category }: { category: MenuCategory }) {
    const pick = usePick();
    const description = pick(category.description);
    return (
        <header className="flex items-end gap-4 border-b border-border pb-4">
            <div>
                <h2 className="font-display display-md text-foreground">{pick(category.name)}</h2>
                {description && <p className="mt-1 text-muted-foreground">{description}</p>}
            </div>
        </header>
    );
}

function MenuRow({ item }: { item: MenuItem }) {
    const t = useT();
    const pick = usePick();
    const locale = useLocale();
    const description = pick(item.description);
    const priceNote = pick(item.price_note);
    const tags = (item.tags ?? []).filter((tag) => tag !== 'new');
    const isSignature = item.tags?.includes('signature');

    return (
        <li className="break-inside-avoid">
            <div className="flex items-baseline gap-3">
                <h3 className="font-bold text-foreground text-[17px] leading-snug">
                    {pick(item.name)}
                    {isSignature && (
                        <span className="ml-2 inline-block align-middle rounded-sm bg-brand-red/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-red">
                            {t('menu.tags.signature')}
                        </span>
                    )}
                </h3>
                {item.price !== null && item.price !== undefined && item.price !== '' && (
                    <>
                        <span className="price-leader flex-1 self-end mb-1.5" aria-hidden />
                        <span className="tabular shrink-0 font-bold text-primary">{formatPrice(item.price, locale)}</span>
                    </>
                )}
            </div>

            {item.variants && item.variants.length > 0 && (
                <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {item.variants.map((variant, i) => (
                        <li key={i} className="tabular">
                            <span className="text-muted-foreground">{pick(variant.label)}</span>{' '}
                            <span className="font-bold text-primary">{formatPrice(variant.price, locale)}</span>
                        </li>
                    ))}
                </ul>
            )}

            {description && <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>}
            {priceNote && <p className="mt-1 text-xs text-muted-foreground">{priceNote}</p>}

            {(tags.length > 0 || (item.allergens && item.allergens.length > 0)) && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    {tags.filter((tag) => tag !== 'signature').map((tag) => {
                        const Icon = TAG_ICONS[tag];
                        return (
                            <span key={tag} className="inline-flex items-center gap-1 rounded-sm bg-secondary px-1.5 py-0.5 text-[11px] font-semibold text-foreground">
                                {Icon && <Icon className={cn('size-3', tag === 'spicy' ? 'text-brand-red' : 'text-success')} aria-hidden />}
                                {t(`menu.tags.${tag}`)}
                            </span>
                        );
                    })}
                    {item.allergens && item.allergens.length > 0 && (
                        <span className="text-[11px] tracking-wider text-muted-foreground" title={item.allergens.map((a) => t(`menu.allergens.${a}`)).join(', ')}>
                            {item.allergens.join(', ')}
                        </span>
                    )}
                </div>
            )}
        </li>
    );
}
