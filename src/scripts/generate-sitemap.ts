import { writeFileSync } from 'node:fs';
import { websiteConfig } from '../config/website.config';
import { LOCALES, ROUTE_SLUGS, localePath, type RouteKey } from '../i18n/routes';

const base = websiteConfig.site.url.replace(/\/+$/, '');
const indexable = (Object.keys(ROUTE_SLUGS) as RouteKey[]).filter((key) => !['privacy', 'imprint'].includes(key));
const today = new Date().toISOString().slice(0, 10);

const urls = indexable.flatMap((key) =>
    LOCALES.map((locale) => {
        const alternates = LOCALES.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${base}${localePath(alt, key)}" />`).join('\n');
        return `  <url>\n    <loc>${base}${localePath(locale, key)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${key === 'home' ? '1.0' : '0.8'}</priority>\n${alternates}\n  </url>`;
    })
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
writeFileSync('public/sitemap.xml', xml);
console.log(`sitemap.xml: ${urls.length} URLs`);
