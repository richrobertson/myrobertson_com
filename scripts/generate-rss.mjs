import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

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
  const scriptMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  if (!scriptMatch) return null;

  try {
    return JSON.parse(scriptMatch[1].trim());
  } catch {
    return null;
  }
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

function parsePublishedDate(value, entryName) {
  const hasExplicitTime = value.includes('T');
  const hasTimezoneOffset = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);

  if (hasExplicitTime && !hasTimezoneOffset) {
    throw new Error(
      `Invalid datePublished for ${entryName}: ${value} (expected an ISO 8601 date or an ISO 8601/RFC 3339 timestamp with Z or an explicit ±HH:MM offset)`
    );
  }

  const publishedDate = new Date(value);
  if (!Number.isFinite(publishedDate.getTime())) {
    throw new Error(`Invalid datePublished for ${entryName}: ${value}`);
  }

  return publishedDate;
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
    const jsonLd = extractJsonLd(html);

    if (!jsonLd || jsonLd['@type'] !== 'BlogPosting') {
      continue;
    }

    const link = jsonLd.url || extractCanonical(html);
    const title = jsonLd.headline;
    const description = jsonLd.description || extractMetaDescription(html);
    const published = jsonLd.datePublished;
    const isDraft = jsonLd.draft === true || extractRobotsMeta(html).includes('noindex');

    if (isDraft) {
      continue;
    }

    if (!link || !title || !published || !description) {
      continue;
    }

    const publishedDate = parsePublishedDate(published, entry.name);

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

    // Use direct string comparison for a deterministic, locale-independent URL tie-breaker.
    if (a.link < b.link) return -1;
    if (a.link > b.link) return 1;
    return 0;
  });
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

const posts = await loadPosts();
const feed = buildFeed(posts);
await writeFile(OUTPUT_FILE, feed, 'utf8');

console.log(`Generated ${OUTPUT_FILE} with ${posts.length} post(s).`);
