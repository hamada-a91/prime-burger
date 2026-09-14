import { SEOHead } from '@/components/seo';
import { BlockRenderer } from '@/components/blocks';
import { usePageConfig, useSiteConfig } from '@/hooks';

export function FAQ() {
    const page = usePageConfig('faq');
    const site = useSiteConfig();

    return (
        <>
            <SEOHead
                title={page.seo.title}
                description={page.seo.description}
                canonical={`${site.url}/faq`}
                ogImage={page.seo.ogImage}
            />
            <BlockRenderer blocks={page.blocks} />
        </>
    );
}
