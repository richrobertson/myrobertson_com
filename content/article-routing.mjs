const SITE_ORIGIN = 'https://www.myrobertson.com';

const WRITING_LEGACY_TO_CANONICAL = new Map([
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
  ['/writing/why-systems-fail-under-load-not-just-bugs', '/blog/why-systems-fail-under-load-not-just-bugs']
]);

const CANONICAL_TO_ASSET = new Map([
  ['/blog/end-to-end-overload-control-in-distributed-systems', '/writing/end-to-end-overload-control-in-distributed-systems/index.html'],
  ['/blog/admission-control-in-distributed-systems', '/writing/admission-control-in-distributed-systems/index.html'],
  ['/blog/rate-limiting-in-distributed-systems', '/writing/rate-limiting-in-distributed-systems/index.html'],
  ['/blog/circuit-breakers-in-distributed-systems', '/writing/circuit-breakers-in-distributed-systems/index.html'],
  ['/blog/graceful-degradation-in-distributed-systems', '/writing/graceful-degradation-in-distributed-systems/index.html'],
  ['/blog/load-shedding-in-distributed-systems', '/writing/load-shedding-in-distributed-systems/index.html'],
  ['/blog/retry-strategies-and-idempotency', '/writing/retry-strategies-and-idempotency/index.html'],
  ['/blog/queue-design-under-load', '/writing/queue-design-under-load/index.html'],
  ['/blog/why-systems-fail-under-load-not-just-bugs', '/writing/why-systems-fail-under-load-not-just-bugs/index.html']
]);

function stripTrailingSlash(path) {
  if (!path || path === '/') return '/';
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

function stripIndexHtml(path) {
  return path.endsWith('/index.html') ? path.slice(0, -'index.html'.length) : path;
}

function stripHtmlExtension(path) {
  return path.endsWith('.html') ? path.slice(0, -'.html'.length) : path;
}

export function normalizePath(input) {
  if (!input) return '/';
  const path = input.startsWith('http://') || input.startsWith('https://')
    ? new URL(input).pathname
    : input;
  return stripTrailingSlash(stripIndexHtml(path)) || '/';
}

function canonicalizeBlogPath(path) {
  if (!path.startsWith('/blog/') || path === '/blog') return null;
  return stripHtmlExtension(path);
}

export function canonicalArticlePath(pathOrUrl) {
  const normalized = normalizePath(pathOrUrl);

  if (WRITING_LEGACY_TO_CANONICAL.has(normalized)) {
    return WRITING_LEGACY_TO_CANONICAL.get(normalized);
  }

  const blogCanonical = canonicalizeBlogPath(normalized);
  if (blogCanonical) return blogCanonical;

  return null;
}

export function canonicalArticleUrl(pathOrUrl, siteOrigin = SITE_ORIGIN) {
  const canonicalPath = canonicalArticlePath(pathOrUrl);
  return canonicalPath ? `${siteOrigin}${canonicalPath}` : null;
}

export function isCanonicalArticlePath(pathOrUrl) {
  const normalized = normalizePath(pathOrUrl);
  return Boolean(canonicalizeBlogPath(normalized)) && !normalized.endsWith('.html');
}

export function getAssetPathForCanonicalPath(pathOrUrl) {
  const normalized = normalizePath(pathOrUrl);
  if (CANONICAL_TO_ASSET.has(normalized)) return CANONICAL_TO_ASSET.get(normalized);
  if (normalized.startsWith('/blog/') && normalized !== '/blog') return `${normalized}.html`;
  return null;
}

export const LEGACY_TO_PUBLIC = new Map(
  [...WRITING_LEGACY_TO_CANONICAL.entries()].flatMap(([legacy, canonical]) => [
    [legacy, canonical],
    [`${legacy}/index.html`, canonical],
    [`${legacy}/`, canonical]
  ])
);

export const WRITING_CANONICAL_ASSET_ROUTES = [...CANONICAL_TO_ASSET.entries()].map(([publicPath, assetPath]) => ({ publicPath, assetPath }));
