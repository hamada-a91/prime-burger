import { SEOHead } from '@/components/seo';
import { BlockRenderer } from '@/components/blocks';
import { usePageConfig, useSiteConfig } from '@/hooks';

export function Contact() {
    const page = usePageConfig('contact');
    const site = useSiteConfig();

    return (
        <>
            <SEOHead
                title={page.seo.title}
                description={page.seo.description}
                canonical={`${site.url}/contact`}
                ogImage={page.seo.ogImage}
            />
            <BlockRenderer blocks={page.blocks} />
        </>
    );
}
