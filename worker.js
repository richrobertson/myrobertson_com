import { CANONICAL_ALIASES_TO_PUBLIC, LEGACY_TO_PUBLIC, PUBLIC_TO_ASSET, normalizePath } from './content/article-routing.mjs';

function redirect(url, pathname) {
  const next = new URL(url.toString());
  next.pathname = pathname;
  return Response.redirect(next.toString(), 301);
}

function toAssetFilePath(assetPath) {
  if (!assetPath) return assetPath;
  if (assetPath.endsWith('.html')) return assetPath;
  if (assetPath.endsWith('/')) return `${assetPath}index.html`;
  return `${assetPath}/index.html`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const normalizedPath = normalizePath(url.pathname);
    const hasAssetsBinding = Boolean(env?.ASSETS && typeof env.ASSETS.fetch === 'function');

    if (url.pathname === '/blog/index.html') {
      return redirect(url, '/blog/');
    }

    const legacyTarget = LEGACY_TO_PUBLIC.get(normalizedPath);
    if (legacyTarget) {
      if (!hasAssetsBinding) {
        // If ASSETS is unavailable, allow legacy paths to resolve via origin.
        return fetch(request);
      }
      return redirect(url, legacyTarget);
    }

    const canonicalTarget = CANONICAL_ALIASES_TO_PUBLIC.get(normalizedPath);
    if (canonicalTarget && url.pathname !== canonicalTarget) {
      return redirect(url, canonicalTarget);
    }

    const assetPath = PUBLIC_TO_ASSET.get(url.pathname);
    if (assetPath && assetPath !== url.pathname) {
      if (!hasAssetsBinding) {
        // Prevent runtime 500s when ASSETS is not bound in production.
        return redirect(url, assetPath);
      }

      const assetFilePath = toAssetFilePath(assetPath);
      const assetUrl = new URL(url.toString());
      assetUrl.pathname = assetFilePath;
      try {
        const rewrittenRequest = new Request(assetUrl.toString(), request);
        return env.ASSETS.fetch(rewrittenRequest);
      } catch {
        // Fall back to the underlying asset route instead of returning a 500.
        return redirect(url, assetPath);
      }
    }

    return hasAssetsBinding ? env.ASSETS.fetch(request) : fetch(request);
  }
};