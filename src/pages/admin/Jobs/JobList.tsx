import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/admin/DataTable';
import { useAdminJobs, useDeleteJob } from '@/hooks/api';
import { toast } from 'sonner';

export function JobList() {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useAdminJobs(page);
    const deleteJob = useDeleteJob();

    const handleDelete = (id: number) => {
        if (confirm('Können wir diesen Job wirklich entfernen?')) {
            toast.promise(deleteJob.mutateAsync(id), {
                loading: 'Wird gelöscht...',
                success: 'Job gelöscht!',
                error: 'Fehler beim Löschen',
            });
        }
    };

    const columns = [
        { header: 'Job Titel', accessor: 'title' as const, className: 'font-medium' },
        { header: 'Typ', accessor: (row: any) => <Badge variant="outline">{row.type}</Badge> },
        { header: 'Ort', accessor: 'location' as const },
        {
            header: 'Status', accessor: (row: any) => (
                <Badge variant={row.is_active ? 'default' : 'secondary'}>
                    {row.is_active ? 'Aktiv' : 'Inaktiv'}
                </Badge>
            )
        },
        {
            header: 'Aktionen', accessor: (row: any) => (
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/jobs/${row.id}`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row.id)}
                        className="text-destructive hover:bg-destructive/10"
                        disabled={deleteJob.isPending}
                    >
                        {deleteJob.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </div>
            ), className: 'text-right'
        },
    ];

    if (error) {
        return (
            <div className="p-8 text-center text-destructive">
                <p>Fehler beim Laden der Jobs.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
                    <p className="text-muted-foreground">Verwalten Sie Ihre offenen Stellenangebote.</p>
                </div>
                <Button asChild>
                    <Link to="/admin/jobs/new"><Plus className="mr-2 h-4 w-4" /> Neuer Job</Link>
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
