import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate';
import { SEOHead } from '@/components/seo';
import { useLegalConfig } from '@/hooks';
import { useLocale, useT } from '@/i18n';

export function Privacy() {
    const legal = useLegalConfig();
    const locale = useLocale();
    const t = useT();

    return (
        <>
            <SEOHead title={t('legal.privacyTitle')} description={t('legal.privacyTitle')} routeKey="privacy" noIndex />
            <LegalPageTemplate title={t('legal.privacyTitle')} sections={legal.privacy[locale]} lastUpdated={legal.lastUpdated} />
        </>
    );
}
