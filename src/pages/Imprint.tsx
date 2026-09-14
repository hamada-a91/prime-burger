import { LegalPageTemplate } from '@/components/legal';
import { SEOHead } from '@/components/seo';
import { useLegalConfig } from '@/hooks';

export function Imprint() {
    const legal = useLegalConfig();

    return (
        <>
            <SEOHead
                title="Impressum"
                description="Impressum"
                noIndex={false}
            />
            <LegalPageTemplate
                title="Impressum"
                sections={legal.imprint}
                lastUpdated="2024-01-01"
            />
        </>
    );
}
