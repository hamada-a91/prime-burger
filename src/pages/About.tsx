import { SEOHead } from '@/components/seo';
import { BlockRenderer } from '@/components/blocks';
import { usePageConfig, useSiteConfig } from '@/hooks';

export function About() {
    const page = usePageConfig('about');
    const site = useSiteConfig();

    return (
        <>
            <SEOHead
                title={page.seo.title}
                description={page.seo.description}
                canonical={`${site.url}/about`}
                ogImage={page.seo.ogImage}
            />
            <BlockRenderer blocks={page.blocks} />
        </>
    );
}
