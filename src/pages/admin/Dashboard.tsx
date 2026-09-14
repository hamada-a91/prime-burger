import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Images, Inbox, UtensilsCrossed } from 'lucide-react';
import { useStats } from '@/hooks/api';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatDate } from '@/i18n';

export function Dashboard() {
    const { data: stats, isLoading } = useStats();

    const cards = [
        { title: 'Neue Anfragen', value: stats?.reservations.new ?? 0, sub: 'noch nicht bearbeitet', icon: Inbox, href: '/admin/reservations?status=new', accent: 'text-brand-red' },
        { title: 'Diese Woche', value: stats?.reservations.this_week ?? 0, sub: `${stats?.reservations.today ?? 0} heute eingegangen`, icon: CalendarCheck, href: '/admin/reservations', accent: 'text-primary' },
        { title: 'Gerichte', value: stats?.menu.items ?? 0, sub: `${stats?.menu.unavailable ?? 0} ausgeblendet`, icon: UtensilsCrossed, href: '/admin/menu', accent: 'text-primary' },
        { title: 'Galeriebilder', value: stats?.gallery.images ?? 0, sub: `${stats?.gallery.featured ?? 0} auf der Startseite`, icon: Images, href: '/admin/gallery', accent: 'text-primary' },
    ];

    const byDay = stats?.reservations.by_day ?? [];
    const max = Math.max(1, ...byDay.map((d) => d.count));

    return (
        <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.title} to={card.href} className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary">
                            <div className="flex items-center justify-between">
                                <Icon className={`size-5 ${card.accent}`} />
                                <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                            {isLoading ? <Skeleton className="mt-4 h-9 w-16" /> : <p className="mt-4 text-3xl font-bold tabular">{card.value}</p>}
                            <p className="mt-1 text-sm font-semibold">{card.title}</p>
                            <p className="text-xs text-muted-foreground">{card.sub}</p>
                        </Link>
                    );
                })}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                <section className="rounded-lg border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold">Neueste Anfragen</h2>
                        <Link to="/admin/reservations" className="text-sm font-semibold text-primary hover:underline">Alle anzeigen</Link>
                    </div>
                    {isLoading ? (
                        <div className="mt-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
                    ) : stats?.reservations.latest.length ? (
                        <ul className="mt-4 divide-y divide-border">
                            {stats.reservations.latest.map((r) => (
                                <li key={r.id} className="flex items-center gap-4 py-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold">{r.name} <span className="font-normal text-muted-foreground">({r.guests} Pers.)</span></p>
                                        <p className="text-sm text-muted-foreground tabular">{formatDate(r.date, 'de')} um {r.time} Uhr</p>
                                    </div>
                                    <StatusBadge status={r.status} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-sm text-muted-foreground">Noch keine Anfragen.</p>
                    )}
                </section>

                <section className="rounded-lg border border-border bg-card p-5">
                    <h2 className="font-bold">Anfragen der letzten 30 Tage</h2>
                    <p className="text-sm text-muted-foreground">{stats?.reservations.total ?? 0} insgesamt</p>
                    <div className="mt-6 flex h-40 items-end gap-[3px]" role="img" aria-label="Anfragen pro Tag">
                        {byDay.map((day) => (
                            <div
                                key={day.date}
                                title={`${formatDate(day.date, 'de')}: ${day.count}`}
                                className="flex-1 rounded-t-sm bg-primary/80 transition-colors hover:bg-primary"
                                style={{ height: `${Math.max(4, (day.count / max) * 100)}%` }}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
