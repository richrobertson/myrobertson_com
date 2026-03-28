import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const config = JSON.parse(readFileSync(join(root, 'seo.config.json'), 'utf8'));
const today = new Date().toISOString().split('T')[0];

const routes = [
  '/',
  '/case-studies/',
  '/case-studies/oracle-cns-oci-migration/',
  '/case-studies/control-plane-workflow-platform/',
  '/case-studies/java-17-global-modernization/',
  '/case-studies/starbucks-loyalty-platform-integration/',
  '/writing/',
  '/writing/backpressure-in-distributed-systems/',
  '/writing/designing-a-correct-distributed-lease-service-tenure-on-raft/',
  '/writing/architecting-a-multitenant-control-plane/',
  '/blog/',
  '/distributed-systems-engineer.html',
  '/cloud-platform-engineer.html'
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .map((route) => `  <url>\n    <loc>${config.siteUrl}${route}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join('\n')}\n</urlset>\n`;

writeFileSync(join(root, 'sitemap.xml'), xml);
console.log('Updated sitemap.xml with', routes.length, 'routes');
