import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useAdminBlogPost, useCreatePost, useUpdatePost } from '@/hooks/api';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { toast } from 'sonner';
import type { BlogFormData } from '@/types/api';

export function BlogEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id || id === 'new';

    const { data: post, isLoading: initialLoading, error } = useAdminBlogPost(isNew ? '' : id);
    const createPost = useCreatePost();
    const updatePost = useUpdatePost();

    const { register, handleSubmit, setValue, watch, reset } = useForm<BlogFormData>({
        defaultValues: {
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            featured_image: '',
            is_published: false,
        }
    });

    // Populate form when post data loads
    useEffect(() => {
        if (post) {
            reset({
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt || '',
                content: post.content,
                featured_image: post.featured_image || '',
                is_published: post.is_published,
            });
        }
    }, [post, reset]);

    async function onSubmit(data: BlogFormData) {
        const mutation = isNew
            ? createPost.mutateAsync(data)
            : updatePost.mutateAsync({ id: Number(id), ...data });

        toast.promise(mutation, {
            loading: 'Wird gespeichert...',
            success: () => {
                navigate('/admin/posts');
                return isNew ? 'Post erstellt!' : 'Post aktualisiert!';
            },
            error: (err: unknown) => {
                // Parse Laravel validation errors
                const apiError = err as {
                    response?: {
                        data?: {
                            message?: string;
                            errors?: Record<string, string[]>
                        }
                    };
                };

                if (apiError.response?.data?.errors) {
                    const errors = apiError.response.data.errors;
                    const firstErrorKey = Object.keys(errors)[0];
                    const firstError = errors[firstErrorKey]?.[0];
                    return firstError || 'Validierungsfehler';
                }

                return apiError.response?.data?.message || 'Fehler beim Speichern';
            },
        });
    }

    // Auto-generate slug from title
    const title = watch('title');
    useEffect(() => {
        if (isNew && title) {
            const slug = title.toLowerCase()
                .replace(/[äöüß]/g, (c: string) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] || c))
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setValue('slug', slug);
        }
    }, [title, isNew, setValue]);

    const isSaving = createPost.isPending || updatePost.isPending;

    if (error) {
        return (
            <div className="p-8 text-center text-destructive">
                <p>Fehler beim Laden des Posts.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/posts')}>
                    Zurück zur Übersicht
                </Button>
            </div>
        );
    }

    if (!isNew && initialLoading) {
        return (
            <div className="max-w-5xl mx-auto space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-96" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-64" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {isNew ? 'Neuer Blog Post' : 'Post bearbeiten'}
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Inhalt</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Titel</Label>
                                    <Input {...register('title', { required: true })} placeholder="Geben Sie einen Titel ein..." />
                                </div>

                                <div className="space-y-2">
                                    <Label>Inhalt</Label>
                                    <Textarea
                                        {...register('content', { required: true })}
                                        rows={15}
                                        placeholder="Schreiben Sie hier Ihren Beitrag..."
                                        className="font-mono text-sm leading-relaxed"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>SEO & Meta</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Excerpt (Kurzbeschreibung)</Label>
                                    <Textarea {...register('excerpt')} rows={3} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Veröffentlichung</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="published" className="text-base">Veröffentlicht</Label>
                                        <p className="text-xs text-muted-foreground">Sichtbar für Besucher</p>
                                    </div>
                                    <Switch
                                        id="published"
                                        checked={watch('is_published')}
                                        onCheckedChange={(checked: boolean) => setValue('is_published', checked)}
                                    />
                                </div>

                                <div className="space-y-2 pt-4 border-t">
                                    <Label>Slug (URL)</Label>
                                    <Input {...register('slug', { required: true })} className="bg-muted/50" />
                                </div>

                                <div className="pt-4 flex flex-col gap-2">
                                    <Button type="submit" disabled={isSaving} className="w-full">
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        {isNew ? 'Veröffentlichen' : 'Aktualisieren'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Featured Image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ImageUpload
                                    value={typeof watch('featured_image') === 'string' ? watch('featured_image') as string : undefined}
                                    onChange={(url) => setValue('featured_image', url || '')}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}

