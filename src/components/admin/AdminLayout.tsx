import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Briefcase, Mail,
    Users, Settings, LogOut, Menu, ChevronRight,
    Building2, Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useConfig } from '@/hooks/useConfig';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Blogartikelen', href: '/admin/posts', icon: FileText },
    { label: 'Vacatures', href: '/admin/jobs', icon: Briefcase },
    { label: 'Team', href: '/admin/contact-slots', icon: Users },
    { label: 'Contact', href: '/admin/contact', icon: Mail },
    { label: 'Instellingen', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const config = useConfig();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const displayName = user?.name || user?.email?.split('@')[0] || 'L.shretah';
    const companyName = config.site.name === 'Firmenname' ? 'Altaj Groep' : (config.site.name || 'Altaj Groep');

    const getCurrentPageTitle = () => {
        const current = navItems.find(item => item.href === location.pathname);
        if (current) return current.label;
        if (location.pathname.startsWith('/admin/posts')) return 'Blogartikelen';
        if (location.pathname.startsWith('/admin/jobs')) return 'Vacatures';
        if (location.pathname.startsWith('/admin/contact-slots')) return 'Team & Termine';
        if (location.pathname.startsWith('/admin/contact')) return 'Contact';
        if (location.pathname.startsWith('/admin/settings')) return 'Instellingen';
        return 'Dashboard';
    };

    const formattedDate = new Intl.DateTimeFormat('nl-NL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(new Date()).toUpperCase();

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={cn(
                "bg-white dark:bg-[#111827] border-r border-slate-100 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-30 shrink-0",
                sidebarOpen ? "w-64" : "w-20"
            )}>
                <div>
                    {/* Brand Header */}
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between h-20">
                        {sidebarOpen ? (
                            <Link to="/admin" className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold shadow-md shadow-amber-200/50 dark:shadow-none shrink-0">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div className="truncate">
                                    <h1 className="font-black text-base text-slate-900 dark:text-white leading-tight truncate">
                                        {companyName}
                                    </h1>
                                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                        Beheerspaneel
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <Link to="/admin" className="mx-auto">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                                    <Building2 className="h-5 w-5" />
                                </div>
                            </Link>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={cn(
                                "h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg",
                                !sidebarOpen && "hidden"
                            )}
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-3 space-y-1.5 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.href === '/admin'
                                ? location.pathname === '/admin'
                                : (location.pathname === item.href || location.pathname.startsWith(`${item.href}/`));

                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group",
                                        isActive
                                            ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-400/25"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                                    )}
                                    title={!sidebarOpen ? item.label : undefined}
                                >
                                    <Icon className={cn(
                                        "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                                        isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                                    )} />
                                    {sidebarOpen && (
                                        <>
                                            <span className="truncate">{item.label}</span>
                                            {isActive && (
                                                <ChevronRight className="h-4 w-4 ml-auto text-white/90 shrink-0" />
                                            )}
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Profile & Logout Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#111827]">
                    {sidebarOpen ? (
                        <div className="space-y-3">
                            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100/80 dark:border-slate-800 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-black text-sm shrink-0">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {displayName}
                                    </div>
                                    <div className="text-[10px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase mt-0.5">
                                        ADMINISTRATOR
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                            >
                                <LogOut className="h-4 w-4 shrink-0" />
                                <span>Uitloggen</span>
                            </button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-full justify-center text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                            onClick={logout}
                            title="Uitloggen"
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17]">
                {/* Modern Top Header */}
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-8 h-20 flex justify-between items-center transition-all">
                    <div>
                        <div className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5">
                            <Link to="/admin" className="hover:text-slate-600 dark:hover:text-slate-300">Admin</Link>
                            <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                            <span className="text-slate-700 dark:text-slate-300 font-extrabold">{getCurrentPageTitle().toUpperCase()}</span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
                            {getCurrentPageTitle()}
                        </h2>
                    </div>

                    <div className="flex items-center gap-5">
                        {/* User Welcome & Online Status */}
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Welkom, <span className="capitalize">{displayName}</span>
                            </div>
                            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                                    ONLINE
                                </span>
                            </div>
                        </div>

                        {/* User Avatar with Golden/Amber Border */}
                        <div className="w-10 h-10 rounded-full border-2 border-amber-300 dark:border-amber-400/80 p-0.5 flex items-center justify-center shrink-0 shadow-xs">
                            <div className="w-full h-full rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xs">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        {/* Formatted Date Banner */}
                        <div className="hidden md:block text-[11px] font-extrabold tracking-widest text-slate-400/90 dark:text-slate-500 uppercase border-l border-slate-200 dark:border-slate-800 pl-5">
                            {formattedDate}
                        </div>
                    </div>
                </header>

                {/* Page View Body */}
                <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}