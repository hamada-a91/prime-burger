import { useLocation } from 'react-router-dom';
import { useSiteConfig } from '@/hooks';
import { LOCALES, localePath, useLocale, type RouteKey } from '@/i18n';

interface SEOHeadProps {
    title: string;
    description: string;
    /** Route key used to build canonical + hreflang alternates. */
    routeKey?: RouteKey;
    ogImage?: string;
    noIndex?: boolean;
}

/**
 * React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree into <head>,
 * so no helmet library is needed.
 */
export function SEOHead({ title, description, routeKey, ogImage, noIndex = false }: SEOHeadProps) {
    const site = useSiteConfig();
    const locale = useLocale();
    const location = useLocation();
    const base = site.url.replace(/\/+$/, '');
    const fullTitle = `${title} | ${site.name}`;
    const canonical = `${base}${routeKey ? localePath(locale, routeKey) : location.pathname}`;
    const image = `${base}${ogImage ?? site.ogImage}`;

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            {routeKey && LOCALES.map((alt) => (
                <link key={alt} rel="alternate" hrefLang={alt} href={`${base}${localePath(alt, routeKey)}`} />
            ))}
            {routeKey && <link rel="alternate" hrefLang="x-default" href={`${base}${localePath('de', routeKey)}`} />}

            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={canonical} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={site.name} />
            <meta property="og:locale" content={locale === 'de' ? 'de_DE' : 'en_GB'} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </>
    );
}
