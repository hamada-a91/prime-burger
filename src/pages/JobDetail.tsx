import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin } from 'lucide-react';
import { SEOHead } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useJob } from '@/hooks/api';
import { useSiteConfig } from '@/hooks';

const jobTypeLabels: Record<string, string> = {
    'full-time': 'Vollzeit',
    'part-time': 'Teilzeit',
    freelance: 'Freelance',
    internship: 'Praktikum',
};

function MarkdownText({ value }: { value?: string }) {
    if (!value) return null;
    return <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">{value}</div>;
}

export function JobDetail() {
    const { slug } = useParams<{ slug: string }>();
    const { data: job, isLoading, error } = useJob(slug || '');
    const site = useSiteConfig();

    if (error) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold text-destructive mb-4">Job nicht gefunden</h1>
                <Button asChild variant="outline">
                    <Link to="/jobs"><ArrowLeft className="mr-2 h-4 w-4" />Zurück zu Jobs</Link>
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container py-20 max-w-3xl mx-auto">
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-48 mb-8" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!job) return null;

    const applyHref = `mailto:${site.contact.email}?subject=${encodeURIComponent(`Bewerbung: ${job.title}`)}`;

    return (
        <>
            <SEOHead
                title={job.title}
                description={job.description}
                canonical={`${site.url}/jobs/${job.slug}`}
            />
            <article className="container py-20 max-w-3xl mx-auto">
                <Button asChild variant="ghost" className="mb-6">
                    <Link to="/jobs"><ArrowLeft className="mr-2 h-4 w-4" />Zurück zu Jobs</Link>
                </Button>

                <header className="mb-10">
                    <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
                    <div className="flex flex-wrap gap-3 text-muted-foreground">
                        {job.location && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>}
                        <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" />{jobTypeLabels[job.type] ?? job.type}</span>
                    </div>
                </header>

                <div className="space-y-10">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Beschreibung</h2>
                        <MarkdownText value={job.description} />
                    </section>
                    {job.tasks && <section><h2 className="text-2xl font-semibold mb-4">Aufgaben</h2><MarkdownText value={job.tasks} /></section>}
                    {job.requirements && <section><h2 className="text-2xl font-semibold mb-4">Anforderungen</h2><MarkdownText value={job.requirements} /></section>}
                    {job.foot_notes && <section><MarkdownText value={job.foot_notes} /></section>}
                </div>

                <div className="mt-12 rounded-lg border bg-muted/30 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Interesse?</h2>
                        <p className="text-muted-foreground">Senden Sie uns Ihre Bewerbung per E-Mail.</p>
                    </div>
                    <Button asChild size="lg">
                        <a href={applyHref}>Jetzt bewerben</a>
                    </Button>
                </div>
            </article>
        </>
    );
}
