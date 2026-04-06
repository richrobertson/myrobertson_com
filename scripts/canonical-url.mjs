import { canonicalArticlePath, normalizePath } from '../content/article-routing.mjs';

export const CANONICAL_ORIGIN = 'https://www.myrobertson.com';

const EXTENSIONLESS_ROUTES = new Set([
  '/ask-rich',
  '/career-arc',
  '/cloud-platform-engineer',
  '/distributed-systems-engineer'
]);

export function canonicalPath(pathOrUrl) {
  const normalized = normalizePath(pathOrUrl);
  const articlePath = canonicalArticlePath(normalized);
  if (articlePath) return articlePath;

  if (EXTENSIONLESS_ROUTES.has(normalized)) return normalized;
  if (EXTENSIONLESS_ROUTES.has(normalized.replace(/\.html$/, ''))) return normalized.replace(/\.html$/, '');

  if (normalized === '/blog') return '/blog/';
  if (normalized === '/case-studies' || normalized.startsWith('/case-studies/')) return normalized.endsWith('/') ? normalized : `${normalized}/`;
  if (normalized === '/distributed-systems') return '/distributed-systems/';

  return normalized;
}

export function canonicalUrl(pathOrUrl, origin = CANONICAL_ORIGIN) {
  return `${origin}${canonicalPath(pathOrUrl)}`;
}

export function isCanonicalAbsoluteUrl(value) {
  try {
    const url = new URL(value);
    if (url.origin !== CANONICAL_ORIGIN) return false;
    return canonicalUrl(url.pathname) === `${url.origin}${url.pathname}`;
  } catch {
    return false;
  }
}
