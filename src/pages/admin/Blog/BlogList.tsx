import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/admin/DataTable';
import { useAdminBlogPosts, useDeletePost } from '@/hooks/api';
import { toast } from 'sonner';

export function BlogList() {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useAdminBlogPosts(page);
    const deletePost = useDeletePost();

    const handleDelete = (id: number) => {
        if (confirm('Wirklich löschen?')) {
            toast.promise(deletePost.mutateAsync(id), {
                loading: 'Wird gelöscht...',
                success: 'Post gelöscht!',
                error: 'Fehler beim Löschen',
            });
        }
    };

    const columns = [
        { header: 'Titel', accessor: 'title' as const, className: 'font-medium' },
        {
            header: 'Status', accessor: (row: any) => (
                <Badge variant={row.is_published ? 'default' : 'secondary'}>
                    {row.is_published ? 'Veröffentlicht' : 'Entwurf'}
                </Badge>
            )
        },
        {
            header: 'Datum',
            accessor: (row: any) => row.published_at
                ? new Date(row.published_at).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })
                : '-'
        },
        {
            header: 'Aktionen', accessor: (row: any) => (
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/posts/${row.id}`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row.id)}
                        className="text-destructive hover:bg-destructive/10"
                        disabled={deletePost.isPending}
                    >
                        {deletePost.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </div>
            ), className: 'text-right'
        },
    ];

    if (error) {
        return (
            <div className="p-8 text-center text-destructive">
                <p>Fehler beim Laden der Blog-Posts.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
                    <p className="text-muted-foreground">Verwalten Sie Ihre Blog-Beiträge und Neuigkeiten.</p>
                </div>
                <Button asChild>
                    <Link to="/admin/posts/new"><Plus className="mr-2 h-4 w-4" /> Neuer Post</Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            ) : (
                <>
                    <DataTable columns={columns} data={data?.data || []} />

                    {data && data.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Zurück
                            </Button>
                            <span className="py-2 px-3 text-sm text-muted-foreground">
                                Seite {data.current_page} von {data.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= data.last_page}
                            >
                                Weiter
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
