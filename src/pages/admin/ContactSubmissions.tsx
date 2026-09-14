import { useState } from 'react';
import { Mail, CheckCircle, Archive, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/admin/DataTable';
import { useContactSubmissions, useUpdateContactStatus } from '@/hooks/api';
import { toast } from 'sonner';
import type { ContactSubmission } from '@/types/api';

export function ContactSubmissions() {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useContactSubmissions(page);
    const updateStatus = useUpdateContactStatus();
    const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return <Badge className="bg-blue-500">Neu</Badge>;
            case 'read': return <Badge variant="outline">Gelesen</Badge>;
            case 'replied': return <Badge className="bg-green-500">Beantwortet</Badge>;
            default: return <Badge variant="secondary">Archiviert</Badge>;
        }
    };

    const handleStatusUpdate = (id: number, status: ContactSubmission['status']) => {
        toast.promise(updateStatus.mutateAsync({ id, status }), {
            loading: 'Wird aktualisiert...',
            success: 'Status aktualisiert!',
            error: 'Fehler beim Aktualisieren',
        });
    };

    const columns = [
        { header: 'Name', accessor: 'name' as const, className: 'font-medium' },
        { header: 'Email', accessor: 'email' as const },
        { header: 'Betreff', accessor: (row: ContactSubmission) => row.subject || '-' },
        { header: 'Status', accessor: (row: ContactSubmission) => getStatusBadge(row.status) },
        { header: 'Datum', accessor: (row: ContactSubmission) => new Date(row.created_at).toLocaleDateString('de-DE'), className: 'text-right' },
        {
            header: 'Action', accessor: (row: ContactSubmission) => (
                <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(row)}>Ansehen</Button>
            ), className: 'text-right'
        }
    ];

    if (error) {
        return (
            <div className="p-8 text-center text-destructive">
                <p>Fehler beim Laden der Kontaktanfragen.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
            <div className="lg:col-span-2 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Kontaktanfragen</h1>

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

            <div className="bg-card border rounded-lg p-6 h-full shadow-sm">
                {selectedMessage ? (
                    <div className="space-y-6">
                        <div>
                            <Badge variant="outline" className="mb-2">
                                {new Date(selectedMessage.created_at).toLocaleDateString('de-DE')}
                            </Badge>
                            <h2 className="text-xl font-bold">{selectedMessage.subject || 'Kein Betreff'}</h2>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <Mail className="h-4 w-4" />
                                <span>{selectedMessage.name} &lt;{selectedMessage.email}&gt;</span>
                            </div>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-md min-h-[200px] border text-sm whitespace-pre-wrap">
                            {selectedMessage.message}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                className="w-full gap-2"
                                onClick={() => handleStatusUpdate(selectedMessage.id, 'replied')}
                                disabled={updateStatus.isPending}
                            >
                                {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                Als erledigt markieren
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={() => handleStatusUpdate(selectedMessage.id, 'archived')}
                                disabled={updateStatus.isPending}
                            >
                                <Archive className="h-4 w-4" /> Archivieren
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center">
                        <Mail className="h-12 w-12 mb-4 opacity-20" />
                        <p>Wählen Sie eine Nachricht aus,<br />um Details zu sehen.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
