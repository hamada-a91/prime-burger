import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    noIndex?: boolean;
    article?: {
        publishedTime?: string;
        modifiedTime?: string;
        author?: string;
        tags?: string[];
    };
}

export function SEOHead({
    title,
    description,
    canonical,
    ogImage,
    ogType = 'website',
    noIndex = false,
    article,
}: SEOHeadProps) {
    const siteName = 'Landing Page Template'; // Should be from config later
    const fullTitle = `${title} | ${siteName}`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonical && <link rel="canonical" href={canonical} />}
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            {canonical && <meta property="og:url" content={canonical} />}
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}

            {/* Article specific tags */}
            {ogType === 'article' && article && (
                <>
                    {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
                    {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
                    {article.author && <meta property="article:author" content={article.author} />}
                    {article.tags?.map((tag) => (
                        <meta key={tag} property="article:tag" content={tag} />
                    ))}
                </>
            )}
        </Helmet>
    );
}
