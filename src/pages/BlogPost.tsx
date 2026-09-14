import { useParams, Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useBlogPost } from '@/hooks/api';

export function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const { data: post, isLoading, error } = useBlogPost(slug || '');

    if (error) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold text-destructive mb-4">Post nicht gefunden</h1>
                <Button asChild variant="outline">
                    <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" />Zurück zum Blog</Link>
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container py-20 max-w-3xl mx-auto">
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-48 mb-8" />
                <div className="space-y-3">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (!post) return null;

    return (
        <>
            <SEOHead
                title={post.title}
                description={post.excerpt}
                canonical={`/blog/${post.slug}`}
            />
            <article className="container py-20 max-w-3xl mx-auto">
                <div className="mb-8">
                    <Button asChild variant="ghost" className="mb-4">
                        <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" />Zurück zum Blog</Link>
                    </Button>
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    {post.published_at && (
                        <p className="text-muted-foreground">
                            Veröffentlicht am {new Date(post.published_at).toLocaleDateString('de-DE')}
                        </p>
                    )}
                </div>

                {post.featured_image && (
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-auto rounded-lg mb-8"
                    />
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    {/* In a real app, you'd use a markdown renderer here */}
                    <p className="whitespace-pre-wrap">{post.content}</p>
                </div>
            </article>
        </>
    );
}
