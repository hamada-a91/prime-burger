import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSettings, useUpdateSettings } from '@/hooks/api';
import type { SettingsMap } from '@/hooks/api';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

interface SettingsFormValues {
    contact_email: string;
    contact_phone: string;
    contact_address_street: string;
    contact_address_city: string;
    contact_address_zip: string;
    contact_address_country: string;
    opening_hours_mo_fr: string;
    opening_hours_sa: string;
    opening_hours_so: string;
    label_phone: string;
    label_email: string;
    label_address: string;
}

export function Settings() {
    const { data: settings, isLoading } = useSettings();
    const updateSettings = useUpdateSettings();

    const { register, handleSubmit, reset } = useForm<SettingsFormValues>();

    useEffect(() => {
        if (settings) {
            // Flatten nested objects for the form
            const address = settings.contact_address as Record<string, string> || {};
            const hours = settings.opening_hours as Record<string, string> || {};

            reset({
                contact_email: settings.contact_email as string || '',
                contact_phone: settings.contact_phone as string || '',
                contact_address_street: address.street || '',
                contact_address_city: address.city || '',
                contact_address_zip: address.zip || '',
                contact_address_country: address.country || '',
                opening_hours_mo_fr: hours['Mo-Fr'] || '',
                opening_hours_sa: hours['Sa'] || '',
                opening_hours_so: hours['So'] || '',
                label_phone: settings.label_phone as string || '',
                label_email: settings.label_email as string || '',
                label_address: settings.label_address as string || '',
            });
        }
    }, [settings, reset]);

    async function onSubmit(data: SettingsFormValues) {
        // Re-structure data for API
        const apiData: SettingsMap = {
            contact_email: data.contact_email,
            contact_phone: data.contact_phone,
            contact_address: {
                street: data.contact_address_street,
                city: data.contact_address_city,
                zip: data.contact_address_zip,
                country: data.contact_address_country,
            },
            opening_hours: {
                'Mo-Fr': data.opening_hours_mo_fr,
                'Sa': data.opening_hours_sa,
                'So': data.opening_hours_so,
            },
            label_phone: data.label_phone,
            label_email: data.label_email,
            label_address: data.label_address,
        };

        try {
            await updateSettings.mutateAsync(apiData);
            toast.success('Einstellungen gespeichert');
        } catch {
            toast.error('Fehler beim Speichern');
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Einstellungen</h1>
                <Button onClick={handleSubmit(onSubmit)} disabled={updateSettings.isPending}>
                    {updateSettings.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Speichern
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kontaktinformationen</CardTitle>
                        <CardDescription>Diese Informationen werden im Footer und auf der Kontaktseite angezeigt.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>E-Mail</Label>
                                <Input {...register('contact_email')} />
                            </div>
                            <div className="space-y-2">
                                <Label>Telefon</Label>
                                <Input {...register('contact_phone')} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Adresse</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Straße & Hausnummer" {...register('contact_address_street')} />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="PLZ" {...register('contact_address_zip')} />
                                    <Input placeholder="Stadt" {...register('contact_address_city')} />
                                </div>
                                <Input placeholder="Land" {...register('contact_address_country')} className="md:col-span-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Opening Hours */}
                <Card>
                    <CardHeader>
                        <CardTitle>Öffnungszeiten</CardTitle>
                        <CardDescription>Definieren Sie Ihre Erreichbarkeiten.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Mo - Fr</Label>
                                <Input {...register('opening_hours_mo_fr')} placeholder="09:00 - 18:00" />
                            </div>
                            <div className="space-y-2">
                                <Label>Samstag</Label>
                                <Input {...register('opening_hours_sa')} placeholder="10:00 - 14:00" />
                            </div>
                            <div className="space-y-2">
                                <Label>Sonntag</Label>
                                <Input {...register('opening_hours_so')} placeholder="Geschlossen" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Labels */}
                <Card>
                    <CardHeader>
                        <CardTitle>Beschriftungen (Labels)</CardTitle>
                        <CardDescription>Passen Sie die Überschriften der Kontakt-Sektionen an.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Telefon Label</Label>
                                <Input {...register('label_phone')} />
                            </div>
                            <div className="space-y-2">
                                <Label>E-Mail Label</Label>
                                <Input {...register('label_email')} />
                            </div>
                            <div className="space-y-2">
                                <Label>Adresse Label</Label>
                                <Input {...register('label_address')} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
