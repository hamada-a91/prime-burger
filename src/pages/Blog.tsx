import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageConfig, useSiteConfig } from '@/hooks';
import { SEOHead } from '@/components/seo';
import { BlockRenderer } from '@/components/blocks';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useBlogPosts } from '@/hooks/api';

export function Blog() {
    const page = usePageConfig('blog');
    const site = useSiteConfig();
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, error } = useBlogPosts(currentPage);

    return (
        <>
            <SEOHead
                title={page.seo.title}
                description={page.seo.description}
                canonical={`${site.url}/blog`}
                ogImage={page.seo.ogImage}
            />
            <BlockRenderer blocks={page.blocks} />

            <div className="container py-12">
                {error && (
                    <div className="text-center text-destructive mb-8">
                        <p>Fehler beim Laden der Blog-Posts.</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="h-48 w-full rounded-lg" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>
                ) : data?.data && data.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data.data.map(post => (
                                <Link
                                    key={post.id}
                                    to={`/blog/${post.slug}`}
                                    className="group block h-full"
                                >
                                    <article className="h-full bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                                        {post.featured_image && (
                                            <div className="aspect-video w-full overflow-hidden bg-muted">
                                                <img
                                                    src={post.featured_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                                <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full"></span>
                                                {post.published_at && new Date(post.published_at).toLocaleDateString('de-DE', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                            <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
                                                {post.excerpt}
                                            </p>
                                            <span className="mt-4 text-sm font-medium text-primary group-hover:underline">
                                                Weiterlesen →
                                            </span>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>

                        {data.last_page > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Zurück
                                </Button>
                                <span className="py-2 px-4 text-sm text-muted-foreground">
                                    Seite {data.current_page} von {data.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    disabled={currentPage >= data.last_page}
                                >
                                    Weiter
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-muted-foreground">
                        Noch keine Blog-Posts vorhanden.
                    </p>
                )}
            </div>
        </>
    );
}
