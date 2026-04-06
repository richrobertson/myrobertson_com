# Scripts section

This folder contains repository maintenance scripts used to generate search and syndication artifacts.

## Scripts

- `generate-rss.mjs`: builds `rss.xml` from published blog posts
- `generate-sitemap.mjs`: builds `sitemap.xml` and aligns the sitemap line in `robots.txt`
- `generate-knowledge.mjs`: builds `knowledge.json`
- `validate-canonicalization.mjs`: validates canonical URL consistency across HTML and discovery manifests

## Usage

Run from repository root:

- `node scripts/generate-rss.mjs`
- `node scripts/generate-sitemap.mjs`
- `node scripts/generate-knowledge.mjs`
- `node scripts/validate-canonicalization.mjs`

## Notes

- RSS includes posts with valid `BlogPosting` metadata and excludes drafts/noindex pages.
- Sitemap includes only indexable canonical routes.
- Canonical validation should be run after regenerating machine-readable files.
