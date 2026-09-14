import { Link } from 'react-router-dom';
import { useConfig } from '@/hooks/useConfig';
import { useSettings } from '@/hooks/api';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Hexagon } from 'lucide-react';

export function Footer() {
    const config = useConfig();
    const { data: settings } = useSettings();

    // Helper to get setting value
    const getSetting = (key: string) => settings?.[key] as string || '';
    const getJsonSetting = (key: string) => settings?.[key] as Record<string, string> || {};

    const contactInfo = {
        email: getSetting('contact_email') || config.site.contact.email,
        phone: getSetting('contact_phone') || config.site.contact.phone,
        address: {
            street: getJsonSetting('contact_address').street || config.site.contact.address?.street,
            city: getJsonSetting('contact_address').city || config.site.contact.address?.city,
            zip: getJsonSetting('contact_address').zip || config.site.contact.address?.zip,
            country: getJsonSetting('contact_address').country || config.site.contact.address?.country,
        }
    };

    // Fallback labels
    const labels = {
        phone: getSetting('label_phone') || 'Telefon',
        email: getSetting('label_email') || 'E-Mail',
        address: getSetting('label_address') || 'Adresse',
    };

    const currentYear = new Date().getFullYear();

    const socialIcons: Record<string, typeof Hexagon> = {
        facebook: Facebook,
        instagram: Instagram,
        linkedin: Linkedin,
        twitter: Twitter,
        youtube: Youtube,
        xing: Hexagon, // Placeholder
        tiktok: Hexagon, // Placeholder
    };

    return (
        <footer className="bg-muted/30 border-t">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand & Social */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                            {config.site.logo?.dark && <img src={config.site.logo.dark} alt={config.site.name} className="h-8 w-auto hidden dark:block" />}
                            {config.site.logo?.light && <img src={config.site.logo.light} alt={config.site.name} className="h-8 w-auto dark:hidden" />}
                            <span>{config.site.name}</span>
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            {config.site.description}
                        </p>
                        <div className="flex gap-4">
                            {config.social.links.map((link) => {
                                const Icon = socialIcons[link.platform] || Hexagon;
                                return (
                                    <a
                                        key={link.platform}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="sr-only">{link.platform}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Navigation</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {config.navigation.items.map((item) => (
                                <li key={item.href}>
                                    <Link to={item.href} className="hover:text-foreground transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold mb-4">Rechtliches</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/imprint" className="hover:text-foreground transition-colors">
                                    Impressum
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-foreground transition-colors">
                                    Datenschutz
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-foreground transition-colors">
                                    AGB
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold mb-4">Kontakt</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            {contactInfo.address.street && (
                                <li>
                                    <strong className="block text-foreground">{labels.address}</strong>
                                    {contactInfo.address.street}<br />
                                    {contactInfo.address.zip} {contactInfo.address.city}
                                </li>
                            )}
                            <li>
                                <strong className="block text-foreground">{labels.email}</strong>
                                <a href={`mailto:${contactInfo.email}`} className="hover:text-primary">
                                    {contactInfo.email}
                                </a>
                            </li>
                            {contactInfo.phone && (
                                <li>
                                    <strong className="block text-foreground">{labels.phone}</strong>
                                    <a href={`tel:${contactInfo.phone}`} className="hover:text-primary">
                                        {contactInfo.phone}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {currentYear} {config.site.name}. Alle Rechte vorbehalten.</p>
                    <div className="flex items-center gap-2">
                        <span>Designed bei</span>
                        <a href="https://vorpoint.de" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-foreground">
                            vorpoint.de
                        </a>
                        <img src="/public/logo_main2.webp" alt="Vorpoint Logo" className="h-6 w-auto" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
