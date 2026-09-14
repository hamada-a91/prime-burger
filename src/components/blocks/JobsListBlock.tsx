import { Link } from 'react-router-dom';
import { Briefcase, MapPin } from 'lucide-react';
import type { JobsListBlock as JobsListBlockType } from '@/config/website.config.schema';
import { useJobs } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const jobTypeLabels: Record<string, string> = {
    'full-time': 'Vollzeit',
    'part-time': 'Teilzeit',
    freelance: 'Freelance',
    internship: 'Praktikum',
};

export function JobsListBlock({ title, subtitle, limit }: JobsListBlockType) {
    const { data, isLoading, error } = useJobs();
    const jobs = limit ? data?.data.slice(0, limit) : data?.data;

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
                    {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
                </div>

                {error && <p className="text-center text-destructive">Jobs konnten nicht geladen werden.</p>}

                {isLoading ? (
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {[...Array(3)].map((_, index) => <Skeleton key={index} className="h-28 w-full" />)}
                    </div>
                ) : jobs && jobs.length > 0 ? (
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {jobs.map((job) => (
                            <Link key={job.id} to={`/jobs/${job.slug}`} className="block group">
                                <article className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{job.title}</h3>
                                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                                                {job.location && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>}
                                                <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" />{jobTypeLabels[job.type] ?? job.type}</span>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">Details</Button>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">Aktuell sind keine Stellen ausgeschrieben.</p>
                )}
            </div>
        </section>
    );
}
