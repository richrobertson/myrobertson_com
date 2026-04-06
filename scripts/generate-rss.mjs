import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { WRITING_CANONICAL_ASSET_ROUTES } from '../content/article-routing.mjs';

const SITE_URL = 'https://www.myrobertson.com';
const FEED_URL = `${SITE_URL}/rss.xml`;
const BLOG_DIR = path.resolve('blog');
const OUTPUT_FILE = path.resolve('rss.xml');

const channel = {
  title: 'Rich Robertson Blog',
  link: `${SITE_URL}/blog/`,
  description:
    'Thoughts, lessons learned, and deep dives from Rich Robertson on software engineering, cloud platforms, and distributed systems.',
  language: 'en'
};

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function extractJsonLd(html) {
  const matches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  for (const match of matches) {
    try {
      return JSON.parse(match[1].trim());
    } catch {
      // Ignore invalid JSON-LD blocks and continue scanning.
    }
  }
  return null;
}

function findArticleNode(jsonLd) {
  if (!jsonLd) return null;
  if (Array.isArray(jsonLd)) {
    for (const entry of jsonLd) {
      const found = findArticleNode(entry);
      if (found) return found;
    }
    return null;
  }
  if (jsonLd['@graph']) {
    return findArticleNode(jsonLd['@graph']);
  }
  const type = Array.isArray(jsonLd['@type']) ? jsonLd['@type'] : [jsonLd['@type']];
  if (type.some((value) => ['BlogPosting', 'Article', 'TechArticle'].includes(value))) {
    return jsonLd;
  }
  return null;
}

function extractMetaDescription(html) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?\s*>/i);
  return match?.[1]?.trim() ?? '';
}

function extractCanonical(html) {
  const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']\s*\/?\s*>/i);
  return match?.[1]?.trim() ?? '';
}

function extractRobotsMeta(html) {
  const match = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']\s*\/?\s*>/i);
  return match?.[1]?.trim().toLowerCase() ?? '';
}

async function loadPosts() {
  const entries = await readdir(BLOG_DIR, { withFileTypes: true });
  const posts = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.html') || entry.name === 'index.html') {
      continue;
    }

    const filePath = path.join(BLOG_DIR, entry.name);
    const html = await readFile(filePath, 'utf8');
    const articleNode = findArticleNode(extractJsonLd(html));

    if (!articleNode || articleNode['@type'] !== 'BlogPosting') {
      continue;
    }

    const link = articleNode.url || extractCanonical(html);
    const title = articleNode.headline;
    const description = articleNode.description || extractMetaDescription(html);
    const published = articleNode.datePublished;
    const isDraft = articleNode.draft === true || extractRobotsMeta(html).includes('noindex');

    if (isDraft) {
      continue;
    }

    if (!link || !title || !published || !description) {
      continue;
    }

    const publishedDate = new Date(published);
    if (!Number.isFinite(publishedDate.getTime())) {
      throw new Error(`Invalid datePublished for ${entry.name}: ${published}`);
    }

    if (!link.startsWith(SITE_URL)) {
      continue;
    }

    posts.push({
      title,
      link,
      description,
      publishedAt: publishedDate.getTime(),
      pubDate: publishedDate.toUTCString()
    });
  }

  posts.sort((a, b) => {
    if (b.publishedAt !== a.publishedAt) {
      return b.publishedAt - a.publishedAt;
    }

    if (a.link < b.link) return -1;
    if (a.link > b.link) return 1;
    return 0;
  });
  return posts;
}

function assetRouteToFilePath(assetPath) {
  if (assetPath.endsWith('.html')) {
    return path.resolve(assetPath.replace(/^\//, ''));
  }
  return path.resolve(assetPath.replace(/^\//, ''), 'index.html');
}

async function loadWritingBackedCanonicalPosts() {
  const posts = [];

  for (const route of WRITING_CANONICAL_ASSET_ROUTES) {

    const filePath = assetRouteToFilePath(route.assetPath);
    const html = await readFile(filePath, 'utf8');
    const articleNode = findArticleNode(extractJsonLd(html));
    const robots = extractRobotsMeta(html);

    if (robots.includes('noindex')) continue;

    const link = `${SITE_URL}${route.publicPath}`;
    const title = articleNode?.headline || html.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1]?.trim() || '';
    const description = articleNode?.description || extractMetaDescription(html);
    const published = articleNode?.datePublished;

    if (!title || !description || !published) continue;

    const publishedDate = new Date(published);
    if (!Number.isFinite(publishedDate.getTime())) {
      throw new Error(`Invalid datePublished for ${route.publicPath.split('/').pop()}: ${published}`);
    }

    posts.push({
      title,
      link,
      description,
      publishedAt: publishedDate.getTime(),
      pubDate: publishedDate.toUTCString()
    });
  }

  return posts;
}

function buildFeed(posts) {
  const items = posts
    .map(
      (post) => `    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${escapeXml(post.link)}</link>\n      <description>${escapeXml(post.description)}</description>\n      <guid>${escapeXml(post.link)}</guid>\n      <pubDate>${escapeXml(post.pubDate)}</pubDate>\n    </item>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${escapeXml(channel.link)}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>${escapeXml(channel.language)}</language>
    <atom:link href="${escapeXml(FEED_URL)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

const deduped = new Map();
for (const post of [...(await loadPosts()), ...(await loadWritingBackedCanonicalPosts())]) {
  deduped.set(post.link, post);
}
const posts = [...deduped.values()];
posts.sort((a, b) => {
  if (b.publishedAt !== a.publishedAt) {
    return b.publishedAt - a.publishedAt;
  }

  if (a.link < b.link) return -1;
  if (a.link > b.link) return 1;
  return 0;
});
const feed = buildFeed(posts);
await writeFile(OUTPUT_FILE, feed, 'utf8');

console.log(`Generated ${OUTPUT_FILE} with ${posts.length} post(s).`);
