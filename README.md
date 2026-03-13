# myrobertson.com portfolio site

Static portfolio website for **myrobertson.com**, optimized for deployment on Cloudflare Pages.

## Run locally

```bash
python3 -m http.server 4173
```

Open <http://localhost:4173>.

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
