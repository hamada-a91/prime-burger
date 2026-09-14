import { SEOHead, OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo';
import { BlockRenderer } from '@/components/blocks';
import { usePageConfig, useSiteConfig } from '@/hooks';

export function Home() {
    const page = usePageConfig('home');
    const site = useSiteConfig();

    return (
        <>
            <SEOHead
                title={page.seo.title}
                description={page.seo.description}
                canonical={site.url}
                ogImage={page.seo.ogImage}
            />
            <OrganizationJsonLd />
            <WebSiteJsonLd />
            <BlockRenderer blocks={page.blocks} />
        </>
    );
}
