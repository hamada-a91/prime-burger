// src/config/website.config.ts
import type { WebsiteConfig } from './website.config.schema';

export const websiteConfig: WebsiteConfig = {
    site: {
        name: 'Firmenname',
        tagline: 'Ihr Slogan hier',
        description: 'Kurze Beschreibung der Firma für SEO',
        url: 'https://example.com',
        logo: {
            light: '/assets/logos/logo.svg',
            dark: '/assets/logos/logo-dark.svg',
            favicon: '/assets/logos/favicon.ico',
        },
        contact: {
            email: 'kontakt@example.com',
            phone: '+49 123 456789',
            address: {
                street: 'Musterstraße 1',
                city: 'Berlin',
                zip: '10115',
                country: 'Deutschland',
            },
        },
        language: 'de',
    },

    tokens: {
        colors: {
            primary: '200 80% 50%',
            secondary: '220 60% 40%',
            accent: '45 100% 50%',
            background: '0 0% 100%',
            foreground: '0 0% 10%',
            muted: '0 0% 96%',
            destructive: '0 80% 50%',
        },
        radius: 'lg',
        shadows: {
            sm: '0 1px 2px rgba(0,0,0,0.05)',
            md: '0 4px 6px rgba(0,0,0,0.1)',
            lg: '0 10px 15px rgba(0,0,0,0.15)',
        },
        typography: {
            fontFamily: {
                heading: 'Raleway, sans-serif',
                body: 'Inter, sans-serif',
            },
            fontSizes: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem',
            },
        },
        spacing: {
            section: '6rem',
            container: '1280px',
        },
        animations: {
            enabled: true,
            duration: '300ms',
            easing: 'ease-in-out',
        },
    },

    navigation: {
        items: [
            { label: 'Home', href: '/' },
            { label: 'Über uns', href: '/about' },
            { label: 'Leistungen', href: '/services' },
            { label: 'Blog', href: '/blog' },
            { label: 'Jobs', href: '/jobs' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Kontakt', href: '/contact' },
        ],
        cta: {
            text: 'Jetzt starten',
            href: '/contact',
            variant: 'default',
        },
    },

    pages: {
        home: {
            seo: {
                title: 'Startseite',
                description: 'Willkommen bei Firmenname - Ihr Partner für...',
                ogImage: '/assets/images/og-home.jpg',
            },
            blocks: [
                {
                    type: 'hero',
                    variant: 'centered',
                    headline: 'Ihre Headline hier',
                    subheadline: 'Beschreibender Text unter der Headline',
                    badge: 'Neu: Feature X',
                    cta: {
                        primary: { text: 'Jetzt anfragen', href: '/contact' },
                        secondary: { text: 'Mehr erfahren', href: '/about' },
                    },
                    backgroundImage: '/assets/images/hero-bg.webp',
                },
                {
                    type: 'social-proof',
                    variant: 'logos',
                    title: 'Vertraut von führenden Unternehmen',
                    logos: [
                        { src: '/assets/logos/client-1.svg', alt: 'Kunde 1' },
                        { src: '/assets/logos/client-2.svg', alt: 'Kunde 2' },
                    ],
                },
                {
                    type: 'feature-grid',
                    variant: 'cards',
                    title: 'Unsere Leistungen',
                    subtitle: 'Was wir für Sie tun können',
                    columns: 3,
                    features: [
                        {
                            icon: 'Zap',
                            title: 'Schnell',
                            description: 'Blitzschnelle Umsetzung Ihrer Projekte',
                        },
                        {
                            icon: 'Shield',
                            title: 'Sicher',
                            description: 'Höchste Sicherheitsstandards',
                        },
                        {
                            icon: 'Heart',
                            title: 'Persönlich',
                            description: 'Individuelle Betreuung',
                        },
                    ],
                },
                {
                    type: 'testimonials',
                    variant: 'carousel',
                    title: 'Das sagen unsere Kunden',
                    testimonials: [
                        {
                            quote: 'Fantastische Zusammenarbeit!',
                            author: 'Max Mustermann',
                            role: 'CEO',
                            company: 'Musterfirma GmbH',
                            rating: 5,
                        },
                    ],
                },
                {
                    type: 'cta',
                    variant: 'gradient',
                    headline: 'Bereit durchzustarten?',
                    description: 'Kontaktieren Sie uns noch heute',
                    button: { text: 'Kontakt aufnehmen', href: '/contact' },
                },
            ],
        },
        about: {
            seo: { title: 'Über uns', description: 'Erfahren Sie mehr über unser Team' },
            blocks: [
                {
                    type: 'hero',
                    variant: 'split',
                    headline: 'Über uns',
                    subheadline: 'Lernen Sie unser Team kennen',
                },
                {
                    type: 'team',
                    variant: 'grid',
                    title: 'Unser Team',
                    subtitle: 'Die Menschen hinter dem Erfolg',
                    members: [
                        {
                            name: 'Max Mustermann',
                            role: 'Gründer & CEO',
                            image: '/assets/images/team-1.jpg',
                            bio: 'Mit über 10 Jahren Erfahrung...',
                        },
                    ],
                },
            ],
        },
        services: {
            seo: { title: 'Leistungen', description: 'Unsere Dienstleistungen im Überblick' },
            blocks: [
                {
                    type: 'hero',
                    variant: 'centered',
                    headline: 'Unsere Leistungen',
                    subheadline: 'Maßgeschneiderte Lösungen für Ihr Unternehmen',
                },
                {
                    type: 'feature-grid',
                    variant: 'bento',
                    title: 'Was wir bieten',
                    columns: 3,
                    features: [
                        { icon: 'Code', title: 'Webentwicklung', description: 'Moderne Webanwendungen' },
                        { icon: 'Palette', title: 'Design', description: 'UI/UX Design' },
                        { icon: 'Server', title: 'Hosting', description: 'Zuverlässiges Hosting' },
                    ],
                },
            ],
        },
        contact: {
            seo: { title: 'Kontakt', description: 'Nehmen Sie Kontakt mit uns auf' },
            blocks: [
                {
                    type: 'hero',
                    variant: 'centered',
                    headline: 'Kontakt',
                    subheadline: 'Wir freuen uns auf Ihre Nachricht',
                },
                {
                    type: 'contact-form',
                    variant: 'with-info',
                    title: 'Schreiben Sie uns',
                    subtitle: 'Wir melden uns innerhalb von 24 Stunden',
                    fields: [
                        { name: 'name', label: 'Name', type: 'text', required: true },
                        { name: 'email', label: 'E-Mail', type: 'email', required: true },
                        { name: 'phone', label: 'Telefon', type: 'tel' },
                        { name: 'message', label: 'Nachricht', type: 'textarea', required: true },
                    ],
                    submitText: 'Nachricht senden',
                    successMessage: 'Vielen Dank! Wir melden uns bald.',
                },
            ],
        },
        faq: {
            seo: { title: 'FAQ', description: 'Häufig gestellte Fragen' },
            blocks: [
                {
                    type: 'hero',
                    variant: 'centered',
                    headline: 'Häufig gestellte Fragen',
                    subheadline: 'Hier finden Sie Antworten',
                },
                {
                    type: 'faq',
                    variant: 'accordion',
                    title: 'FAQ',
                    items: [
                        { question: 'Wie lange dauert ein Projekt?', answer: 'Die Projektdauer variiert...' },
                        { question: 'Was kostet eine Website?', answer: 'Die Kosten hängen vom Umfang ab...' },
                    ],
                },
            ],
        },
        blog: {
            seo: { title: 'Blog', description: 'Neuigkeiten und Artikel' },
            blocks: [
                {
                    type: 'hero',
                    variant: 'centered',
                    headline: 'Blog',
                    subheadline: 'Neuigkeiten und Einblicke',
                },
            ],
        },
        jobs: {
            seo: { title: 'Jobs', description: 'Aktuelle Stellenangebote' },
            blocks: [
                {
                    type: 'hero',
                    variant: 'centered',
                    headline: 'Jobs',
                    subheadline: 'Werden Sie Teil unseres Teams',
                },
                {
                    type: 'jobs-list',
                    title: 'Offene Stellen',
                    subtitle: 'Aktuelle Möglichkeiten im Überblick',
                    showFilters: false,
                },
            ],
        },
    },

    legal: {
        company: {
            name: 'Firmenname GmbH',
            legalForm: 'GmbH',
            registerNumber: 'HRB 12345',
            registerCourt: 'Amtsgericht Berlin-Charlottenburg',
            vatId: 'DE123456789',
            managingDirector: 'Max Mustermann',
        },
        privacyPolicy: [
            {
                heading: '1. Verantwortlicher',
                content: '[HIER EINFÜGEN: Name und Kontakt des Verantwortlichen]',
            },
            {
                heading: '2. Erhobene Daten',
                content: '[HIER EINFÜGEN: Welche Daten werden erhoben]',
            },
        ],
        imprint: [
            {
                heading: 'Angaben gemäß § 5 TMG',
                content: '[HIER EINFÜGEN: Impressumspflichtangaben]',
            },
        ],
        terms: [
            {
                heading: '§ 1 Geltungsbereich',
                content: '[HIER EINFÜGEN: AGB-Text]',
            },
        ],
        cookieConsent: {
            enabled: true,
            title: 'Diese Website verwendet Cookies',
            description: 'Wir nutzen Cookies, um Ihnen die bestmögliche Erfahrung zu bieten.',
            categories: {
                necessary: true,
                analytics: true,
                marketing: false,
            },
            privacyLink: '/privacy',
        },
    },

    seo: {
        titleTemplate: '%s | Firmenname',
        defaultTitle: 'Firmenname - Ihr Partner für...',
        defaultDescription: 'Kurze SEO-Beschreibung der Website',
        defaultImage: '/assets/images/og-default.jpg',
        twitterHandle: '@firmenname',
        jsonLd: {
            organization: true,
            website: true,
            localBusiness: {
                type: 'ProfessionalService',
                priceRange: '€€',
            },
        },
    },

    social: {
        links: [
            { platform: 'facebook', url: 'https://facebook.com/firmenname' },
            { platform: 'instagram', url: 'https://instagram.com/firmenname' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/firmenname' },
        ],
    },

    api: {
        baseUrl: 'http://localhost/api',
        endpoints: {
            blog: '/posts',
            jobs: '/jobs',
            contact: '/contact',
        },
    },

    features: {
        blog: true,
        jobs: true,
        team: true,
        contactSlots: false,
        analytics: true,
    },
};
