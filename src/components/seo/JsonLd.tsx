import { Helmet } from 'react-helmet-async';

interface JsonLdProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: Record<string, any>;
}

export function JsonLd({ schema }: JsonLdProps) {
    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}

// Convenience Components

export function OrganizationJsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Firmenname", // Should be from config
        "url": "https://example.com", // Should be from config
        "logo": "https://example.com/assets/logos/logo.svg", // Should be from config
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "kontakt@example.com", // Should be from config
            "telephone": "+49 123 456789" // Should be from config
        },
        // "sameAs": [] // Social links from config
    };

    return <JsonLd schema={schema} />;
}

export function WebSiteJsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Firmenname",
        "url": "https://example.com"
    };

    return <JsonLd schema={schema} />;
}

// Add other specific JsonLd components as needed based on specs
