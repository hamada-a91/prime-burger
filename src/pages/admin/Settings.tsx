import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { useAdminSettings, useUpdateSettings } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TranslatedInput } from '@/components/admin/TranslatedInput';
import { DAY_KEYS } from '@/lib/opening-hours';
import { cn } from '@/lib/utils';
import type { DayKey, DeliveryPlatform, OpeningHours, SettingsMap } from '@/types/api';

const DAY_LABELS: Record<DayKey, string> = { mon: 'Montag', tue: 'Dienstag', wed: 'Mittwoch', thu: 'Donnerstag', fri: 'Freitag', sat: 'Samstag', sun: 'Sonntag' };
const TABS = ['Kontakt', 'Öffnungszeiten', 'Lieferservice', 'Texte', 'Social'] as const;

const EMPTY_HOURS: OpeningHours = Object.fromEntries(DAY_KEYS.map((d) => [d, { open: '11:30', close: '22:00', closed: false }])) as OpeningHours;

export function Settings() {
    const { data, isLoading } = useAdminSettings();
    const save = useUpdateSettings();
    const [tab, setTab] = useState<(typeof TABS)[number]>('Kontakt');
    const [form, setForm] = useState<SettingsMap>({});

    useEffect(() => {
        if (data) {
            setForm({
                ...data,
                contact_address: data.contact_address ?? {},
                opening_hours: data.opening_hours ?? EMPTY_HOURS,
                delivery_platforms: data.delivery_platforms ?? [],
                social_links: data.social_links ?? {},
            });
        }
    }, [data]);

    const set = <K extends keyof SettingsMap>(key: K, value: SettingsMap[K]) => setForm((f) => ({ ...f, [key]: value }));

    const setDay = (day: DayKey, patch: Partial<OpeningHours[DayKey]>) => {
        const hours = form.opening_hours ?? EMPTY_HOURS;
        set('opening_hours', { ...hours, [day]: { ...hours[day], ...patch } });
    };

    const setPlatform = (index: number, patch: Partial<DeliveryPlatform>) => {
        const list = [...(form.delivery_platforms ?? [])];
        list[index] = { ...list[index], ...patch };
        set('delivery_platforms', list);
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await save.mutateAsync(form);
            toast.success('Einstellungen gespeichert.');
        } catch {
            toast.error('Speichern fehlgeschlagen.');
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1" role="tablist">
                    {TABS.map((name) => (
                        <button key={name} type="button" role="tab" aria-selected={tab === name} onClick={() => setTab(name)} className={cn('rounded-md px-4 py-2 text-sm font-semibold transition-colors', tab === name ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
                            {name}
                        </button>
                    ))}
                </div>
                <Button type="submit" disabled={save.isPending} className="ml-auto">
                    {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Speichern
                </Button>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 space-y-6">
                {tab === 'Kontakt' && (
                    <>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Name des Restaurants" id="site_name"><Input id="site_name" value={form.site_name ?? ''} onChange={(e) => set('site_name', e.target.value)} /></Field>
                            <Field label="Telefon" id="contact_phone"><Input id="contact_phone" value={form.contact_phone ?? ''} onChange={(e) => set('contact_phone', e.target.value)} /></Field>
                            <Field label="Öffentliche E-Mail" id="contact_email"><Input id="contact_email" type="email" value={form.contact_email ?? ''} onChange={(e) => set('contact_email', e.target.value)} /></Field>
                            <Field label="Empfänger für Reservierungsanfragen" id="reservation_email" hint="Wird nicht öffentlich angezeigt."><Input id="reservation_email" type="email" value={form.reservation_email ?? ''} onChange={(e) => set('reservation_email', e.target.value)} /></Field>
                        </div>
                        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
                            <Field label="Straße und Hausnummer" id="street"><Input id="street" value={form.contact_address?.street ?? ''} onChange={(e) => set('contact_address', { ...form.contact_address, street: e.target.value })} /></Field>
                            <Field label="PLZ" id="zip"><Input id="zip" value={form.contact_address?.zip ?? ''} onChange={(e) => set('contact_address', { ...form.contact_address, zip: e.target.value })} /></Field>
                            <Field label="Stadt" id="city"><Input id="city" value={form.contact_address?.city ?? ''} onChange={(e) => set('contact_address', { ...form.contact_address, city: e.target.value })} /></Field>
                        </div>
                        <Field label="Google-Maps-Link" id="maps_url"><Input id="maps_url" type="url" value={form.maps_url ?? ''} onChange={(e) => set('maps_url', e.target.value)} /></Field>
                    </>
                )}

                {tab === 'Öffnungszeiten' && (
                    <div className="space-y-3">
                        {DAY_KEYS.map((day) => {
                            const value = (form.opening_hours ?? EMPTY_HOURS)[day];
                            return (
                                <div key={day} className="grid items-center gap-3 sm:grid-cols-[120px_1fr_auto_1fr_auto]">
                                    <span className="font-semibold">{DAY_LABELS[day]}</span>
                                    <Input type="time" value={value.open} disabled={value.closed} onChange={(e) => setDay(day, { open: e.target.value })} aria-label={`${DAY_LABELS[day]} öffnet`} />
                                    <span className="text-center text-sm text-muted-foreground">bis</span>
                                    <Input type="time" value={value.close} disabled={value.closed} onChange={(e) => setDay(day, { close: e.target.value })} aria-label={`${DAY_LABELS[day]} schließt`} />
                                    <label className="flex items-center gap-2 text-sm">
                                        <Switch checked={value.closed} onCheckedChange={(closed) => setDay(day, { closed })} /> Geschlossen
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                )}

                {tab === 'Lieferservice' && (
                    <div className="space-y-6">
                        {(form.delivery_platforms ?? []).map((platform, i) => (
                            <fieldset key={platform.key} className="grid gap-4 rounded-md border border-border p-4 md:grid-cols-2">
                                <legend className="px-1 text-sm font-bold">{platform.name}</legend>
                                <Field label="Link zur Bestellseite" id={`url-${platform.key}`}><Input id={`url-${platform.key}`} type="url" value={platform.url} onChange={(e) => setPlatform(i, { url: e.target.value })} /></Field>
                                <Field label="Lieferzeit (Anzeige)" id={`eta-${platform.key}`}><Input id={`eta-${platform.key}`} value={platform.eta} onChange={(e) => setPlatform(i, { eta: e.target.value })} placeholder="30-45 Min." /></Field>
                                <div className="md:col-span-2">
                                    <TranslatedInput label="Badge (z. B. Beliebt / Schnell / Neu)" value={platform.badge} onChange={(badge) => setPlatform(i, { badge })} />
                                </div>
                            </fieldset>
                        ))}
                        <p className="text-xs text-muted-foreground">Leere Links werden trotzdem angezeigt. Um eine Plattform zu entfernen, wenden Sie sich an die Technik.</p>
                    </div>
                )}

                {tab === 'Texte' && (
                    <div className="space-y-6">
                        <TranslatedInput label="Hero-Überschrift (Startseite)" value={form.hero_headline} onChange={(v) => set('hero_headline', v)} />
                        <TranslatedInput label="Hero-Unterzeile" multiline rows={2} value={form.hero_subline} onChange={(v) => set('hero_subline', v)} />
                        <TranslatedInput label="Unsere Geschichte" multiline rows={5} value={form.about_story} onChange={(v) => set('about_story', v)} />
                        <TranslatedInput label="Unsere Philosophie" multiline rows={4} value={form.about_philosophy} onChange={(v) => set('about_philosophy', v)} />
                        <TranslatedInput label="Hinweis auf der Reservierungsseite" multiline rows={2} value={form.reservation_notice} onChange={(v) => set('reservation_notice', v)} />
                    </div>
                )}

                {tab === 'Social' && (
                    <div className="grid gap-4 md:grid-cols-3">
                        {(['instagram', 'facebook', 'tripadvisor'] as const).map((key) => (
                            <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} id={`social-${key}`}>
                                <Input id={`social-${key}`} type="url" placeholder="https://" value={form.social_links?.[key] ?? ''} onChange={(e) => set('social_links', { ...form.social_links, [key]: e.target.value })} />
                            </Field>
                        ))}
                    </div>
                )}
            </div>
        </form>
    );
}

function Field({ label, id, hint, children }: { label: string; id: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}
