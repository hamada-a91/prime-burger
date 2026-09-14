import { Link } from 'react-router-dom';
import {
    FileText, Briefcase, Mail, Users,
    TrendingUp, Eye, ArrowRight, Sparkles, CheckCircle2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from '@/hooks/api';
import { useConfig } from '@/hooks/useConfig';

export function Dashboard() {
    const { data: stats, isLoading, error } = useDashboardStats();
    const config = useConfig();
    const companyName = config.site.name === 'Firmenname' ? 'Altaj Groep' : (config.site.name || 'Altaj Groep');

    const cards = [
        {
            title: 'BLOGARTIKELEN',
            value: stats?.blog.total ?? 0,
            sub: `${stats?.blog.published ?? 0} gepubliceerd`,
            icon: FileText,
            href: '/admin/posts',
            bgCard: 'bg-[#EEF2FF] dark:bg-indigo-950/25 border-indigo-100/90 dark:border-indigo-900/40 shadow-indigo-100/60 dark:shadow-none',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            iconBg: 'bg-white dark:bg-indigo-900/70',
            arrowColor: 'text-indigo-300 dark:text-indigo-500',
        },
        {
            title: 'VACATURES',
            value: stats?.jobs.total ?? 0,
            sub: `${stats?.jobs.active ?? 0} actief`,
            icon: Briefcase,
            href: '/admin/jobs',
            bgCard: 'bg-[#FFFBEB] dark:bg-amber-950/25 border-amber-100/90 dark:border-amber-900/40 shadow-amber-100/60 dark:shadow-none',
            iconColor: 'text-amber-600 dark:text-amber-400',
            iconBg: 'bg-white dark:bg-amber-900/70',
            arrowColor: 'text-amber-300 dark:text-amber-500',
        },
        {
            title: 'TEAMLEDEN',
            value: stats?.team?.total ?? 0,
            sub: 'Actieve leden',
            icon: Users,
            href: '/admin/contact-slots',
            bgCard: 'bg-[#FAF5FF] dark:bg-purple-950/25 border-purple-100/90 dark:border-purple-900/40 shadow-purple-100/60 dark:shadow-none',
            iconColor: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-white dark:bg-purple-900/70',
            arrowColor: 'text-purple-300 dark:text-purple-500',
        },
        {
            title: 'NIEUWE AANVRAGEN',
            value: stats?.contacts.new ?? 0,
            sub: 'Ongelezen berichten',
            icon: Mail,
            href: '/admin/contact',
            bgCard: 'bg-[#F0FDF4] dark:bg-emerald-950/25 border-emerald-100/90 dark:border-emerald-900/40 shadow-emerald-100/60 dark:shadow-none',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-white dark:bg-emerald-900/70',
            arrowColor: 'text-emerald-300 dark:text-emerald-500',
        },
    ];

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-3xl text-destructive">
                <p className="font-bold">Fout bij het laden van dashboard-gegevens.</p>
                <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            </div>
        );
    }

    const hasTrendsData = stats?.contacts.by_day && stats.contacts.by_day.some(d => d.count > 0);
    const maxTrend = hasTrendsData ? Math.max(...(stats?.contacts.by_day || []).map(d => d.count), 1) : 1;

    return (
        <div className="space-y-8">
            {/* Header / Welcome Banner */}
            <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    Dashboard Overzicht
                </h1>
                <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 mt-1">
                    Hier is wat er vandaag gebeurt bij <span className="font-bold text-slate-700 dark:text-slate-300">{companyName}</span>.
                </p>
            </div>

            {/* 4 Signature Pastel KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {cards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.href}
                        className={`block rounded-3xl border p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group ${card.bgCard}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${card.iconBg} ${card.iconColor}`}>
                                <card.icon className="h-5 w-5" />
                            </div>
                            <ArrowRight className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5 ${card.arrowColor}`} />
                        </div>

                        <div className="mt-5">
                            {isLoading ? (
                                <Skeleton className="h-10 w-20 rounded-xl" />
                            ) : (
                                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {card.value}
                                </div>
                            )}

                            <div className="text-[11px] font-black tracking-wider text-slate-600 dark:text-slate-400 uppercase mt-1">
                                {card.title}
                            </div>

                            <div className="text-xs text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
                                <Eye className="h-3.5 w-3.5 shrink-0" />
                                <span>{card.sub}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Middle Section: Trends (Left) & Content Status (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left: Aanvraag Trends (approx 7 cols) */}
                <div className="lg:col-span-8 bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-7 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Aanvraag Trends
                                </h2>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                    Contactaanvragen van de afgelopen 14 dagen
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="my-8">
                            {isLoading ? (
                                <Skeleton className="h-44 w-full rounded-2xl" />
                            ) : hasTrendsData ? (
                                <div className="h-44 flex items-end gap-2 pt-6">
                                    {stats?.contacts.by_day.slice(-14).map((d) => {
                                        const heightPct = Math.max((d.count / maxTrend) * 100, 8);
                                        return (
                                            <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                                    {d.count}
                                                </div>
                                                <div
                                                    className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg transition-all duration-300 group-hover:from-amber-600 group-hover:to-amber-500 group-hover:brightness-110 shadow-xs"
                                                    style={{ height: `${heightPct}%` }}
                                                    title={`${d.date}: ${d.count} aanvragen`}
                                                />
                                                <span className="text-[9px] text-slate-400 truncate w-full text-center">
                                                    {d.date.slice(5)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-44 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm font-medium">
                                    <p>Geen gegevens beschikbaar</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Stats: VANDAAG, DEZE WEEK, DEZE MAAND */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                        <div>
                            <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                VANDAAG
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                                {isLoading ? <Skeleton className="h-8 w-12 rounded-lg" /> : (stats?.contacts.today ?? 0)}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                DEZE WEEK
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                                {isLoading ? <Skeleton className="h-8 w-12 rounded-lg" /> : (stats?.contacts.this_week ?? 0)}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                DEZE MAAND
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                                {isLoading ? <Skeleton className="h-8 w-12 rounded-lg" /> : (stats?.contacts.this_month ?? 0)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Inhoud Status (approx 4 cols, Signature Dark Card) */}
                <div className="lg:col-span-4 bg-[#0F172A] text-white rounded-3xl p-7 shadow-2xl border border-slate-800/90 flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                Inhoud Status
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Snelle blik op uw data
                            </p>
                        </div>

                        {/* List Items */}
                        <div className="space-y-3">
                            <Link
                                to="/admin/posts"
                                className="bg-[#1E293B]/80 hover:bg-[#1E293B] border border-slate-800/60 p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-200 group-hover:text-white">
                                        Concepten
                                    </span>
                                </div>
                                <span className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/50 text-slate-300 text-xs font-bold flex items-center justify-center">
                                    {isLoading ? '-' : (stats?.blog.drafts ?? 0)}
                                </span>
                            </Link>

                            <Link
                                to="/admin/jobs"
                                className="bg-[#1E293B]/80 hover:bg-[#1E293B] border border-slate-800/60 p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-200 group-hover:text-white">
                                        Verlopen Jobs
                                    </span>
                                </div>
                                <span className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/50 text-slate-300 text-xs font-bold flex items-center justify-center">
                                    {isLoading ? '-' : (stats?.jobs.expired ?? 0)}
                                </span>
                            </Link>

                            <Link
                                to="/admin/contact"
                                className="bg-[#1E293B]/80 hover:bg-[#1E293B] border border-slate-800/60 p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-200 group-hover:text-white">
                                        Ongelezen contact
                                    </span>
                                </div>
                                <span className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/50 text-slate-300 text-xs font-bold flex items-center justify-center">
                                    {isLoading ? '-' : (stats?.contacts.new ?? 0)}
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="mt-8">
                        <Link
                            to="/admin/settings"
                            className="w-full bg-white text-slate-900 hover:bg-slate-100 active:scale-[0.99] font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md text-center block text-sm tracking-tight"
                        >
                            Beheer Systeem
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}