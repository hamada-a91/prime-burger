import { BlockRenderer } from '@/components/blocks';
import { SEOHead } from '@/components/seo';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import type { ContentBlock } from '@/config/website.config.schema';

// Demo blocks for component showcase
const demoBlocks: ContentBlock[] = [
    {
        type: 'hero',
        variant: 'centered',
        headline: 'Hero Section - Centered',
        subheadline: 'Eine zentrierte Hero-Variante mit Hintergrundbild und Call-to-Action Buttons.',
        badge: 'Beispiel',
        cta: {
            primary: { text: 'Primärer Button', href: '#' },
            secondary: { text: 'Sekundärer Button', href: '#' },
        },
    },
    {
        type: 'feature-grid',
        variant: 'cards',
        title: 'Feature Grid - Cards',
        subtitle: 'Zeigt Features in einem Karten-Layout an',
        columns: 3,
        features: [
            { icon: 'Zap', title: 'Schnell', description: 'Blitzschnelle Performance für optimale Nutzererfahrung.' },
            { icon: 'Shield', title: 'Sicher', description: 'Enterprise-grade Sicherheit für Ihre Daten.' },
            { icon: 'Heart', title: 'Persönlich', description: 'Individuelle Anpassung an Ihre Bedürfnisse.' },
        ],
    },
    {
        type: 'testimonials',
        variant: 'carousel',
        title: 'Testimonials - Carousel',
        testimonials: [
            {
                quote: 'Fantastische Zusammenarbeit! Das Team hat unsere Erwartungen übertroffen.',
                author: 'Max Mustermann',
                role: 'CEO',
                company: 'Musterfirma GmbH',
                rating: 5,
            },
            {
                quote: 'Professionelle Umsetzung und erstklassiger Support.',
                author: 'Anna Schmidt',
                role: 'Marketingleiterin',
                company: 'Beispiel AG',
                rating: 5,
            },
        ],
    },
    {
        type: 'faq',
        variant: 'accordion',
        title: 'FAQ - Accordion',
        subtitle: 'Häufig gestellte Fragen',
        items: [
            { question: 'Wie funktioniert das Block-System?', answer: 'Blöcke werden in der website.config.ts definiert und automatisch vom BlockRenderer gerendert.' },
            { question: 'Kann ich eigene Blöcke erstellen?', answer: 'Ja! Erstellen Sie eine Komponente in src/components/blocks und registrieren Sie diese im BlockRenderer.' },
            { question: 'Ist das Template mehrsprachig?', answer: 'Die Struktur für i18n ist vorbereitet, die Implementierung erfolgt nach Bedarf.' },
        ],
    },
    {
        type: 'cta',
        variant: 'gradient',
        headline: 'CTA Block - Gradient',
        description: 'Ein Call-to-Action Block mit Gradientenhintergrund.',
        button: { text: 'Jetzt starten', href: '/contact' },
    },
    {
        type: 'pricing',
        variant: 'cards',
        title: 'Pricing - Cards',
        subtitle: 'Wählen Sie den passenden Plan',
        plans: [
            {
                name: 'Starter',
                description: 'Für kleine Projekte',
                price: { monthly: '€29', yearly: '€290' },
                features: ['5 Projekte', 'Basic Support', '10GB Speicher'],
                cta: { text: 'Auswählen', href: '#' },
            },
            {
                name: 'Professional',
                description: 'Für wachsende Teams',
                price: { monthly: '€79', yearly: '€790' },
                features: ['Unbegrenzte Projekte', 'Priority Support', '100GB Speicher', 'API Zugang'],
                cta: { text: 'Auswählen', href: '#' },
                highlighted: true,
                badge: 'Beliebt',
            },
            {
                name: 'Enterprise',
                description: 'Für Unternehmen',
                price: { monthly: '€199', yearly: '€1990' },
                features: ['Alles aus Professional', 'Dedizierter Support', 'Unlimited Speicher', 'Custom Integrationen'],
                cta: { text: 'Kontaktieren', href: '#' },
            },
        ],
    },
    {
        type: 'team',
        variant: 'cards',
        title: 'Team Block - Cards',
        subtitle: 'Unser Team',
        members: [
            { name: 'Max Mustermann', role: 'CEO', image: '/placeholder-avatar.jpg', bio: 'Gründer mit 15 Jahren Erfahrung.' },
            { name: 'Anna Schmidt', role: 'CTO', image: '/placeholder-avatar.jpg', bio: 'Technische Leitung und Architektur.' },
            { name: 'Tom Weber', role: 'Design Lead', image: '/placeholder-avatar.jpg', bio: 'UI/UX und visuelle Gestaltung.' },
        ],
    },
    {
        type: 'contact-form',
        variant: 'with-info',
        title: 'Kontaktformular - With Info',
        subtitle: 'Wir freuen uns auf Ihre Nachricht',
        fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'E-Mail', type: 'email', required: true },
            { name: 'message', label: 'Nachricht', type: 'textarea', required: true },
        ],
        submitText: 'Absenden',
        successMessage: 'Vielen Dank für Ihre Nachricht!',
    },
];

export function Examples() {
    return (
        <>
            <SEOHead
                title="Komponenten-Beispiele"
                description="Übersicht aller verfügbaren Content-Blöcke"
            />

            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold mb-4">Komponenten-Übersicht</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Alle verfügbaren Content-Blöcke mit Beispieldaten.
                            Diese Seite dient als Referenz für Entwickler.
                        </p>
                    </div>
                </div>

                <div className="space-y-24">
                    {demoBlocks.map((block, i) => (
                        <section key={i} className="border-t border-border pt-12">
                            <div className="container mx-auto px-4 mb-8">
                                <ScrollReveal>
                                    <div className="flex items-center gap-4 mb-2">
                                        <code className="bg-muted px-3 py-1 rounded-md text-sm font-mono">
                                            {block.type}
                                        </code>
                                        <code className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-mono">
                                            {'variant' in block ? `variant: ${block.variant as string}` : ''}
                                        </code>
                                    </div>
                                </ScrollReveal>
                            </div>
                            <ScrollReveal delay={100}>
                                <BlockRenderer blocks={[block]} />
                            </ScrollReveal>
                        </section>
                    ))}
                </div>
            </div>
        </>
    );
}
