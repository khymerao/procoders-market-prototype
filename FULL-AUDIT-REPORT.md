# SEO Audit — ProCoders Market Prototype

**URL audited:** https://procoders-market-prototype.vercel.app  
**Date:** 2026-06-12  
**Business type:** E-commerce / software catalog (WordPress plugin marketplace)  
**Pages in scope:** 29 static HTML files (~18 indexable)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **SEO Health Score** | **63 / 100** |
| **Crawlability** | Poor — no `robots.txt` or `sitemap.xml` |
| **Indexability (staging)** | Risky — canonicals point to `market.procoders.tech` |
| **Content quality** | Good after copy fix; FAQ/reviews thin on most singles |
| **Schema** | Solid baseline (`Organization`, `WebSite`, `SoftwareApplication`, `Offer`) |
| **GEO / AI search** | Weak — no `llms.txt`, no AI crawler policy |
| **Performance** | Not measured (PageSpeed API rate-limited) |

### Top 5 critical issues

1. **`robots.txt` and `sitemap.xml` missing** — both URLs return the 404 page HTML with `noindex`.
2. **Cross-domain canonicals** — every page declares `https://market.procoders.tech/...` while served from Vercel staging; crawlers may attribute signals to production or see inconsistency.
3. **No XML sitemap** — 10 product singles + catalog pages are not discoverable via sitemap.
4. **No `llms.txt`** — AI crawlers lack curated site guidance (GEO gap).
5. **Screenshot sections use placeholder frames** — no real `img` assets; weak for image search and E-E-A-T on product pages.

### Top 5 quick wins

1. Add `public/robots.txt` + `public/sitemap.xml` (or generate at build time).
2. Add `noindex` on prototype Vercel deploy OR use env-based canonical base URL.
3. Expand per-product FAQ accordions (HubSpot page is the gold standard).
4. Add `llms.txt` with product list and licensing notes.
5. Wire footer GitHub link to actual org repo (currently points to `procoders.tech` on some singles).

---

## Technical SEO — Score: 45/100

| Check | Status | Notes |
|-------|--------|-------|
| HTTPS | Pass | HSTS enabled on Vercel |
| `robots.txt` | **Fail** | Returns 404 HTML (`noindex`) |
| `sitemap.xml` | **Fail** | Same as above |
| Canonical tags | **Warn** | Present but target production domain |
| `cleanUrls` | Pass | `/plugins` → `plugins.html` works |
| Unknown URLs | Pass | Return HTTP 404 |
| `/404` page | Warn | Returns HTTP 200 (acceptable if not linked) |
| Viewport | Pass | `width=device-width` on all pages |
| Security headers | Partial | `X-Content-Type-Options: nosniff`; no CSP |
| JS rendering | Pass | Static HTML, no SPA shell |
| Internal links | Warn | Mix of `*.html` paths and clean URLs |

**Redirect note:** `index.html` → `/` returns 308 (good).

---

## Content Quality — Score: 68/100

| Factor | Assessment |
|--------|------------|
| **Experience** | Strong — real ProCoders products, WP.org + GitHub sources |
| **Expertise** | Good — technical install steps, CRM-specific copy on CF7 plugins |
| **Authoritativeness** | Moderate — first-party store; limited external citations |
| **Trustworthiness** | Good — privacy, terms, refund, support pages present |

### Issues found (fixed during audit)

- **Wrong template copy:** 9 plugin singles inherited HubSpot Installation/Screenshots text from `generate-plugin-pages.mjs`. Fixed and deployed (`d6b755b`, `9bc93e9`).
- **Wrong meta sidebar:** GitHub products showed HubSpot install stats (300+, 5★). Fixed meta-card regex.

### Remaining content gaps

- **Thin FAQ** on 9/10 product pages (generic “visit docs/support” vs HubSpot’s accordion).
- **Meta descriptions** — some product excerpts were >155 chars (now trimmed in generator).
- **`category.html`** — only Forms category page exists; SEO/AI/Dev Tools lack dedicated category URLs.
- **Reviews** — placeholder on GitHub products; acceptable for prototype.

### `noindex` coverage (good)

`404`, `sign-in`, `sign-up`, `account`, `reset-password`, `order-confirmation`, `wishlist`, `search` — correctly `noindex`.

---

## On-Page SEO — Score: 72/100

| Element | Status |
|---------|--------|
| Title tags | Pass — unique per page, brand suffix consistent |
| Meta descriptions | Pass (after trim) — most 100–160 chars |
| H1 | Pass — one H1 per plugin single |
| Heading hierarchy | Pass — H2 sections: Overview, Screenshots, Installation, FAQ |
| OG / Twitter cards | Pass — `summary_large_image`, OG images per product |

**Canonical / OG URL mismatch (staging):**

```html
<link rel="canonical" href="https://market.procoders.tech/plugins/singular-markdown/">
<meta property="og:url" content="https://market.procoders.tech/plugins/singular-markdown/">
```

Intentional for production launch, but **staging should not be indexed** without matching URLs or `noindex` sitewide.

---

## Schema / Structured Data — Score: 78/100

| Page type | Schema |
|-----------|--------|
| Homepage | `Organization`, `WebSite`, `WebPage`, `SearchAction` |
| Product singles | `SoftwareApplication`, `BreadcrumbList` |
| HubSpot | + `Offer` ($49 USD) |
| HubSpot ratings | `aggregateRating` when reviews > 0 |

### Recommendations

- Add `image` property to `SoftwareApplication` (hero/OG asset URL).
- Add `downloadUrl` / `sameAs` (WordPress.org or GitHub).
- Consider `Product` + `Offer` schema on all paid/free SKUs for richer results.
- JSON-LD breadcrumb category URL now follows product category (fixed in generator).

---

## Performance (CWV) — Score: N/A (estimated ~75)

PageSpeed Insights API returned rate limit during audit. Static HTML + CSS + deferred JS suggests:

- **Likely good LCP** on product pages (no heavy JS framework).
- **Risk:** Google Fonts CSS is render-blocking (`fonts.googleapis.com`).
- **Risk:** Multiple CSS files per page (`pcm-shared.css` + page CSS).

**Recommendation:** Self-host fonts or use `font-display: swap` + preload critical WOFF2; merge CSS for production.

---

## GEO / AI Search — Score: 42/100

| Check | Status |
|-------|--------|
| `/llms.txt` | Missing |
| AI crawler rules in robots | Missing (no robots file) |
| SSR content | Pass — full HTML in source |
| Citability | Moderate — overview prose is extractable; FAQ too thin |
| Passage structure | Moderate — H2 sections exist; few question-style headings |
| Brand entity | Pass — Organization schema links to procoders.tech |

---

## Images — Score: 70/100

- OG/WebP banner assets exist per product under `/assets/plugins/{slug}/`.
- Plugin **screenshot grid uses CSS placeholders**, not `<img alt="...">` — missed image SEO opportunity.
- No empty `alt=""` found in HTML templates.

---

## Sitemap Architecture

**Indexable URLs (recommended):**

| URL pattern | Count |
|-------------|-------|
| `/` | 1 |
| `/plugins`, `/docs`, `/support`, `/pricing`, `/how-it-works` | 5 |
| `/plugin-{slug}` | 10 |
| Legal: `/privacy`, `/terms`, `/refund` | 3 |
| `/category` (Forms) | 1 |
| **Total** | **20** |

Exclude: auth, wishlist, search, 404, order-confirmation.

---

## Assumptions (internal metacognition)

1. Prototype canonicals intentionally preview production URLs — confirm before indexing Vercel.
2. `market.procoders.tech` may not be live yet — staging audit reflects deploy gap, not final production state.
3. PageSpeed scores deferred due to API quota — re-run when quota resets.

---

*Generated via cursor-seo inline audit workflow (technical → content → schema → geo).*
