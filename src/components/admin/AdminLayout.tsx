import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { CalendarCheck, ExternalLink, Images, LayoutDashboard, LogOut, Menu, Settings, UtensilsCrossed, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStats } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Reservierungen', href: '/admin/reservations', icon: CalendarCheck },
    { label: 'Speisekarte', href: '/admin/menu', icon: UtensilsCrossed },
    { label: 'Galerie', href: '/admin/gallery', icon: Images },
    { label: 'Einstellungen', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { data: stats } = useStats();
    const [open, setOpen] = useState(false);

    const current = NAV.find((item) => (item.href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.href)));
    const newCount = stats?.reservations.new ?? 0;
    const displayName = user?.name || user?.email?.split('@')[0] || 'Admin';

    const nav = (
        <nav className="space-y-1 p-3">
            {NAV.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors',
                            isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        )}
                    >
                        <Icon className="size-5 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {item.href === '/admin/reservations' && newCount > 0 && (
                            <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold', isActive ? 'bg-primary-foreground/20' : 'bg-brand-red text-white')}>{newCount}</span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <title>{`${current?.label ?? 'Admin'} | Prime Burger Verwaltung`}</title>
            {/* Sidebar (desktop) */}
            <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
                <Link to="/admin" className="flex items-center gap-3 border-b border-border px-5 py-4">
                    <img src="/assets/logo.png" alt="" width={44} height={39} className="h-10 w-auto" />
                    <span>
                        <span className="block font-display text-xl leading-none">Prime Burger</span>
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Verwaltung</span>
                    </span>
                </Link>
                {nav}
                <div className="mt-auto space-y-2 border-t border-border p-3">
                    <a href="/de" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground">
                        <ExternalLink className="size-4" /> Website öffnen
                    </a>
                    <div className="flex items-center gap-3 px-3 py-2">
                        <span className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary-foreground">{displayName.charAt(0).toUpperCase()}</span>
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{displayName}</span>
                        <Button variant="ghost" size="icon-sm" onClick={logout} title="Abmelden" aria-label="Abmelden">
                            <LogOut className="size-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur md:px-8">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex size-10 items-center justify-center rounded-md border border-border lg:hidden" aria-label="Navigation">
                            {open ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                        <h1 className="text-lg font-bold">{current?.label ?? 'Admin'}</h1>
                    </div>
                    <div className="hidden text-sm text-muted-foreground sm:block">
                        {new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
                    </div>
                </header>

                {open && (
                    <div className="border-b border-border bg-card lg:hidden">
                        {nav}
                        <div className="flex items-center justify-between border-t border-border px-6 py-3 text-sm">
                            <a href="/de" target="_blank" rel="noopener noreferrer" className="font-semibold text-muted-foreground">Website öffnen</a>
                            <Button variant="ghost" size="sm" onClick={logout}><LogOut className="size-4" /> Abmelden</Button>
                        </div>
                    </div>
                )}

                <main className="flex-1 p-4 md:p-8">
                    <div className="mx-auto w-full max-w-6xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
