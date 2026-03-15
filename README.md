# myrobertson.com portfolio site

This portfolio site is now served by a Go web server using `html/template` and static assets.

## Run locally

```bash
go run ./cmd/site
```

Then open <http://localhost:4173>.

## Project structure

- `cmd/site/main.go` — HTTP server and route handlers.
- `templates/index.html` — portfolio page template.
- `static/styles.css` — site styles.
- `static/script.js` — footer year script.

## Deploy notes

Cloudflare Pages is for static output, while this repo now runs as a Go server.
To host this under `myrobertson.com`, deploy the Go app to a Go-capable host (e.g., Fly.io, Render, Railway, VPS) and point Cloudflare DNS for your domain to that service.
