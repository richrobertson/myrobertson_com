# Contributing

Thanks for helping improve this site.

## Scope

This repository is a static website. Contributions should preserve:

- Fast, static-first delivery
- Clear technical writing and SEO integrity
- Stable public URLs and canonical metadata

## Maintainer rule: keep /blog/ canonical

The `/blog/` path is a long-lived canonical public URL and must not be renamed, replaced, or moved.

- Do not change `/blog/` to another base path.
- Do not migrate published blog links to a new URL scheme.
- Treat changes to `/blog/` routing as breaking changes because previously shared links would fail.
- If a structural change is ever unavoidable, a complete redirect plan for every legacy path is required before merge.

## Development

Run a local server from the repository root:

```bash
python3 -m http.server 4173
```

Open <http://localhost:4173>.

## Before opening a pull request

1. Keep changes focused and easy to review.
2. If you modify writing or case-study pages, verify canonical and robots metadata.
3. If you add or update blog posts, regenerate repository artifacts:

```bash
node scripts/generate-rss.mjs
node scripts/generate-sitemap.mjs
```

4. Confirm CI workflows pass.

## Commit and PR guidance

- Use descriptive commit messages.
- Explain user-visible impact and SEO implications.
- Include screenshots for meaningful UI changes.
- Note any URL, redirect, or metadata changes.
