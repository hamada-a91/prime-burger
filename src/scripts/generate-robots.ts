import { writeFileSync } from 'node:fs';
import { websiteConfig } from '../config/website.config';

const base = websiteConfig.site.url.replace(/\/+$/, '');
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${base}/sitemap.xml\n`);
console.log('robots.txt written');
