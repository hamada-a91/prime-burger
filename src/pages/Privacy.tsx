import { LegalPageTemplate } from '@/components/legal';
import { SEOHead } from '@/components/seo';
import { useLegalConfig } from '@/hooks';

export function Privacy() {
    const legal = useLegalConfig();

    return (
        <>
            <SEOHead
                title="Datenschutzerklärung"
                description="Datenschutzerklärung"
                noIndex={false}
            />
            <LegalPageTemplate
                title="Datenschutzerklärung"
                sections={legal.privacyPolicy}
                lastUpdated="2024-01-01"
            />
        </>
    );
}
