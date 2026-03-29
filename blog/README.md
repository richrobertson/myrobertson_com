# Blog section

This folder contains standalone blog post pages and blog-specific scripts.

## What belongs here

- `index.html`: blog archive and discovery page
- `*.html`: individual blog posts
- `blog.js`: archive tag filtering and related-content rendering
- `taxonomy.js`: blog taxonomy metadata consumed by `blog.js`

## Authoring rules

- Each published post should include canonical, description, and `BlogPosting` JSON-LD metadata.
- Use `noindex` for draft or planned posts that should not enter search indices.
- Keep article slugs stable once published to avoid breaking inbound links.

## Publishing checklist

1. Add or update the post HTML file.
2. Verify canonical and robots meta tags.
3. Confirm taxonomy entries are accurate.
4. Regenerate `rss.xml` and `sitemap.xml` from repository root.
