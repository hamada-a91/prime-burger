// src/components/blocks/BlogPreviewBlock.tsx
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import type { BlogPreviewBlock as BlogPreviewBlockType } from '@/config/website.config.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlogPosts } from '@/hooks/api';

export function BlogPreviewBlock(props: BlogPreviewBlockType) {
    const { title, subtitle, count = 3, showImages } = props;
    const { data, isLoading } = useBlogPosts(1);

    const posts = data?.data?.slice(0, count) || [];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
                        {subtitle && (
                            <p className="text-xl text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                    <Button asChild variant="ghost" className="hidden md:inline-flex">
                        <Link to="/blog" className="gap-2">
                            Alle Artikel ansehen <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(count)].map((_, i) => (
                            <Card key={i} className="h-full">
                                <Skeleton className="aspect-video w-full" />
                                <CardHeader>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-6 w-full" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4 mt-2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link key={post.slug} to={`/blog/${post.slug}`} className="group block h-full">
                                <Card className="h-full border-border/50 hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                                    {showImages && post.featured_image && (
                                        <div className="aspect-video w-full overflow-hidden bg-muted">
                                            <img
                                                src={post.featured_image}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {post.published_at
                                                ? new Date(post.published_at).toLocaleDateString('de-DE')
                                                : 'Neu'}
                                        </div>
                                        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">
                        Noch keine Blog-Posts vorhanden.
                    </p>
                )}

                <div className="mt-8 text-center md:hidden">
                    <Button asChild variant="outline">
                        <Link to="/blog" className="gap-2">
                            Alle Artikel ansehen <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

