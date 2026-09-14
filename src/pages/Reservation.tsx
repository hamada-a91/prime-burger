import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Info, Loader2, Phone } from 'lucide-react';
import { useSubmitReservation } from '@/hooks/api';
import { useSiteInfo } from '@/hooks';
import { useT, usePick, type Translate } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SEOHead } from '@/components/seo';
import { HoursTable } from '@/components/site/HoursTable';
import { PageHero } from '@/components/site/PageHero';
import { cn } from '@/lib/utils';

const TIME_SLOTS = ['11:30', '12:00', '12:30', '13:00', '13:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

function todayIso(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function buildSchema(t: Translate) {
    return z.object({
        name: z.string().trim().min(2, t('reservation.errors.name')).max(120, t('reservation.errors.name')),
        email: z.email(t('reservation.errors.email')),
        phone: z.string().trim().min(5, t('reservation.errors.phone')).max(50, t('reservation.errors.phone')),
        guests: z.number(t('reservation.errors.guests')).int().min(1, t('reservation.errors.guests')).max(20, t('reservation.errors.guests')),
        date: z.string().refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && v >= todayIso(), t('reservation.errors.date')),
        time: z.string().refine((v) => TIME_SLOTS.includes(v), t('reservation.errors.time')),
        notes: z.string().max(1000, t('reservation.errors.notes')).optional(),
        website: z.string().max(0).optional(),
    });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

const fieldClass = 'h-12 rounded-md border-input bg-surface px-4 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/60 aria-invalid:border-destructive';

export function Reservation() {
    const t = useT();
    const pick = usePick();
    const info = useSiteInfo();
    const submit = useSubmitReservation();
    const [sent, setSent] = useState<FormValues | null>(null);
    const summaryRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);
    const schema = useMemo(() => buildSchema(t), [t]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, submitCount, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { guests: 2, date: '', time: '', notes: '', website: '' },
    });

    const errorList = Object.entries(errors).filter(([key]) => key !== 'website');

    useEffect(() => {
        if (submitCount > 0 && errorList.length > 0) summaryRef.current?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitCount]);

    useEffect(() => {
        if (sent) successRef.current?.focus();
    }, [sent]);

    const onSubmit = async (values: FormValues) => {
        await submit.mutateAsync({ ...values, notes: values.notes || undefined });
        setSent(values);
        reset();
    };

    const notice = pick(info.settings.reservation_notice);

    return (
        <>
            <SEOHead title={t('reservation.seoTitle')} description={t('reservation.seoDescription')} routeKey="reservation" />
            <PageHero title={t('reservation.title')} lead={t('reservation.lead')} image="/assets/burger-table.webp" imagePosition="center 60%" />

            <div className="container-site grid gap-12 py-12 md:py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
                <div>
                    {sent ? (
                        <div ref={successRef} tabIndex={-1} className="rounded-lg border border-success/40 bg-card p-8 md:p-10 outline-none fade-up">
                            <CheckCircle2 className="size-12 text-success" aria-hidden />
                            <h2 className="mt-5 font-display display-md text-foreground">{t('reservation.success.title')}</h2>
                            <p className="mt-3 text-muted-foreground">{t('reservation.success.text', { email: sent.email })}</p>

                            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 rounded-md bg-surface p-4 text-sm sm:grid-cols-3">
                                <div><dt className="text-muted-foreground">{t('reservation.form.date')}</dt><dd className="font-semibold tabular">{sent.date.split('-').reverse().join('.')}</dd></div>
                                <div><dt className="text-muted-foreground">{t('reservation.form.time')}</dt><dd className="font-semibold tabular">{sent.time}</dd></div>
                                <div><dt className="text-muted-foreground">{t('reservation.form.guests')}</dt><dd className="font-semibold tabular">{sent.guests}</dd></div>
                            </dl>

                            <div className="mt-8 rounded-md border border-primary/40 bg-primary/10 p-5">
                                <p className="font-semibold text-foreground">{t('reservation.success.urgent')}</p>
                                <Button asChild size="lg" className="mt-3">
                                    <a href={info.phoneHref}>
                                        <Phone aria-hidden /> {info.phone}
                                    </a>
                                </Button>
                            </div>

                            <Button variant="link" className="mt-6 px-0" onClick={() => setSent(null)}>
                                {t('reservation.success.another')}
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                            {submitCount > 0 && errorList.length > 0 && (
                                <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 p-4 outline-none">
                                    <p className="font-semibold text-foreground">{t('reservation.form.errorSummary')}</p>
                                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                                        {errorList.map(([key, error]) => (
                                            <li key={key}>
                                                <a href={`#field-${key}`} className="underline hover:text-foreground">{error?.message as string}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field id="field-name" label={t('reservation.form.name')} error={errors.name?.message}>
                                    <Input id="field-name" autoComplete="name" aria-invalid={!!errors.name} className={fieldClass} {...register('name')} />
                                </Field>
                                <Field id="field-email" label={t('reservation.form.email')} error={errors.email?.message}>
                                    <Input id="field-email" type="email" autoComplete="email" inputMode="email" aria-invalid={!!errors.email} className={fieldClass} {...register('email')} />
                                </Field>
                                <Field id="field-phone" label={t('reservation.form.phone')} error={errors.phone?.message}>
                                    <Input id="field-phone" type="tel" autoComplete="tel" inputMode="tel" aria-invalid={!!errors.phone} className={fieldClass} {...register('phone')} />
                                </Field>
                                <Field id="field-guests" label={t('reservation.form.guests')} error={errors.guests?.message}>
                                    <select id="field-guests" aria-invalid={!!errors.guests} className={cn(fieldClass, 'w-full border appearance-none')} {...register('guests', { valueAsNumber: true })}>
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <option key={n} value={n}>{n === 1 ? t('reservation.form.guest', { n }) : t('reservation.form.guestsPlural', { n })}</option>
                                        ))}
                                        <option value={6}>{t('reservation.form.guestsMax')}</option>
                                    </select>
                                </Field>
                                <Field id="field-date" label={t('reservation.form.date')} error={errors.date?.message}>
                                    <Input id="field-date" type="date" min={todayIso()} aria-invalid={!!errors.date} className={cn(fieldClass, 'appearance-none')} {...register('date')} />
                                </Field>
                                <Field id="field-time" label={t('reservation.form.time')} error={errors.time?.message}>
                                    <select id="field-time" aria-invalid={!!errors.time} className={cn(fieldClass, 'w-full border appearance-none')} {...register('time')}>
                                        <option value="">{t('reservation.form.timePlaceholder')}</option>
                                        {TIME_SLOTS.map((slot) => (
                                            <option key={slot} value={slot}>{slot}{t('hours.oclock') ? ` ${t('hours.oclock')}` : ''}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field id="field-notes" label={t('reservation.form.notes')} hint={t('reservation.form.optional')} error={errors.notes?.message}>
                                <Textarea id="field-notes" rows={4} placeholder={t('reservation.form.notesPlaceholder')} aria-invalid={!!errors.notes} className={cn(fieldClass, 'h-auto py-3')} {...register('notes')} />
                            </Field>

                            {/* Honeypot: hidden from humans, bots fill it. */}
                            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
                                <label htmlFor="field-website">Website</label>
                                <input id="field-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
                            </div>

                            {submit.isError && (
                                <p role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-foreground">
                                    {t('reservation.errors.submit')}{' '}
                                    <a href={info.phoneHref} className="font-semibold text-primary hover:underline">{info.phone}</a>
                                </p>
                            )}

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <Button type="submit" size="xl" disabled={isSubmitting || submit.isPending} className="sm:min-w-56">
                                    {submit.isPending ? (
                                        <>
                                            <Loader2 className="animate-spin" aria-hidden /> {t('reservation.form.submitting')}
                                        </>
                                    ) : (
                                        t('reservation.form.submit')
                                    )}
                                </Button>
                                <p className="text-xs text-muted-foreground">{t('reservation.form.privacy')}</p>
                            </div>
                        </form>
                    )}
                </div>

                <aside className="space-y-6 lg:pt-2">
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h2 className="font-display display-sm text-foreground">{t('reservation.callTitle')}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">{t('reservation.callText')}</p>
                        <Button asChild variant="outline" size="lg" className="mt-4 w-full">
                            <a href={info.phoneHref}>
                                <Phone aria-hidden /> {info.phone}
                            </a>
                        </Button>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-6">
                        <h2 className="font-display display-sm text-foreground">{t('hours.title')}</h2>
                        <HoursTable grouped={false} className="mt-4" />
                    </div>

                    <div className="rounded-lg border border-border bg-card p-6">
                        <h2 className="font-display display-sm text-foreground">{t('reservation.infoTitle')}</h2>
                        <address className="not-italic mt-3 text-sm text-muted-foreground">
                            {info.address.street}, {info.address.zip} {info.address.city}
                            <br />
                            <a href={info.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">{t('contact.route')}</a>
                        </address>
                        {notice && (
                            <p className="mt-4 flex gap-2 text-sm text-muted-foreground">
                                <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                                {notice}
                            </p>
                        )}
                    </div>
                </aside>
            </div>
        </>
    );
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-semibold text-foreground">
                {label}
                {hint && <span className="ml-1.5 font-normal text-muted-foreground">({hint})</span>}
            </Label>
            {children}
            {error && (
                <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
