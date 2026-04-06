import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { canonicalPath, CANONICAL_ORIGIN } from './canonical-url.mjs';

const root = new URL('..', import.meta.url).pathname;
const siteUrl = CANONICAL_ORIGIN;

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
      const modelPathCanonical = canonicalPath(match[1]);
      const status = match[2];
      const noindex = match[3] === 'true';
      rules.set(modelPathCanonical, { indexable: status === 'published' && !noindex });
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

function readCanonicalPath(html) {
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  if (!canonicalMatch) return null;
  try {
    const parsed = new URL(canonicalMatch[1].trim());
    if (parsed.origin !== siteUrl) return null;
    return canonicalPath(parsed.pathname);
  } catch {
    return null;
  }
}

function hasNoindex(html) {
  const robots = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  return robots ? robots[1].toLowerCase().includes('noindex') : false;
}

function getLastModifiedDate(filePath) {
  const relPath = relative(root, filePath).replace(/\\/g, '/');
  try {
    const gitDate = execFileSync('git', ['log', '-1', '--format=%cs', '--', relPath], { cwd: root, encoding: 'utf8' }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(gitDate)) return gitDate;
  } catch {}
  return statSync(filePath).mtime.toISOString().split('T')[0];
}

const contentModelRules = readContentModelIndexability();
const entries = [];
const seen = new Set();

for (const filePath of walkHtml(root)) {
  const html = readFileSync(filePath, 'utf8');
  const route = readCanonicalPath(html);
  if (!route || hasNoindex(html)) continue;
  if (route.includes('?') || route.includes('#')) continue;
  if (contentModelRules.has(route) && !contentModelRules.get(route).indexable) continue;
  if (seen.has(route)) continue;

  entries.push({ route, lastmod: getLastModifiedDate(filePath) });
  seen.add(route);
}

for (const route of EXTRA_ROUTES) {
  if (seen.has(route)) continue;
  const filePath = join(root, route.replace(/^\//, ''));
  try {
    entries.push({ route, lastmod: getLastModifiedDate(filePath) });
    seen.add(route);
  } catch {}
}

entries.sort((a, b) => a.route.localeCompare(b.route));

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
  .map((entry) => `  <url>\n    <loc>${siteUrl}${entry.route}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n  </url>`)
  .join('\n')}\n</urlset>\n`;

writeFileSync(join(root, 'sitemap.xml'), xml);

const robotsPath = join(root, 'robots.txt');
const robots = readFileSync(robotsPath, 'utf8');
const sitemapLine = `Sitemap: ${siteUrl}/sitemap.xml`;
const updatedRobots = robots.match(/^Sitemap:/m)
  ? robots.replace(/^Sitemap:.*$/m, sitemapLine)
  : `${robots.trim()}\n\n${sitemapLine}\n`;
writeFileSync(robotsPath, `${updatedRobots.replace(/\n{3,}/g, '\n\n').trim()}\n`);

console.log('Updated sitemap.xml with', entries.length, 'routes');
console.log('Canonical site URL:', siteUrl);
