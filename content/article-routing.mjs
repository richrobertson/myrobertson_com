const SITE_ORIGIN = 'https://www.myrobertson.com';

export const ARTICLE_ROUTE_MAP = [
  {
    slug: 'backpressure-in-distributed-systems',
    publicPath: '/blog/backpressure-stability-correctness-distributed-systems.html',
    assetPath: '/blog/backpressure-stability-correctness-distributed-systems.html',
    legacyPath: '/writing/backpressure-in-distributed-systems/'
  },
  {
    slug: 'architecting-a-multitenant-control-plane',
    publicPath: '/blog/architecting-a-multitenant-control-plane-for-a-next-generation-data-tier.html',
    assetPath: '/blog/architecting-a-multitenant-control-plane-for-a-next-generation-data-tier.html',
    legacyPath: '/writing/architecting-a-multitenant-control-plane/'
  },
  {
    slug: 'designing-a-correct-distributed-lease-service-tenure-on-raft',
    publicPath: '/blog/designing-a-correct-distributed-lease-service-tenure-on-raft.html',
    assetPath: '/blog/designing-a-correct-distributed-lease-service-tenure-on-raft.html',
    legacyPath: '/writing/designing-a-correct-distributed-lease-service-tenure-on-raft/'
  },
  {
    slug: 'end-to-end-overload-control-in-distributed-systems',
    publicPath: '/blog/end-to-end-overload-control-in-distributed-systems.html',
    assetPath: '/writing/end-to-end-overload-control-in-distributed-systems/',
    legacyPath: '/writing/end-to-end-overload-control-in-distributed-systems/'
  },
  {
    slug: 'admission-control-in-distributed-systems',
    publicPath: '/blog/admission-control-in-distributed-systems.html',
    assetPath: '/writing/admission-control-in-distributed-systems/',
    legacyPath: '/writing/admission-control-in-distributed-systems/'
  },
  {
    slug: 'rate-limiting-in-distributed-systems',
    publicPath: '/blog/rate-limiting-in-distributed-systems.html',
    assetPath: '/writing/rate-limiting-in-distributed-systems/',
    legacyPath: '/writing/rate-limiting-in-distributed-systems/'
  },
  {
    slug: 'circuit-breakers-in-distributed-systems',
    publicPath: '/blog/circuit-breakers-in-distributed-systems.html',
    assetPath: '/writing/circuit-breakers-in-distributed-systems/',
    legacyPath: '/writing/circuit-breakers-in-distributed-systems/'
  },
  {
    slug: 'graceful-degradation-in-distributed-systems',
    publicPath: '/blog/graceful-degradation-in-distributed-systems.html',
    assetPath: '/writing/graceful-degradation-in-distributed-systems/',
    legacyPath: '/writing/graceful-degradation-in-distributed-systems/'
  },
  {
    slug: 'load-shedding-in-distributed-systems',
    publicPath: '/blog/load-shedding-in-distributed-systems.html',
    assetPath: '/writing/load-shedding-in-distributed-systems/',
    legacyPath: '/writing/load-shedding-in-distributed-systems/'
  },
  {
    slug: 'retry-strategies-and-idempotency',
    publicPath: '/blog/retry-strategies-and-idempotency.html',
    assetPath: '/writing/retry-strategies-and-idempotency/',
    legacyPath: '/writing/retry-strategies-and-idempotency/'
  },
  {
    slug: 'queue-design-under-load',
    publicPath: '/blog/queue-design-under-load.html',
    assetPath: '/writing/queue-design-under-load/',
    legacyPath: '/writing/queue-design-under-load/'
  },
  {
    slug: 'why-systems-fail-under-load-not-just-bugs',
    publicPath: '/blog/why-systems-fail-under-load-not-just-bugs.html',
    assetPath: '/writing/why-systems-fail-under-load-not-just-bugs/',
    legacyPath: '/writing/why-systems-fail-under-load-not-just-bugs/'
  }
];

function stripTrailingSlash(path) {
  if (!path || path === '/') return '/';
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

function stripIndexHtml(path) {
  return path.endsWith('/index.html') ? path.slice(0, -'index.html'.length) : path;
}

export function normalizePath(input) {
  if (!input) return '/';
  const path = input.startsWith('http://') || input.startsWith('https://')
    ? new URL(input).pathname
    : input;
  return stripTrailingSlash(stripIndexHtml(path)) || '/';
}

function toLegacyAliases(legacyPath) {
  const normalized = normalizePath(legacyPath);
  return [legacyPath, normalized, `${normalized}/index.html`];
}

function toCanonicalAliases(publicPath) {
  const aliases = [publicPath];
  if (publicPath.endsWith('.html')) {
    aliases.push(publicPath.slice(0, -'.html'.length));
  }
  return aliases;
}

export const LEGACY_TO_PUBLIC = new Map(
  ARTICLE_ROUTE_MAP.flatMap((route) => toLegacyAliases(route.legacyPath).map((alias) => [alias, route.publicPath]))
);

export const CANONICAL_ALIASES_TO_PUBLIC = new Map(
  ARTICLE_ROUTE_MAP.flatMap((route) => toCanonicalAliases(route.publicPath).map((alias) => [alias, route.publicPath]))
);

export const PUBLIC_TO_ASSET = new Map(ARTICLE_ROUTE_MAP.map((route) => [route.publicPath, route.assetPath]));

export function canonicalArticlePath(pathOrUrl) {
  const normalized = normalizePath(pathOrUrl);
  return LEGACY_TO_PUBLIC.get(normalized) || CANONICAL_ALIASES_TO_PUBLIC.get(normalized) || null;
}

export function canonicalArticleUrl(pathOrUrl, siteOrigin = SITE_ORIGIN) {
  const canonicalPath = canonicalArticlePath(pathOrUrl);
  return canonicalPath ? `${siteOrigin}${canonicalPath}` : null;
}

export function isCanonicalArticlePath(pathOrUrl) {
  return CANONICAL_ALIASES_TO_PUBLIC.has(normalizePath(pathOrUrl));
}