import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { websiteConfig } from '../config/website.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SitemapRoute {
    path: string;
    priority: number;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    lastmod?: string;
}

const SITE_URL = websiteConfig.site.url.replace(/\/$/, '');

const pagePriority: Record<string, Pick<SitemapRoute, 'priority' | 'changefreq'>> = {
    home: { priority: 1.0, changefreq: 'weekly' },
    about: { priority: 0.8, changefreq: 'monthly' },
    services: { priority: 0.8, changefreq: 'monthly' },
    contact: { priority: 0.7, changefreq: 'monthly' },
    faq: { priority: 0.6, changefreq: 'monthly' },
    blog: { priority: 0.9, changefreq: 'daily' },
    jobs: { priority: 0.8, changefreq: 'daily' },
};

const pagePaths: Record<string, string> = {
    home: '/',
    about: '/about',
    services: '/services',
    contact: '/contact',
    faq: '/faq',
    blog: '/blog',
    jobs: '/jobs',
};

const routes: SitemapRoute[] = Object.entries(websiteConfig.pages)
    .filter(([key]) => {
        if (key === 'blog') return websiteConfig.features.blog;
        if (key === 'jobs') return websiteConfig.features.jobs;
        return true;
    })
    .map(([key]) => ({
        path: pagePaths[key] ?? `/${key}`,
        ...(pagePriority[key] ?? { priority: 0.5, changefreq: 'monthly' as const }),
    }));

routes.push(
    { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
    { path: '/imprint', priority: 0.3, changefreq: 'yearly' },
    { path: '/terms', priority: 0.3, changefreq: 'yearly' },
);

function outputDir() {
    const distDir = path.resolve(__dirname, '../../dist');
    return fs.existsSync(distDir) ? distDir : path.resolve(__dirname, '../../public');
}

function generateSitemap() {
    const today = new Date().toISOString().split('T')[0];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
        .map((route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod || today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`)
        .join('\n')}
</urlset>`;

    const dir = outputDir();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemap);
    console.log(`Sitemap generated at ${path.relative(process.cwd(), path.join(dir, 'sitemap.xml'))}`);
}

generateSitemap();
