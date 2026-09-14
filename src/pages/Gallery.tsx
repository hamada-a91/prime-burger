import { useMemo, useState } from 'react';
import { useGallery } from '@/hooks/api';
import { useT, usePick } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo';
import { Lightbox } from '@/components/site/Lightbox';
import { PageHero } from '@/components/site/PageHero';
import { cn } from '@/lib/utils';
import type { GalleryCategory } from '@/types/api';

const CATEGORIES: GalleryCategory[] = ['burger', 'food', 'ambience', 'drinks', 'misc'];

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
                <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="group" aria-label={t('gallery.title')}>
                    {(['all', ...available] as const).map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setCategory(c)}
                            aria-pressed={category === c}
                            className={cn(
                                'shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors',
                                category === c ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                            )}
                        >
                            {c === 'all' ? t('gallery.filterAll') : t(`gallery.categories.${c}`)}
                        </button>
                    ))}
                </div>

                {isLoading && (
                    <div className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4" aria-busy="true" aria-label={t('common.loading')}>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Skeleton key={i} className={cn('mb-4 w-full rounded-md', i % 3 === 0 ? 'h-72' : 'h-56')} />
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

                <ul className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4">
                    {images.map((image, index) => {
                        const caption = pick(image.caption);
                        return (
                            <li key={image.id} className="mb-4 break-inside-avoid">
                                <button
                                    type="button"
                                    onClick={() => setOpen(index)}
                                    aria-label={t('gallery.open', { index: index + 1, total: images.length })}
                                    className="group relative block w-full overflow-hidden rounded-md bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    style={image.width && image.height ? { aspectRatio: `${image.width} / ${image.height}` } : undefined}
                                >
                                    <img
                                        src={image.thumb_url}
                                        alt={caption}
                                        width={image.width ?? undefined}
                                        height={image.height ?? undefined}
                                        loading="lazy"
                                        decoding="async"
                                        className="image-hover h-full w-full object-cover"
                                    />
                                    {caption && (
                                        <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-left text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                                            {caption}
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <Lightbox images={images} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
        </>
    );
}
