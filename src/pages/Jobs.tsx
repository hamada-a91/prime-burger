import { useConfig, useSiteConfig } from '@/hooks';
import { SEOHead } from '@/components/seo';
import { BlockRenderer } from '@/components/blocks';

export function Jobs() {
    const config = useConfig();
    const site = useSiteConfig();
    const page = config.pages.jobs;

    if (!page) return null;

    return (
        <>
            <SEOHead
                title={page.seo.title}
                description={page.seo.description}
                canonical={`${site.url}/jobs`}
                ogImage={page.seo.ogImage}
            />
            <BlockRenderer blocks={page.blocks} />
        </>
    );
}
