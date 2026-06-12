# SEO Action Plan — ProCoders Market Prototype

Prioritized fixes after audit of https://procoders-market-prototype.vercel.app

---

## Critical (do before indexing staging or launching production)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | Add `robots.txt` with `Sitemap:` directive and allow all (or block staging host) | S | Crawlability |
| 2 | Generate `sitemap.xml` with 20 indexable URLs | S | Discovery |
| 3 | **Staging:** add `noindex` sitewide on `*.vercel.app` OR dynamic canonical to current host | M | Index hygiene |
| 4 | **Production:** ensure `market.procoders.tech` serves same paths as prototype (`/plugin-{slug}`) | L | Canonical alignment |

### `robots.txt` starter

```
User-agent: *
Allow: /

Sitemap: https://market.procoders.tech/sitemap.xml
```

For Vercel preview only:

```
User-agent: *
Disallow: /
```

---

## High

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 5 | Add `llms.txt` — product list, GPL/licensing, support URL | S | GEO |
| 6 | Per-product FAQ accordions (mirror HubSpot template depth) | M | Content + GEO citability |
| 7 | Replace screenshot placeholders with real WP.org/GitHub screenshots + `alt` | M | E-E-A-T, image SEO |
| 8 | Add `image`, `sameAs`, `downloadUrl` to `SoftwareApplication` JSON-LD | S | Rich results |
| 9 | Category pages for SEO, AI, Dev Tools (not only Forms) | M | IA + internal links |
| 10 | Fix footer GitHub social link (`procoders.tech` → org GitHub URL) | S | Trust |

---

## Medium

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 11 | Self-host Poppins/Roboto Mono or subset fonts | M | LCP |
| 12 | Consolidate CSS bundles for fewer requests | M | Performance |
| 13 | Add `lastmod` to sitemap from `catalog.json` `updatedAt` | S | Freshness signals |
| 14 | `hreflang` only if multi-locale planned (currently `lang="en"` only) | — | N/A now |
| 15 | Validate schema with Google Rich Results Test post-launch | S | QA |

---

## Low

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 16 | Add CSP header via `vercel.json` | M | Security |
| 17 | IndexNow ping on deploy (Bing) | S | Faster indexing |
| 18 | Re-run PageSpeed / CrUX when API quota available | S | CWV baseline |
| 19 | Add validation to `generate-plugin-pages.mjs`: fail if wrong slug/CRM text appears | S | Prevent copy regressions |

### Generator validation snippet (idea)

```bash
# After generate: no HubSpot refs outside hubspot page
rg -l "connect-cf7-to-hubspot|HubSpot" plugin-*.html | grep -v hubspot && exit 1
```

---

## Completed in this session

- [x] Fixed Installation + Screenshots copy on 9 plugin singles
- [x] Fixed meta sidebar (GitHub source vs fake WP.org stats)
- [x] Trimmed meta descriptions to ≤155 chars
- [x] Fixed JSON-LD breadcrumb category URLs
- [x] Pushed to `main` → Vercel auto-deploy

---

## Suggested implementation order

1. `robots.txt` + `sitemap.xml` + staging `noindex` guard  
2. `llms.txt`  
3. FAQ + screenshots content pass  
4. Schema enrichment  
5. Performance (fonts/CSS) before production launch  
