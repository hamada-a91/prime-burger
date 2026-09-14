// src/components/blocks/ContactFormBlock.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, Loader2 } from 'lucide-react';
import type { ContactFormBlock as ContactFormBlockType } from '@/config/website.config.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ApiError } from '@/lib/api';
import { useConfig } from '@/hooks';
import { useSettings, useSubmitContact } from '@/hooks/api';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein.' }),
    email: z.string().email({ message: 'Ungültige E-Mail-Adresse.' }),
    phone: z.string().max(50, { message: 'Telefon darf maximal 50 Zeichen lang sein.' }).optional().or(z.literal('')),
    subject: z.string().optional(),
    message: z.string().min(10, { message: 'Nachricht muss mindestens 10 Zeichen lang sein.' }),
    website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactFormBlock(props: ContactFormBlockType) {
    const { title, subtitle, fields, submitText, successMessage, variant, successRedirect } = props;
    const [isSuccess, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const submitContact = useSubmitContact();
    const navigate = useNavigate();
    const config = useConfig();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            website: '',
        },
    });

    async function onSubmit(data: FormValues) {
        setServerError(null);
        try {
            await submitContact.mutateAsync(data);
            setIsSuccess(true);
            form.reset();
            if (successRedirect) navigate(successRedirect);
        } catch (err) {
            if (err instanceof ApiError && err.status === 422) {
                Object.entries(err.errors ?? {}).forEach(([field, messages]) => {
                    form.setError(field as keyof FormValues, { message: messages[0] });
                });
            } else {
                setServerError(err instanceof ApiError ? err.message : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
            }
        }
    }

    const renderField = (field: typeof fields[0]) => {
        const error = form.formState.errors[field.name as keyof FormValues]?.message;

        return (
            <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>

                {field.type === 'textarea' ? (
                    <Textarea
                        id={field.name}
                        placeholder={field.placeholder}
                        {...form.register(field.name as keyof FormValues)}
                        aria-invalid={!!error}
                    />
                ) : field.type === 'select' ? (
                    <select
                        id={field.name}
                        className={cn('flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2')}
                        {...form.register(field.name as keyof FormValues)}
                    >
                        <option value="">Bitte wählen</option>
                        {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                ) : (
                    <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        {...form.register(field.name as keyof FormValues)}
                        aria-invalid={!!error}
                    />
                )}

                {error && <p className="text-sm font-medium text-destructive">{error as string}</p>}
            </div>
        );
    };

    const { data: settings } = useSettings();
    const getSetting = (key: string) => settings?.[key] as string || '';
    const getJsonSetting = (key: string) => settings?.[key] as Record<string, string> || {};

    const settingAddress = getJsonSetting('contact_address');
    const contactInfo = {
        email: getSetting('contact_email') || config.site.contact.email,
        phone: getSetting('contact_phone') || config.site.contact.phone,
        address: {
            street: settingAddress.street || config.site.contact.address?.street,
            zip: settingAddress.zip || config.site.contact.address?.zip,
            city: settingAddress.city || config.site.contact.address?.city,
            country: settingAddress.country || config.site.contact.address?.country,
        },
        openingHours: getJsonSetting('opening_hours'),
        labels: {
            phone: getSetting('label_phone') || 'Telefon',
            email: getSetting('label_email') || 'E-Mail',
            address: getSetting('label_address') || 'Adresse',
            hours: 'Öffnungszeiten',
        },
    };

    const renderContactInfo = () => (
        <div className="mt-8 space-y-6 text-base text-muted-foreground">
            {contactInfo.phone && (
                <div>
                    <h4 className="font-semibold text-foreground mb-1">{contactInfo.labels.phone}</h4>
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-primary transition-colors">{contactInfo.phone}</a>
                </div>
            )}
            {contactInfo.email && (
                <div>
                    <h4 className="font-semibold text-foreground mb-1">{contactInfo.labels.email}</h4>
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">{contactInfo.email}</a>
                </div>
            )}
            {contactInfo.address.street && (
                <div>
                    <h4 className="font-semibold text-foreground mb-1">{contactInfo.labels.address}</h4>
                    <address className="not-italic">
                        {contactInfo.address.street}<br />
                        {contactInfo.address.zip} {contactInfo.address.city}<br />
                        {contactInfo.address.country}
                    </address>
                </div>
            )}
            {Object.keys(contactInfo.openingHours).length > 0 && (
                <div>
                    <h4 className="font-semibold text-foreground mb-1">{contactInfo.labels.hours}</h4>
                    <div className="space-y-1">
                        {Object.entries(contactInfo.openingHours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between max-w-[220px] gap-4">
                                <span>{day}:</span>
                                <span>{hours}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    if (isSuccess && !successRedirect) {
        return (
            <section className="py-20 bg-muted/30">
                <div className="container max-w-md mx-auto text-center">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Vielen Dank!</h3>
                    <p className="text-muted-foreground mb-8">{successMessage}</p>
                    <Button onClick={() => setIsSuccess(false)} variant="outline">Neue Nachricht schreiben</Button>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {variant === 'split' || variant === 'with-info' ? (
                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
                            {subtitle && <p className="text-xl text-muted-foreground mb-8">{subtitle}</p>}
                            {renderContactInfo()}
                        </div>
                    ) : (
                        <div className="lg:col-span-2 text-center mb-12 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
                            {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
                        </div>
                    )}

                    <div className={cn(variant === 'split' || variant === 'with-info' ? '' : 'lg:col-span-2 max-w-xl mx-auto w-full')}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...form.register('website')} />
                            {fields.map(renderField)}

                            {serverError && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">{serverError}</div>}

                            <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting || submitContact.isPending}>
                                {(form.formState.isSubmitting || submitContact.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {submitText}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
