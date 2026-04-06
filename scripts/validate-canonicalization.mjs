import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { canonicalPath, CANONICAL_ORIGIN } from './canonical-url.mjs';

const root = new URL('..', import.meta.url).pathname;

function walkHtml(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'static') continue;
    const absolute = join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(absolute, files);
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
  return files;
}

function fail(messages) {
  for (const m of messages) console.error(`- ${m}`);
  process.exit(1);
}

function validateHtmlCanonicals(errors) {
  for (const file of walkHtml(root)) {
    const html = readFileSync(file, 'utf8');
    const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
    if (!canonical) continue;

    const noindex = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i)?.[1]?.toLowerCase().includes('noindex');
    if (noindex) continue;

    const og = html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i)?.[1];
    if (!og) {
      errors.push(`${file.replace(root, '')}: missing og:url`);
      continue;
    }

    if (canonical !== og) errors.push(`${file.replace(root, '')}: canonical and og:url mismatch`);
    try {
      const url = new URL(canonical);
      const expected = `${CANONICAL_ORIGIN}${canonicalPath(url.pathname)}`;
      if (canonical !== expected) errors.push(`${file.replace(root, '')}: non-canonical canonical URL ${canonical}`);
    } catch {
      errors.push(`${file.replace(root, '')}: invalid canonical URL`);
    }
  }
}

function extractUrlsFromText(text) {
  return [...text.matchAll(/https:\/\/www\.myrobertson\.com[^\s"'<)]+/g)].map((m) => m[0]);
}

function validateManifest(name, path, errors, { allowDuplicates = false } = {}) {
  const text = readFileSync(path, 'utf8');
  const urls = extractUrlsFromText(text);
  const seen = new Set();
  for (const url of urls) {
    if (!allowDuplicates && seen.has(url)) errors.push(`${name}: duplicate URL ${url}`);
    seen.add(url);
    const parsed = new URL(url);
    const expected = `${CANONICAL_ORIGIN}${canonicalPath(parsed.pathname)}`;
    if (url !== expected) errors.push(`${name}: non-canonical URL ${url}`);
  }
}

function validateSitemap(errors) {
  const text = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  const urls = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const seen = new Set();
  for (const url of urls) {
    if (seen.has(url)) errors.push(`sitemap.xml: duplicate URL ${url}`);
    seen.add(url);
    const parsed = new URL(url);
    const expected = `${CANONICAL_ORIGIN}${canonicalPath(parsed.pathname)}`;
    if (url !== expected) errors.push(`sitemap.xml: non-canonical URL ${url}`);
  }
}

const errors = [];
validateHtmlCanonicals(errors);
validateSitemap(errors);
validateManifest('llms.txt', join(root, 'llms.txt'), errors, { allowDuplicates: true });
validateManifest('knowledge.json', join(root, 'knowledge.json'), errors);

if (errors.length) {
  console.error(`Canonicalization validation failed (${errors.length} issues):`);
  fail(errors);
}

console.log('Canonicalization validation passed.');
