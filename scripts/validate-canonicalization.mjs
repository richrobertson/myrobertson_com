import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  canonicalArticlePath,
  getAssetPathForCanonicalPath,
  getKnownCanonicalPaths,
  getLegacyRedirectTarget,
  isRetiredWritingArchivePath
} from '../content/article-routing.mjs';
import { canonicalPath, CANONICAL_ORIGIN } from './canonical-url.mjs';

const root = new URL('..', import.meta.url).pathname;

const REQUIRED_WRITING_ALIASES = new Map([
  ['/writing/backpressure-in-distributed-systems', '/blog/backpressure-stability-correctness-distributed-systems'],
  ['/writing/architecting-a-multitenant-control-plane', '/blog/architecting-a-multitenant-control-plane-for-a-next-generation-data-tier'],
  ['/writing/designing-a-correct-distributed-lease-service-tenure-on-raft', '/blog/designing-a-correct-distributed-lease-service-tenure-on-raft'],
  ['/writing/end-to-end-overload-control-in-distributed-systems', '/blog/end-to-end-overload-control-in-distributed-systems'],
  ['/writing/admission-control-in-distributed-systems', '/blog/admission-control-in-distributed-systems'],
  ['/writing/rate-limiting-in-distributed-systems', '/blog/rate-limiting-in-distributed-systems'],
  ['/writing/circuit-breakers-in-distributed-systems', '/blog/circuit-breakers-in-distributed-systems'],
  ['/writing/graceful-degradation-in-distributed-systems', '/blog/graceful-degradation-in-distributed-systems'],
  ['/writing/load-shedding-in-distributed-systems', '/blog/load-shedding-in-distributed-systems'],
  ['/writing/retry-strategies-and-idempotency', '/blog/retry-strategies-and-idempotency'],
  ['/writing/queue-design-under-load', '/blog/queue-design-under-load'],
  ['/writing/state-management-in-distributed-control-systems', '/blog/state-management-in-distributed-control-systems'],
  ['/writing/why-systems-fail-under-load-not-just-bugs', '/blog/why-systems-fail-under-load-not-just-bugs']
]);

const MACHINE_READABLE_CANONICAL_URLS = new Set([
  `${CANONICAL_ORIGIN}/knowledge.json`,
  `${CANONICAL_ORIGIN}/llms.txt`,
  `${CANONICAL_ORIGIN}/sitemap.xml`,
  `${CANONICAL_ORIGIN}/rss.xml`,
  `${CANONICAL_ORIGIN}/robots.txt`
]);

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

function extractUrlsFromText(text) {
  return [...text.matchAll(/https:\/\/www\.myrobertson\.com[^\s"'<)]+/g)].map((m) => m[0]);
}

function getCanonicalInventoryFromHtml(errors) {
  const canonicalUrls = new Set();

  for (const file of walkHtml(root)) {
    const html = readFileSync(file, 'utf8');
    const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
    if (!canonical) continue;

    const relPath = relative(root, file);
    const noindex = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i)?.[1]?.toLowerCase().includes('noindex');
    if (noindex) continue;

    const og = html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i)?.[1];
    if (!og) {
      errors.push(`${relPath}: missing og:url`);
      continue;
    }

    if (canonical !== og) errors.push(`${relPath}: canonical and og:url mismatch`);

    try {
      const url = new URL(canonical);
      const expected = `${CANONICAL_ORIGIN}${canonicalPath(url.pathname)}`;
      if (canonical !== expected) {
        errors.push(`${relPath}: non-canonical canonical URL ${canonical}`);
      }

      if (url.protocol !== 'https:' || url.hostname !== 'www.myrobertson.com') {
        errors.push(`${relPath}: canonical URL must use https://www.myrobertson.com (${canonical})`);
      }

      if (url.pathname.startsWith('/blog/') && url.pathname.endsWith('.html')) {
        errors.push(`${relPath}: canonical blog URL must be extensionless (${canonical})`);
      }

      canonicalUrls.add(canonical);
    } catch {
      errors.push(`${relPath}: invalid canonical URL`);
    }
  }

  return canonicalUrls;
}

function validateRetiredWritingArchive(errors) {
  for (const route of ['/writing', '/writing/', '/writing/index.html']) {
    if (!isRetiredWritingArchivePath(route)) {
      errors.push(`retired writing archive classification missing for ${route}`);
    }
  }
}

function validateLegacyAliasCoverage(errors) {
  for (const [legacy, expectedCanonical] of REQUIRED_WRITING_ALIASES.entries()) {
    const variants = [legacy, `${legacy}/`, `${legacy}/index.html`];

    for (const variant of variants) {
      const target = getLegacyRedirectTarget(variant);
      if (target !== expectedCanonical) {
        errors.push(`legacy alias ${variant} maps to ${target ?? 'null'} (expected ${expectedCanonical})`);
      }
    }
  }
}

function validateCanonicalInventoryMembership(name, urls, inventory, errors) {
  const seen = new Set();

  for (const url of urls) {
    if (seen.has(url)) errors.push(`${name}: duplicate URL ${url}`);
    seen.add(url);

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      errors.push(`${name}: invalid URL ${url}`);
      continue;
    }

    const expected = `${CANONICAL_ORIGIN}${canonicalPath(parsed.pathname)}`;
    if (url !== expected) errors.push(`${name}: non-canonical URL ${url}`);
    if (!inventory.has(url)) errors.push(`${name}: URL is outside canonical inventory ${url}`);
  }
}

function validateMachineReadableSurfaces(inventory, errors) {
  const inventoryWithMachineReadable = new Set([...inventory, ...MACHINE_READABLE_CANONICAL_URLS]);
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  validateCanonicalInventoryMembership('sitemap.xml', sitemapUrls, inventoryWithMachineReadable, errors);

  const knowledge = readFileSync(join(root, 'knowledge.json'), 'utf8');
  const knowledgeUrls = extractUrlsFromText(knowledge);
  validateCanonicalInventoryMembership('knowledge.json', knowledgeUrls, inventoryWithMachineReadable, errors);

  const llms = readFileSync(join(root, 'llms.txt'), 'utf8');
  const llmsUrls = extractUrlsFromText(llms);
  // llms.txt is intentionally curated and may duplicate key URLs.
  validateCanonicalInventoryMembership('llms.txt', [...new Set(llmsUrls)], inventoryWithMachineReadable, errors);
}

function validateAssetResolution(errors) {
  const canonicalPaths = [...getKnownCanonicalPaths()];
  const assetToCanonical = new Map();

  for (const canonical of canonicalPaths) {
    const asset = getAssetPathForCanonicalPath(canonical);
    if (!asset) {
      errors.push(`missing asset mapping for canonical article path ${canonical}`);
      continue;
    }

    const filePath = join(root, asset.replace(/^\//, ''));
    if (!existsSync(filePath)) {
      errors.push(`asset path does not exist for ${canonical}: ${asset}`);
    }

    if (!assetToCanonical.has(asset)) assetToCanonical.set(asset, new Set());
    assetToCanonical.get(asset).add(canonical);
  }

  for (const [asset, canonicalSet] of assetToCanonical.entries()) {
    if (canonicalSet.size > 1) {
      errors.push(`ambiguous asset mapping: ${asset} is shared by ${[...canonicalSet].join(', ')}`);
    }
  }

  for (const [legacy, canonical] of REQUIRED_WRITING_ALIASES.entries()) {
    const fromCanonicalArticle = canonicalArticlePath(legacy);
    if (fromCanonicalArticle !== canonical) {
      errors.push(`canonicalArticlePath mismatch for ${legacy}: ${fromCanonicalArticle ?? 'null'} (expected ${canonical})`);
    }
  }
}

const errors = [];
validateRetiredWritingArchive(errors);
validateLegacyAliasCoverage(errors);
const canonicalInventory = getCanonicalInventoryFromHtml(errors);
validateMachineReadableSurfaces(canonicalInventory, errors);
validateAssetResolution(errors);

if (errors.length) {
  console.error(`Canonicalization validation failed (${errors.length} issues):`);
  fail(errors);
}

console.log('Canonicalization validation passed.');
