import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ARTICLE_ROUTE_MAP } from '../content/article-routing.mjs';

const root = new URL('..', import.meta.url).pathname;
const config = JSON.parse(readFileSync(join(root, 'seo.config.json'), 'utf8'));
const siteUrl = (process.env.SITE_URL || config.siteUrl).replace(/\/$/, '');

const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'static']);
const EXCLUDED_FILES = new Set(['404.html']);

const EXTRA_ROUTES = ['/knowledge.json', '/llms.txt'];

function readContentModelIndexability() {
  const modelPath = join(root, 'content', 'content-model.js');
  try {
    const source = readFileSync(modelPath, 'utf8');
    const rules = new Map();
    const pattern = /\{[^{}]*canonicalPath:\s*'([^']+)'[^{}]*status:\s*'([^']+)'[^{}]*noindex:\s*(true|false)[^{}]*\}/g;
    for (const match of source.matchAll(pattern)) {
      const canonicalPath = match[1];
      const status = match[2];
      const noindex = match[3] === 'true';
      rules.set(canonicalPath, {
        status,
        noindex,
        indexable: status === 'published' && !noindex
      });
    }
    return rules;
  } catch {
    return new Map();
  }
}

function walkHtml(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) files.push(...walkHtml(join(dir, entry.name)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html') && !EXCLUDED_FILES.has(entry.name)) {
      files.push(join(dir, entry.name));
    }
  }
  return files;
}

function toRoute(filePath) {
  const rel = relative(root, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

function readCanonicalPath(html) {
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  if (!canonicalMatch) return null;
  const href = canonicalMatch[1].trim();
  if (!href.startsWith(siteUrl)) return null;
  const path = href.slice(siteUrl.length) || '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function hasNoindex(html) {
  const robots = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (!robots) return false;
  return robots[1].toLowerCase().includes('noindex');
}

function isEligible({ route, canonicalPath, noindex, contentModelRules }) {
  if (noindex) return false;
  if (!canonicalPath) return false;
  if (canonicalPath !== route) return false;

  // Exclude utility/filter-like URLs or alternate index endpoints.
  if (route.includes('?') || route.includes('#')) return false;
  if (route === '/blog/index.html') return false;

  // Central source-of-truth override from content model when present.
  if (contentModelRules.has(route)) {
    const rule = contentModelRules.get(route);
    if (!rule.indexable) return false;
  }

  return true;
}

function getLastModifiedDate(filePath) {
  const relPath = relative(root, filePath).replace(/\\/g, '/');
  try {
    const gitDate = execFileSync('git', ['log', '-1', '--format=%cs', '--', relPath], {
      cwd: root,
      encoding: 'utf8'
    }).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(gitDate)) {
      return gitDate;
    }
  } catch {
    // Fall back to file mtime when git metadata is unavailable.
  }

  return statSync(filePath).mtime.toISOString().split('T')[0];
}

function assetPathToFilePath(assetPath) {
  const relativePath = assetPath.replace(/^\//, '');
  if (assetPath.endsWith('.html')) {
    return join(root, relativePath);
  }
  return join(root, relativePath, 'index.html');
}

const htmlFiles = walkHtml(root);
const entries = [];
const seen = new Set();
const contentModelRules = readContentModelIndexability();

for (const filePath of htmlFiles) {
  const html = readFileSync(filePath, 'utf8');
  const route = toRoute(filePath);
  const canonicalPath = readCanonicalPath(html);
  const noindex = hasNoindex(html);

  if (!isEligible({ route, canonicalPath, noindex, contentModelRules })) continue;
  if (seen.has(route)) continue;

  const lastmod = getLastModifiedDate(filePath);
  entries.push({ route, lastmod });
  seen.add(route);
}

for (const route of ARTICLE_ROUTE_MAP) {
  if (seen.has(route.publicPath)) continue;
  const filePath = assetPathToFilePath(route.assetPath);
  const lastmod = getLastModifiedDate(filePath);
  entries.push({ route: route.publicPath, lastmod });
  seen.add(route.publicPath);
}


for (const route of EXTRA_ROUTES) {
  if (seen.has(route)) continue;
  const filePath = join(root, route.replace(/^\//, ''));
  try {
    const lastmod = getLastModifiedDate(filePath);
    entries.push({ route, lastmod });
    seen.add(route);
  } catch {
    // Skip missing optional endpoints.
  }
}

entries.sort((a, b) => a.route.localeCompare(b.route));

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
  .map((entry) => `  <url>\n    <loc>${siteUrl}${entry.route}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n  </url>`)
  .join('\n')}\n</urlset>\n`;

writeFileSync(join(root, 'sitemap.xml'), xml);

// Keep robots.txt aligned with sitemap canonical origin.
const robotsPath = join(root, 'robots.txt');
const robots = readFileSync(robotsPath, 'utf8');
const sitemapLine = `Sitemap: ${siteUrl}/sitemap.xml`;
const updatedRobots = robots.match(/^Sitemap:/m)
  ? robots.replace(/^Sitemap:.*$/m, sitemapLine)
  : `${robots.trim()}\n\n${sitemapLine}\n`;
writeFileSync(robotsPath, `${updatedRobots.replace(/\n{3,}/g, '\n\n').trim()}\n`);

console.log('Updated sitemap.xml with', entries.length, 'routes');
console.log('Canonical site URL:', siteUrl);
