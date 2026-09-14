import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, FileText, Briefcase, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';

interface StatsData {
    contacts: {
        total: number;
        today: number;
        this_week: number;
        this_month: number;
        by_day: { date: string; count: number }[];
    };
    blog: {
        total: number;
        published: number;
        drafts: number;
    };
    jobs: {
        total: number;
        active: number;
        expired: number;
    };
}

// Simple bar chart without external library
function SimpleBarChart({ data }: { data: { date: string; count: number }[] }) {
    if (!data || data.length === 0) {
        return <div className="text-muted-foreground text-sm">Keine Daten verfügbar</div>;
    }

    const max = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="flex items-end gap-1 h-32">
            {data.slice(-30).map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-[8px]">
                    <div
                        className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                        style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }}
                        title={`${d.date}: ${d.count}`}
                    />
                    {i % 5 === 0 && (
                        <span className="text-[10px] text-muted-foreground">
                            {new Date(d.date).getDate()}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}

export function Analytics() {
    const { data: stats, isLoading, error } = useQuery<StatsData>({
        queryKey: ['admin-stats'],
        queryFn: () => api.get('/admin/stats'),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-destructive">
                Fehler beim Laden der Statistiken
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Kontaktanfragen Heute</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.contacts.today ?? 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.contacts.this_week ?? 0} diese Woche
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Anfragen Gesamt</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.contacts.total ?? 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.contacts.this_month ?? 0} diesen Monat
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.blog.published ?? 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.blog.drafts ?? 0} Entwürfe
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Aktive Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.jobs.active ?? 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.jobs.total ?? 0} gesamt
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Kontaktanfragen (letzte 30 Tage)</CardTitle>
                </CardHeader>
                <CardContent>
                    <SimpleBarChart data={stats?.contacts.by_day || []} />
                </CardContent>
            </Card>
        </div>
    );
}
