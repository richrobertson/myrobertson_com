# myrobertson.com portfolio site

Static portfolio website for **myrobertson.com**, optimized for deployment on Cloudflare Pages.

## Run locally

```bash
python3 -m http.server 4173
```

Open <http://localhost:4173>.

## Featured distributed systems writing

- [What Is a Distributed Lock? (With Examples)](https://www.myrobertson.com/blog/what-is-a-distributed-lock-with-examples.html)
- [Raft vs Paxos vs EPaxos: A Practical Guide](https://www.myrobertson.com/blog/raft-vs-paxos-vs-epaxos-practical-guide.html)
- [Designing a Correct Distributed Lease Service: Tenure on Raft](https://www.myrobertson.com/blog/designing-a-correct-distributed-lease-service-tenure-on-raft.html)
- [Architecting a Multitenant Control Plane for a Next-Generation Data Tier](https://www.myrobertson.com/blog/architecting-a-multitenant-control-plane-for-a-next-generation-data-tier.html)

## Personalize from resume + LinkedIn files

Use this quick mapping process to copy your exact content into `index.html`:

1. **Professional summary** → `#about` section.
2. **Work history bullets** → `#experience` cards (most recent to oldest).
3. **Top projects/case studies** → `#projects` cards (include stack + outcomes).
4. **Skills block** → `#skills` cards.
5. **Contact links** → `#contact` section.

Tip: prefer quantified bullets (latency, costs, revenue, uptime, cycle time, adoption).

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In Cloudflare Dashboard, go to **Workers & Pages** → **Create** → **Pages**.
3. Connect your repository.
4. Use:
   - Framework preset: **None**
   - Build command: *(leave blank)*
   - Build output directory: `/`
5. Add custom domain `myrobertson.com` in Pages settings.
6. Update Cloudflare DNS records to point to the Pages project.

## RSS feed

- Feed output lives at `/rss.xml` (generated file committed to the repo).
- Source of truth for items is each published `blog/*.html` post with `BlogPosting` JSON-LD metadata (`headline`, `description`, `url`, `datePublished`).
- Drafts are excluded automatically when a post has `"draft": true` in JSON-LD or `<meta name="robots" content="noindex">` in the document head.
- Canonical site URL is configured in `scripts/generate-rss.mjs` as `SITE_URL` and must remain `https://www.myrobertson.com` for production-canonical links.

Regenerate the feed after publishing or updating posts:

```bash
node scripts/generate-rss.mjs
```
