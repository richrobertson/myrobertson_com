import fs from 'node:fs';
import { execSync } from 'node:child_process';

const SITE = 'https://www.myrobertson.com';
const PERSON_ID = `${SITE}/#person-rich-robertson`;
const WEBSITE_ID = `${SITE}/#website`;

const targets = [
  'index.html',
  'blog/index.html',
  ...fs.readdirSync('blog').filter((f) => f.endsWith('.html') && f !== 'index.html').map((f) => `blog/${f}`),
  'writing/index.html',
  ...fs.readdirSync('writing', { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `writing/${d.name}/index.html`),
  'case-studies/index.html',
  ...fs.readdirSync('case-studies', { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `case-studies/${d.name}/index.html`),
  'cloud-platform-engineer.html',
  'distributed-systems-engineer.html'
].filter((f) => fs.existsSync(f));

const keywordsFromPath = (file) => {
  const base = file.replace('/index.html', '').replace('.html', '').split('/').pop() || 'home';
  const words = base.split(/[-_]/).filter(Boolean);
  const fixed = ['distributed systems', 'control planes', 'backend engineering', 'cloud migration', 'OCI'];
  return Array.from(new Set([...words, ...fixed])).slice(0, 12);
};

const getMeta = (html, name, attr='name') => {
  const re = new RegExp(`<meta\\s+${attr}=["']${name}["']\\s+content=["']([^"']+)["']`, 'i');
  return html.match(re)?.[1] ?? '';
};

const getTitle = (html) => html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? '';
const getCanonical = (html, file) => {
  const c = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
  if (c) return c;
  const p = file === 'index.html' ? '/' : `/${file.replace(/index\.html$/, '')}`;
  return `${SITE}${p}`;
};
const getH1 = (html) => html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? '';

function gitDate(file, type='first') {
  try {
    const cmd = type === 'first'
      ? `git log --diff-filter=A --follow --format=%aI -- "${file}" | tail -n 1`
      : `git log -1 --format=%cI -- "${file}"`;
    const out = execSync(cmd, { encoding: 'utf8' }).trim();
    return out || '2026-01-01T00:00:00Z';
  } catch {
    return '2026-01-01T00:00:00Z';
  }
}

function breadcrumb(url, headline) {
  const u = new URL(url);
  const segs = u.pathname.split('/').filter(Boolean);
  const items = [{ '@type':'ListItem', position:1, name:'Home', item:`${SITE}/` }];
  let acc = '';
  segs.forEach((s, idx) => {
    acc += `/${s}`;
    const isLast = idx === segs.length - 1;
    const fallback = s.replace(/\.html$/, '').replace(/[-_]/g,' ').replace(/\b\w/g, (m)=>m.toUpperCase());
    const name = isLast && headline ? headline : fallback;
    items.push({ '@type':'ListItem', position: idx + 2, name, item: `${SITE}${acc}${idx===segs.length-1 && !url.endsWith('/') && !s.endsWith('.html') ? '' : '/'}`.replace(/\.html\/$/, '.html') });
  });
  return { '@type':'BreadcrumbList', itemListElement: items };
}

function pageType(file) {
  if (file === 'index.html') return 'WebPage';
  if (file.endsWith('/index.html') && (file === 'blog/index.html' || file === 'writing/index.html' || file === 'case-studies/index.html' || file.includes('/distributed-systems-migration/'))) return 'CollectionPage';
  if (file.startsWith('case-studies/')) return 'Article';
  if (file.startsWith('blog/') || file.startsWith('writing/')) return 'TechArticle';
  return 'CollectionPage';
}

for (const file of targets) {
  let html = fs.readFileSync(file, 'utf8');
  const title = getTitle(html);
  const description = getMeta(html, 'description');
  const url = getCanonical(html, file);
  const h1 = getH1(html) || title;
  const published = gitDate(file, 'first');
  const modified = gitDate(file, 'last');
  const keywords = keywordsFromPath(file);
  const about = [
    'distributed systems',
    'control planes',
    'platform modernization',
    'OCI migration',
    'production reliability'
  ];
  const citations = [];
  if (file === 'index.html' || file.includes('oracle-cns-oci-migration')) {
    citations.push({ '@type':'CreativeWork', name:'Oracle Customer Notification Service migration to OCI across 32 global data centers', url:`${SITE}/case-studies/oracle-cns-oci-migration/`});
  }
  if (html.includes('dev.to/')) {
    citations.push({ '@type':'CreativeWork', name:'External Dev.to article reference', url: 'https://dev.to/rich_robertson' });
  }

  const graph = [
    {
      '@type':'Person',
      '@id': PERSON_ID,
      name:'Rich Robertson',
      url:`${SITE}/`,
      jobTitle:'Senior Backend Engineer',
      sameAs:['https://www.linkedin.com/in/royrobertson/','https://github.com/richrobertson'],
      knowsAbout: about
    },
    {
      '@type':'WebSite',
      '@id': WEBSITE_ID,
      name:'Rich Robertson',
      url:`${SITE}/`,
      inLanguage:'en',
      about
    },
    {
      '@type': pageType(file),
      '@id': `${url}#main`,
      headline: h1,
      author: { '@id': PERSON_ID },
      datePublished: published,
      dateModified: modified,
      description,
      keywords,
      mainEntityOfPage: { '@id': url },
      url,
      inLanguage: 'en',
      about,
      isPartOf: { '@id': WEBSITE_ID },
      sameAs:['https://www.linkedin.com/in/royrobertson/','https://github.com/richrobertson'],
      ...(citations.length ? { citation: citations } : {})
    },
    breadcrumb(url, h1)
  ];

  if (file === 'blog/index.html' || file === 'writing/index.html' || file === 'case-studies/index.html') {
    graph.push({
      '@type':'ItemList',
      '@id': `${url}#list`,
      name: `${h1} Item List`,
      itemListOrder: 'https://schema.org/ItemListUnordered',
      numberOfItems: (html.match(/<article\b/g) || []).length,
      url,
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID }
    });
  }

  const payload = JSON.stringify({ '@context':'https://schema.org', '@graph': graph }, null, 2);
  const block = `\n    <!-- AI-SCHEMA:START -->\n    <script type="application/ld+json">\n${payload.split('\n').map((l)=>`    ${l}`).join('\n')}\n    </script>\n    <!-- AI-SCHEMA:END -->\n`;

  if (/<!-- AI-SCHEMA:START -->[\s\S]*<!-- AI-SCHEMA:END -->/m.test(html)) {
    html = html.replace(/<!-- AI-SCHEMA:START -->[\s\S]*<!-- AI-SCHEMA:END -->/m, block.trim());
  } else {
    html = html.replace('</head>', `${block}</head>`);
  }

  fs.writeFileSync(file, html);
}

console.log(`Updated structured data for ${targets.length} files.`);
