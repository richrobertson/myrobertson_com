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

function toAbsoluteUrl(input, baseUrl) {
  if (!input) return null;
  try {
    return new URL(input, baseUrl).toString();
  } catch {
    return null;
  }
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
        // If ASSETS is unavailable, proxy the underlying asset file via origin fetch
        // so the browser can keep the canonical /blog URL.
        const originAssetUrl = new URL(url.toString());
        originAssetUrl.pathname = assetPath;
        return fetch(new Request(originAssetUrl.toString(), request));
      }

      const assetUrl = new URL(url.toString());
      assetUrl.pathname = assetPath;
      try {
        const rewrittenRequest = new Request(assetUrl.toString(), request);
        return env.ASSETS.fetch(rewrittenRequest);
      } catch {
        // Fall back to origin asset proxy instead of returning a 500.
        const originAssetUrl = new URL(url.toString());
        originAssetUrl.pathname = assetPath;
        return fetch(new Request(originAssetUrl.toString(), request));
      }
    }

    if (!hasAssetsBinding) {
      return fetch(request);
    }

    const assetResponse = await env.ASSETS.fetch(request);

    // Keep stable .html public URLs by internally resolving extensionless assets
    // if the asset service attempts to redirect to the extensionless form.
    if (url.pathname.endsWith('.html') && assetResponse.status >= 300 && assetResponse.status < 400) {
      const redirectLocation = assetResponse.headers.get('location');
      const expectedRedirectUrl = toAbsoluteUrl(url.pathname.slice(0, -'.html'.length), url.toString());
      const actualRedirectUrl = toAbsoluteUrl(redirectLocation, url.toString());

      if (expectedRedirectUrl && actualRedirectUrl === expectedRedirectUrl) {
        const extensionlessUrl = new URL(url.toString());
        extensionlessUrl.pathname = url.pathname.slice(0, -'.html'.length);
        return env.ASSETS.fetch(new Request(extensionlessUrl.toString(), request));
      }
    }

    return assetResponse;
  }
};