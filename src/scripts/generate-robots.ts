import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { websiteConfig } from '../config/website.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_URL = websiteConfig.site.url.replace(/\/$/, '');

function outputDir() {
    const distDir = path.resolve(__dirname, '../../dist');
    return fs.existsSync(distDir) ? distDir : path.resolve(__dirname, '../../public');
}

function generateRobots() {
    const content = `# robots.txt for ${SITE_URL}
User-agent: *
Allow: /

Disallow: /thank-you
Disallow: /api/
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;

    const dir = outputDir();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'robots.txt'), content);
    console.log(`robots.txt generated at ${path.relative(process.cwd(), path.join(dir, 'robots.txt'))}`);
}

generateRobots();
