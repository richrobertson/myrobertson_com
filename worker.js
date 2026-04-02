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
      const assetFilePath = toAssetFilePath(assetPath);

      if (!hasAssetsBinding) {
        // If ASSETS is unavailable, proxy the underlying asset file via origin fetch
        // so the browser can keep the canonical /blog URL.
        const originAssetUrl = new URL(url.toString());
        originAssetUrl.pathname = assetFilePath;
        return fetch(new Request(originAssetUrl.toString(), request));
      }

      const assetUrl = new URL(url.toString());
      assetUrl.pathname = assetFilePath;
      try {
        const rewrittenRequest = new Request(assetUrl.toString(), request);
        return env.ASSETS.fetch(rewrittenRequest);
      } catch {
        // Fall back to origin asset proxy instead of returning a 500.
        const originAssetUrl = new URL(url.toString());
        originAssetUrl.pathname = assetFilePath;
        return fetch(new Request(originAssetUrl.toString(), request));
      }
    }

    return hasAssetsBinding ? env.ASSETS.fetch(request) : fetch(request);
  }
};