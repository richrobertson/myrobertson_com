# myrobertson.com portfolio site

Static-first personal site for <https://www.myrobertson.com> with long-form writing, case studies, and the Ask Rich assistant. The repository is deployed as static assets on Cloudflare.

## Current architecture

- Primary static routes are top-level HTML pages plus directory index routes.
- Blog posts are standalone HTML files under `blog/`.
- Writing and case studies are grouped under `writing/` and `case-studies/`.
- Shared UI behavior and nav logic live in small vanilla JS files (`nav.js`, `script.js`, `blog/blog.js`, `ask-rich.js`).
- Global styling lives in `styles.css`.
- Runtime widget script for Ask Rich lives in `static/askrich-widget.js`.

## Repository layout

```text
.
|- index.html
|- ask-rich.html
|- blog/
|- writing/
|- case-studies/
|- static/
|- scripts/
|  |- generate-rss.mjs
|  |- generate-sitemap.mjs
|- content/
|  |- content-model.js
|- seo.config.json
|- robots.txt
|- sitemap.xml
|- rss.xml
|- wrangler.jsonc
```

## Local development

Run a local static server from repo root:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Ask Rich integration

- Dedicated route: `/ask-rich.html`
- Default API base: `https://api.myrobertson.com`
- API base override is available through Ask Rich settings for staging validation
- Production host hides advanced API settings in the UI automatically

## Content and publishing model

- Blog entry pages: `blog/*.html`.
- Writing hubs and article pages: `writing/**/index.html`.
- Case-study pages: `case-studies/**/index.html`.
- Indexability and publication intent are centrally tracked in `content/content-model.js` and reinforced by page-level canonical and robots tags.

## SEO and feed generation

### RSS

- Output file: `rss.xml`.
- Source of truth: published blog pages containing `BlogPosting` JSON-LD.
- A post is excluded if either of these is true:
  - JSON-LD has `"draft": true`
  - Page includes robots `noindex`

Regenerate RSS after publishing or changing blog posts:

```bash
node scripts/generate-rss.mjs
```

### Sitemap and robots

- Output sitemap: `sitemap.xml`
- `robots.txt` sitemap reference is kept aligned by the sitemap generator.
- URL canonical origin comes from `SITE_URL` env var (if set) or `seo.config.json` `siteUrl`.

Regenerate sitemap and align robots:

```bash
node scripts/generate-sitemap.mjs
```

Sitemap inclusion requires all of the following:

- Route is a public HTML page.
- Canonical URL exists and matches the physical route.
- Route is not `noindex`.
- Route is not an excluded utility route.
- If route exists in `content/content-model.js`, it must be `status: 'published'` and `noindex: false`.

## Deployment

### Cloudflare Pages / static assets

- Deploy target is static assets from repository root.
- `wrangler.jsonc` defines the Cloudflare asset directory as `.`.

### Typical Pages settings

- Framework preset: None
- Build command: none
- Build output directory: `/`

## Static analysis and CI best practices

This repository now includes GitHub Actions workflows for static code analysis:

- `.github/workflows/static-analysis.yml`
  - Runs Super-Linter on HTML, CSS, JavaScript, Markdown, and YAML.
  - Runs on push and pull request.
  - Excludes generated XML artifacts (`rss.xml`, `sitemap.xml`) from lint noise.
- `.github/workflows/codeql.yml`
  - Runs GitHub CodeQL analysis for JavaScript security and code-quality scanning.
  - Runs weekly and on push/pull request.

These workflows provide baseline quality gates for static sites without requiring a full bundler or framework build.

## Public repository standards

This repository includes standard public-facing governance and collaboration files:

- `LICENSE` clarifies content/code usage terms.
- `CODE_OF_CONDUCT.md` sets participation expectations.
- `CONTRIBUTING.md` defines contribution and validation flow.
- `SECURITY.md` documents private vulnerability reporting.
- `.github/CODEOWNERS` sets review ownership.
- `.github/ISSUE_TEMPLATE/` provides structured bug/feature intake.
- `.github/pull_request_template.md` standardizes review context.
- `.github/dependabot.yml` keeps GitHub Actions dependencies updated.
- `.editorconfig` enforces consistent formatting across editors.

## Recommended update checklist

When publishing new writing or case studies:

1. Add/update the HTML page.
2. Verify canonical URL and robots directives.
3. If applicable, update `content/content-model.js` publication status.
4. Run:

```bash
node scripts/generate-rss.mjs
node scripts/generate-sitemap.mjs
```

5. Commit generated `rss.xml` and `sitemap.xml` updates.
6. Open a PR and confirm static-analysis and CodeQL checks pass.
