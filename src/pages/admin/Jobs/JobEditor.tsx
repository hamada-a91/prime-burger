import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useAdminJob, useCreateJob, useUpdateJob } from '@/hooks/api';
import { toast } from 'sonner';
import type { JobFormData } from '@/types/api';

export function JobEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id || id === 'new';

    const { data: job, isLoading: initialLoading, error } = useAdminJob(isNew ? '' : id);
    const createJob = useCreateJob();
    const updateJob = useUpdateJob();

    const { register, handleSubmit, setValue, watch, reset } = useForm<JobFormData>({
        defaultValues: {
            title: '',
            slug: '',
            description: '',
            requirements: '',
            tasks: '',
            foot_notes: '',
            type: 'full-time',
            location: '',
            salary_range: '',
            is_active: true,
        }
    });

    // Populate form when job data loads
    useEffect(() => {
        if (job) {
            reset({
                title: job.title,
                slug: job.slug,
                description: job.description,
                requirements: job.requirements || '',
                tasks: job.tasks || '',
                foot_notes: job.foot_notes || '',
                type: job.type,
                location: job.location || '',
                salary_range: job.salary_range || '',
                is_active: job.is_active,
            });
        }
    }, [job, reset]);

    async function onSubmit(data: JobFormData) {
        const mutation = isNew
            ? createJob.mutateAsync(data)
            : updateJob.mutateAsync({ id: Number(id), ...data });

        toast.promise(mutation, {
            loading: 'Wird gespeichert...',
            success: () => {
                navigate('/admin/jobs');
                return isNew ? 'Job erstellt!' : 'Job aktualisiert!';
            },
            error: 'Fehler beim Speichern',
        });
    }

    // Auto-generate slug from title
    const title = watch('title');
    useEffect(() => {
        if (isNew && title) {
            const slug = title.toLowerCase()
                .replace(/[äöüß]/g, (c: string) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] || c))
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setValue('slug', slug);
        }
    }, [title, isNew, setValue]);

    const isSaving = createJob.isPending || updateJob.isPending;

    if (error) {
        return (
            <div className="p-8 text-center text-destructive">
                <p>Fehler beim Laden des Jobs.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/jobs')}>
                    Zurück zur Übersicht
                </Button>
            </div>
        );
    }

    if (!isNew && initialLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-64" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-96" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {isNew ? 'Neuer Job' : 'Job bearbeiten'}
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Job Titel</Label>
                                    <Input {...register('title', { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Slug (URL)</Label>
                                    <Input {...register('slug', { required: true })} className="bg-muted/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Beschreibung</Label>
                                    <Textarea {...register('description', { required: true })} rows={6} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Anforderungen</Label>
                                    <Textarea {...register('requirements')} rows={6} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Aufgaben</Label>
                                    <Textarea {...register('tasks')} rows={6} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Fußnoten</Label>
                                    <Textarea {...register('foot_notes')} rows={4} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Einstellungen</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <Label htmlFor="active">Aktiv</Label>
                                    <Switch
                                        id="active"
                                        checked={watch('is_active')}
                                        onCheckedChange={(c: boolean) => setValue('is_active', c)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Typ</Label>
                                    <Select
                                        value={watch('type')}
                                        onValueChange={(v: string) => setValue('type', v as JobFormData['type'])}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Wählen..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full-time">Vollzeit</SelectItem>
                                            <SelectItem value="part-time">Teilzeit</SelectItem>
                                            <SelectItem value="freelance">Freelance</SelectItem>
                                            <SelectItem value="internship">Praktikum</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Standort</Label>
                                    <Input {...register('location')} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Gehaltsspanne</Label>
                                    <Input {...register('salary_range')} placeholder="z.B. 50k - 70k" />
                                </div>

                                <Button type="submit" disabled={isSaving} className="w-full mt-4">
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Speichern
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
