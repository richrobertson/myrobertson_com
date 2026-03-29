# Scripts section

This folder contains repository maintenance scripts used to generate search and syndication artifacts.

## Scripts

- `generate-rss.mjs`: builds `rss.xml` from published blog posts
- `generate-sitemap.mjs`: builds `sitemap.xml` and aligns the sitemap line in `robots.txt`

## Usage

Run from repository root:

- `node scripts/generate-rss.mjs`
- `node scripts/generate-sitemap.mjs`

## Notes

- RSS includes posts with valid `BlogPosting` metadata and excludes drafts/noindex pages.
- Sitemap includes only indexable routes with canonical URLs matching route paths.
