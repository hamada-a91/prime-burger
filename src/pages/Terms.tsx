import { LegalPageTemplate } from '@/components/legal';
import { SEOHead } from '@/components/seo';
import { useLegalConfig } from '@/hooks';

export function Terms() {
    const legal = useLegalConfig();

    return (
        <>
            <SEOHead
                title="AGB"
                description="Allgemeine Geschäftsbedingungen"
                noIndex={false}
            />
            <LegalPageTemplate
                title="Allgemeine Geschäftsbedingungen"
                sections={legal.terms}
                lastUpdated="2024-01-01"
            />
        </>
    );
}
