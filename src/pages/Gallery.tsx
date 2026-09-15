import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { useGallery } from '@/hooks/api';
import { useT, usePick } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo';
import { Lightbox } from '@/components/site/Lightbox';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';
import { cn } from '@/lib/utils';
import type { GalleryCategory } from '@/types/api';

const CATEGORIES: GalleryCategory[] = ['burger', 'food', 'ambience', 'drinks', 'misc'];

/**
 * Repeating 10-tile rhythm on a 4-column grid: one large 2x2, one tall 1x2, one wide 2x1, the rest 1x1.
 * `grid-flow-dense` fills the gaps so every row stays closed regardless of the image count.
 */
const TILE_PATTERN = ['large', 'small', 'small', 'tall', 'small', 'wide', 'small', 'small', 'small', 'small'] as const;

const TILE_CLASSES: Record<(typeof TILE_PATTERN)[number], string> = {
    large: 'col-span-2 row-span-2',
    tall: 'row-span-2',
    wide: 'col-span-2',
    small: '',
};

export function Gallery() {
    const t = useT();
    const pick = usePick();
    const { data, isLoading, isError, refetch } = useGallery();
    const [category, setCategory] = useState<GalleryCategory | 'all'>('all');
    const [open, setOpen] = useState<number | null>(null);

    const available = useMemo(() => CATEGORIES.filter((c) => data?.some((img) => img.category === c)), [data]);
    const images = useMemo(() => (data ?? []).filter((img) => category === 'all' || img.category === category), [data, category]);

    return (
        <>
            <SEOHead title={t('gallery.seoTitle')} description={t('gallery.seoDescription')} routeKey="gallery" />
            <PageHero title={t('gallery.title')} lead={t('gallery.lead')} image="/assets/ambience-wide.webp" imagePosition="center 30%" />

            <div className="container-site py-10 md:py-14">
                <div className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="group" aria-label={t('gallery.title')}>
                    {(['all', ...available] as const).map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setCategory(c)}
                            aria-pressed={category === c}
                            className={cn(
                                'shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-200 active:scale-95',
                                category === c
                                    ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105'
                                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:scale-102'
                            )}
                        >
                            {c === 'all' ? t('gallery.filterAll') : t(`gallery.categories.${c}`)}
                        </button>
                    ))}
                </div>

                {isLoading && (
                    <div className="mt-8 grid grid-flow-dense grid-cols-2 auto-rows-[150px] gap-3 md:grid-cols-4 md:auto-rows-[210px] md:gap-4" aria-busy="true" aria-label={t('common.loading')}>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Skeleton key={i} className={cn('rounded-lg', TILE_CLASSES[TILE_PATTERN[i % TILE_PATTERN.length]])} />
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
                        <p className="text-muted-foreground">{t('common.error')}</p>
                        <Button className="mt-4" onClick={() => refetch()}>{t('common.retry')}</Button>
                    </div>
                )}

                {!isLoading && !isError && images.length === 0 && (
                    <p className="mt-8 rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">{t('gallery.empty')}</p>
                )}

                <ul className="mt-8 grid grid-flow-dense grid-cols-2 auto-rows-[150px] gap-3 md:grid-cols-4 md:auto-rows-[210px] md:gap-4">
                    {images.map((image, index) => {
                        const caption = pick(image.caption);
                        const tile = TILE_PATTERN[index % TILE_PATTERN.length];
                        return (
                            <Reveal as="li" key={image.id} delay={(index % 6) * 60} variant="zoom-in" className={cn('min-h-0', TILE_CLASSES[tile])}>
                                <button
                                    type="button"
                                    onClick={() => setOpen(index)}
                                    aria-label={t('gallery.open', { index: index + 1, total: images.length })}
                                    className="group relative block h-full w-full overflow-hidden rounded-lg bg-card ring-1 ring-border/50 hover:ring-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                                >
                                    <img
                                        src={tile === 'large' ? image.url : image.thumb_url}
                                        alt={caption}
                                        width={image.width ?? undefined}
                                        height={image.height ?? undefined}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108 group-hover:brightness-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                                        <div className="size-11 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                                            <Eye className="size-5" />
                                        </div>
                                    </div>
                                    {caption && (
                                        <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8 text-left text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                                            {caption}
                                        </span>
                                    )}
                                </button>
                            </Reveal>
                        );
                    })}
                </ul>
            </div>

            <Lightbox images={images} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
        </>
    );
}
