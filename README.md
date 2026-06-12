# ProCoders Market — HTML Prototype

Static UI/UX prototype for **ProCoders Market**, the first-party WordPress plugin shop by ProCoders.

Frozen at **OD iteration 49** — 10 real ProCoders products, `catalog.json` + `pcm-catalog.js`, 10 `plugin-{slug}.html` singles, banner assets under `assets/plugins/`. Design tokens and iteration log live in the companion theme repo under `wp-content/themes/procoders-market/docs/`.

## Preview locally

Serve the repo root with any static file server:

```bash
npx serve .
# or: python3 -m http.server 8080
```

Open `index.html` (or `/` with `vercel.json` on Vercel).

## Structure

| Layer | Files |
|-------|-------|
| Shared | `pcm-shared.css`, `pcm-shared.js` |
| Home | `index.html`, `pcm-home.css` |
| Catalog | `catalog.json`, `pcm-catalog.js`, `plugins.html`, `category.html`, `plugin-{slug}.html` × 10, `pcm-archive.css`, `pcm-plugin.css`, `assets/plugins/` |
| Marketing | `pricing.html`, `support.html`, `docs.html`, `how-it-works.html`, `pcm-content.css` |
| Account | `account.html`, `pcm-account.css`, `pcm-account.js` |
| Auth | `sign-in.html`, `sign-up.html`, `reset-password.html`, `pcm-auth.css`, `pcm-auth.js` |
| Checkout | `order-confirmation.html`, `pcm-checkout.css`, `pcm-checkout.js` |
| Wishlist | `wishlist.html`, `pcm-wishlist.css`, `pcm-wishlist.js` |
| Search | `search.html`, `404.html`, `pcm-search.css`, `pcm-search.js` |
| Legal / docs | `terms.html`, `privacy.html`, `refund.html`, `doc-article.html` |

## Design tokens

- Background: `#0b0b22`, surface `#17172d`, glass `rgba(255,255,255,.05)`
- Accents: blue `#0096ff`, violet `#6016fc`, magenta `#df00e3`, green `#66ffa3`
- Fonts: Poppins + Roboto Mono · container 1320px

## Deploy (Vercel via GitHub Actions)

Every push to `main` triggers [`.github/workflows/vercel-deploy.yml`](.github/workflows/vercel-deploy.yml).

### One-time setup

1. Create a token at [vercel.com/account/tokens](https://vercel.com/account/tokens) (Full Account scope).
2. Bootstrap the Vercel project and print secret values:

```bash
VERCEL_TOKEN=your_token ./scripts/bootstrap-vercel.sh
```

3. Add repository secrets on GitHub (`Settings → Secrets → Actions`):

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | from `.vercel/project.json` after bootstrap |
| `VERCEL_PROJECT_ID` | from `.vercel/project.json` after bootstrap |

Or via CLI:

```bash
gh secret set VERCEL_TOKEN --repo khymerao/procoders-market-prototype
gh secret set VERCEL_ORG_ID --repo khymerao/procoders-market-prototype
gh secret set VERCEL_PROJECT_ID --repo khymerao/procoders-market-prototype
```

`vercel.json` provides clean URLs and security headers for static hosting.

## License

Proprietary — ProCoders. Internal prototype; not for redistribution.
