import { LegalPageTemplate } from '@/components/legal/LegalPageTemplate';
import { SEOHead } from '@/components/seo';
import { useLegalConfig } from '@/hooks';
import { useLocale, useT } from '@/i18n';

export function Imprint() {
    const legal = useLegalConfig();
    const locale = useLocale();
    const t = useT();

    return (
        <>
            <SEOHead title={t('legal.imprintTitle')} description={t('legal.imprintTitle')} routeKey="imprint" noIndex />
            <LegalPageTemplate title={t('legal.imprintTitle')} sections={legal.imprint[locale]} />
        </>
    );
}
