import {
  getAssetPathForCanonicalPath,
  getLegacyRedirectTarget,
  isRetiredWritingArchivePath,
  normalizePath
} from './content/article-routing.mjs';

const CANONICAL_HOST = 'www.myrobertson.com';
const CANONICAL_PROTOCOL = 'https:';

function redirect(url, pathname) {
  const next = new URL(url.toString());
  next.pathname = pathname;
  return Response.redirect(next.toString(), 301);
}

function redirectToCanonicalOrigin(url) {
  const next = new URL(url.toString());
  next.protocol = CANONICAL_PROTOCOL;
  next.hostname = CANONICAL_HOST;
  return Response.redirect(next.toString(), 301);
}

function toAbsoluteUrl(input, baseUrl) {
  if (!input) return null;
  try {
    return new URL(input, baseUrl).toString();
  } catch {
    return null;
  }
}

function toAssetBindingPath(assetPath) {
  if (assetPath.endsWith('/index.html')) {
    return assetPath.slice(0, -'index.html'.length);
  }

  return assetPath;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const normalizedPath = normalizePath(url.pathname);
    const hasAssetsBinding = Boolean(env?.ASSETS && typeof env.ASSETS.fetch === 'function');

    if (url.protocol !== CANONICAL_PROTOCOL || url.hostname !== CANONICAL_HOST) {
      return redirectToCanonicalOrigin(url);
    }

    const extensionlessAliases = new Map([
      ['/ask-rich.html', '/ask-rich'],
      ['/career-arc.html', '/career-arc'],
      ['/distributed-systems-engineer.html', '/distributed-systems-engineer'],
      ['/cloud-platform-engineer.html', '/cloud-platform-engineer']
    ]);

    // Preserve historical article deep-links before any broad /writing retirement fallback.
    // This keeps intentful legacy URLs mapped to exact canonical article destinations.
    const legacyTarget = getLegacyRedirectTarget(normalizedPath);
    if (legacyTarget) {
      return redirect(url, legacyTarget);
    }

    if (extensionlessAliases.has(url.pathname)) {
      return redirect(url, extensionlessAliases.get(url.pathname));
    }

    if (url.pathname.endsWith('.html') && url.pathname.startsWith('/blog/') && url.pathname !== '/blog/index.html') {
      return redirect(url, url.pathname.slice(0, -'.html'.length));
    }

    if (url.pathname === '/blog/index.html') {
      return redirect(url, '/blog/');
    }

    if (isRetiredWritingArchivePath(url.pathname)) {
      return redirect(url, '/blog/');
    }

    // Unknown /writing/* routes are retired and funnel into /blog/ after exact alias checks above.
    if (normalizedPath.startsWith('/writing/')) {
      return redirect(url, '/blog/');
    }

    const assetPath = getAssetPathForCanonicalPath(url.pathname);
    if (assetPath && assetPath !== url.pathname) {
      if (!hasAssetsBinding) {
        const originAssetUrl = new URL(url.toString());
        originAssetUrl.pathname = assetPath;
        return fetch(new Request(originAssetUrl.toString(), request));
      }

      const assetUrl = new URL(url.toString());
      // Cloudflare's default HTML handling redirects direct /index.html asset
      // requests to their directory URL. Fetch the directory form through the
      // binding so the public /blog URL receives the asset instead of a 307 to
      // its private /writing storage path.
      assetUrl.pathname = toAssetBindingPath(assetPath);
      try {
        const rewrittenRequest = new Request(assetUrl.toString(), request);
        return env.ASSETS.fetch(rewrittenRequest);
      } catch {
        const originAssetUrl = new URL(url.toString());
        originAssetUrl.pathname = assetPath;
        return fetch(new Request(originAssetUrl.toString(), request));
      }
    }

    if (!hasAssetsBinding) {
      return fetch(request);
    }

    const assetResponse = await env.ASSETS.fetch(request);

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
