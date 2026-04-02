import { CANONICAL_ALIASES_TO_PUBLIC, LEGACY_TO_PUBLIC, PUBLIC_TO_ASSET, normalizePath } from './content/article-routing.mjs';

function redirect(url, pathname) {
  const next = new URL(url.toString());
  next.pathname = pathname;
  return Response.redirect(next.toString(), 301);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const normalizedPath = normalizePath(url.pathname);

    if (url.pathname === '/blog/index.html') {
      return redirect(url, '/blog/');
    }

    const legacyTarget = LEGACY_TO_PUBLIC.get(normalizedPath);
    if (legacyTarget) {
      return redirect(url, legacyTarget);
    }

    const canonicalTarget = CANONICAL_ALIASES_TO_PUBLIC.get(normalizedPath);
    if (canonicalTarget && url.pathname !== canonicalTarget) {
      return redirect(url, canonicalTarget);
    }

    const assetPath = PUBLIC_TO_ASSET.get(url.pathname);
    if (assetPath && assetPath !== url.pathname) {
      const assetUrl = new URL(url.toString());
      assetUrl.pathname = assetPath;
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    return env.ASSETS.fetch(request);
  }
};