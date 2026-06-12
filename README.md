# ProCoders Market — HTML Prototype

Static UI/UX prototype for **ProCoders Market**, the first-party WordPress plugin shop by ProCoders.

Frozen at **OD iteration 47** (21 pages, 9 CSS/JS layers). Design tokens, iteration log, and WP integration plan live in the companion theme repo under `wp-content/themes/procoders-market/docs/`.

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
| Catalog | `plugins.html`, `category.html`, `plugin.html`, `pcm-archive.css`, `pcm-plugin.css` |
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

## Deploy

`vercel.json` is included for static hosting with clean URLs.

## License

Proprietary — ProCoders. Internal prototype; not for redistribution.
