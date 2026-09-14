import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';
import { useLegalConfig } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const COOKIE_CONSENT_KEY = 'cookie-consent';

interface CookieSettings {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

export function CookieConsentBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<CookieSettings>({
        necessary: true,
        analytics: false,
        marketing: false,
    });
    const legal = useLegalConfig();

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAcceptAll = () => {
        const allSettings = { necessary: true, analytics: true, marketing: true };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(allSettings));
        setShowBanner(false);
    };

    const handleAcceptNecessary = () => {
        const minSettings = { necessary: true, analytics: false, marketing: false };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(minSettings));
        setShowBanner(false);
    };

    const handleSaveSettings = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(settings));
        setShowBanner(false);
        setShowSettings(false);
    };

    // Safe check if legal config is available yet
    if (!legal?.cookieConsent?.enabled || !showBanner) return null;

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-2 mb-1">
                            <Cookie className="h-4 w-4" />
                            {legal.cookieConsent.title || 'Diese Website verwendet Cookies'}
                        </h3>
                        <p className="text-sm text-muted-foreground w-full md:w-3/4">
                            {legal.cookieConsent.description || 'Wir nutzen Cookies, um Ihnen die bestmögliche Erfahrung zu bieten.'}
                            {' '}
                            <Link to={legal.cookieConsent.privacyLink || '/privacy'} className="underline hover:text-primary">
                                Mehr erfahren
                            </Link>
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                            Einstellungen
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleAcceptNecessary}>
                            Nur notwendige
                        </Button>
                        <Button size="sm" onClick={handleAcceptAll}>
                            Alle akzeptieren
                        </Button>
                    </div>
                    <button
                        onClick={handleAcceptNecessary}
                        className="absolute top-2 right-2 md:hidden text-muted-foreground hover:text-foreground"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cookie-Einstellungen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="necessary" className="font-medium">Notwendige Cookies</Label>
                                <span className="text-xs text-muted-foreground">Erforderlich für grundlegende Website-Funktionen</span>
                            </div>
                            <Switch id="necessary" checked={true} disabled />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="analytics" className="font-medium">Analyse Cookies</Label>
                                <span className="text-xs text-muted-foreground">Helfen uns, die Nutzung der Website zu verstehen</span>
                            </div>
                            <Switch
                                id="analytics"
                                checked={settings.analytics}
                                onCheckedChange={(c: boolean) => setSettings(s => ({ ...s, analytics: c }))}
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="marketing" className="font-medium">Marketing Cookies</Label>
                                <span className="text-xs text-muted-foreground">Ermöglichen personalisierte Werbung</span>
                            </div>
                            <Switch
                                id="marketing"
                                checked={settings.marketing}
                                onCheckedChange={(c: boolean) => setSettings(s => ({ ...s, marketing: c }))}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowSettings(false)}>Abbrechen</Button>
                        <Button onClick={handleSaveSettings}>Auswahl speichern</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
