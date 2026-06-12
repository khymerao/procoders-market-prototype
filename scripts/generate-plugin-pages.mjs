import fs from 'fs';

const catalog = JSON.parse(fs.readFileSync('catalog.json', 'utf8'));
const template = fs.readFileSync('plugin-connect-cf7-to-hubspot.html', 'utf8');

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decodeHtml(text) {
  return String(text || '')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function starsHtml(rating) {
  const n = Math.round(rating || 0);
  const svg = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  if (n <= 0) return '';
  return Array(n).fill(svg).join('');
}

function categoryBreadcrumb(category) {
  const map = {
    Forms: 'category.html',
    SEO: 'plugins.html',
    AI: 'plugins.html',
    'Dev Tools': 'plugins.html'
  };
  return { href: map[category] || 'plugins.html', label: category };
}

function buildCta(p) {
  const isHubSpot = p.slug === 'connect-cf7-to-hubspot';
  const isGithub = p.source === 'github';

  if (isHubSpot) {
    const block = `          <button type="button" class="btn btn--violet" data-checkout-trigger>Buy Pro — $49</button>
          <a href="${p.sourceUrl}" class="btn btn--green" target="_blank" rel="noopener">Download free</a>
          <a href="${p.sourceUrl}" class="link-muted" target="_blank" rel="noopener">View on WordPress.org</a>`;
    const mobile = `            <button type="button" class="btn btn--violet" data-checkout-trigger>Buy Pro — $49</button>
            <a href="${p.sourceUrl}" class="btn btn--green" target="_blank" rel="noopener">Download free</a>
            <a href="${p.sourceUrl}" class="link-muted" target="_blank" rel="noopener">View on WordPress.org</a>`;
    return {
      desktop: block,
      mobile,
      sticky: `    <button type="button" class="btn btn--violet" data-checkout-trigger>Buy Pro — $49</button>
    <a href="${p.sourceUrl}" class="btn btn--green" target="_blank" rel="noopener">Download free</a>`,
      hasCheckout: true,
      bodyClass: 'has-sticky-cta'
    };
  }
  if (isGithub) {
    const block = `          <a href="${p.githubUrl}" class="btn btn--blue" target="_blank" rel="noopener">View on GitHub</a>`;
    return {
      desktop: block,
      mobile: `            ${block.trim()}`,
      sticky: `    <a href="${p.githubUrl}" class="btn btn--blue" target="_blank" rel="noopener">View on GitHub</a>`,
      hasCheckout: false,
      bodyClass: 'has-sticky-cta'
    };
  }
  const block = `          <a href="${p.sourceUrl}" class="btn btn--green" target="_blank" rel="noopener">Download on WordPress.org</a>`;
  return {
    desktop: block,
    mobile: `            ${block.trim()}`,
    sticky: `    <a href="${p.sourceUrl}" class="btn btn--green" target="_blank" rel="noopener">Download on WordPress.org</a>`,
    hasCheckout: false,
    bodyClass: 'has-sticky-cta'
  };
}

function buildMetaHeader(p) {
  const stars = starsHtml(p.rating);
  if (p.rating > 0) {
    return `<span class="stars" aria-label="${p.rating} stars">${stars}</span>
            <span>${p.rating.toFixed(1)} (${p.reviews} review${p.reviews === 1 ? '' : 's'})</span>
            <span class="plugin-header__meta-sep" aria-hidden="true">·</span>
            <span>${p.installs} installs</span>`;
  }
  if (p.source === 'github') {
    return `<a href="${p.githubUrl}" target="_blank" rel="noopener">GitHub repository</a>`;
  }
  return `<span>Free plugin</span>`;
}

function buildMetaCard(p) {
  const isGithub = p.source === 'github';
  const installsRow = isGithub
    ? `<div class="meta-row"><span class="meta-row__label">Source</span><span class="meta-row__value"><a href="${p.githubUrl}" target="_blank" rel="noopener">GitHub</a></span></div>`
    : `<div class="meta-row"><span class="meta-row__label">Active installs</span><span class="meta-row__value">${p.installs}</span></div>`;

  const tested = p.testedUpTo
    ? `<div class="meta-row"><span class="meta-row__label">Tested up to</span><span class="meta-row__value">${p.testedUpTo}</span></div>`
    : '';
  const php = p.requiresPhp
    ? `<div class="meta-row"><span class="meta-row__label">PHP</span><span class="meta-row__value">${p.requiresPhp}+</span></div>`
    : '';
  const testedNote = p.testedUpTo
    ? `<p class="caption meta-tested-note">Tested up to WordPress ${p.testedUpTo}${p.requiresPhp ? ' with PHP ' + p.requiresPhp : ''}</p>`
    : '';

  const ratingBlock =
    p.rating > 0
      ? `
        <div class="meta-rating">
          <div class="meta-rating__head">
            <div class="meta-rating__score">${p.rating.toFixed(1)}</div>
            <span class="stars" aria-label="${p.rating} stars">${starsHtml(p.rating)}</span>
          </div>
          <div class="meta-rating__count">${p.reviews} rating${p.reviews === 1 ? '' : 's'}</div>
        </div>`
      : '';

  return `${installsRow}
        ${tested}
        ${php}
        ${testedNote}
        <div class="meta-tags">
          <span class="chip">${p.category.toLowerCase()}</span>
          <span class="chip">${p.source === 'github' ? 'github' : 'wordpress'}</span>
        </div>${ratingBlock}`;
}

function buildJsonLd(p) {
  const url = `https://market.procoders.tech/plugins/${p.slug}/`;
  const desc = decodeHtml(p.excerpt).slice(0, 200);
  const graph = [
    {
      '@type': 'SoftwareApplication',
      '@id': url + '#software',
      name: p.name,
      applicationCategory: 'WordPress Plugin',
      operatingSystem: 'WordPress',
      description: desc,
      author: { '@id': 'https://market.procoders.tech/#organization' },
      url
    }
  ];

  if (p.rating > 0 && p.reviews > 0) {
    graph[0].aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(p.rating),
      reviewCount: String(p.reviews),
      bestRating: '5',
      worstRating: '1'
    };
  }

  if (p.slug === 'connect-cf7-to-hubspot') {
    graph.push({
      '@type': 'Offer',
      '@id': url + '#offer',
      url,
      price: '49.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: { '@id': 'https://market.procoders.tech/#organization' }
    });
  }

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': url + '#breadcrumb',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://market.procoders.tech/' },
      { '@type': 'ListItem', position: 2, name: 'WordPress Plugins', item: 'https://market.procoders.tech/wordpress-plugins/' },
      { '@type': 'ListItem', position: 3, name: p.category, item: 'https://market.procoders.tech/categories/forms/' },
      { '@type': 'ListItem', position: 4, name: p.name, item: url }
    ]
  });

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function generatePage(p) {
  const url = `https://market.procoders.tech/plugins/${p.slug}/`;
  const ogImage =
    p.assets && p.assets.og
      ? `https://market.procoders.tech/${p.assets.og}`
      : 'https://market.procoders.tech/assets/og/procoders-market.png';
  const bc = categoryBreadcrumb(p.category);
  const cta = buildCta(p);
  const desc = esc(decodeHtml(p.excerpt));
  const overview = esc(decodeHtml(p.description).slice(0, 800));

  let html = template;

  html = html.replace(
    /<body data-auth="guest" class="[^"]*">/,
    `<body data-auth="guest" class="has-cookie-bar${cta.bodyClass ? ' ' + cta.bodyClass : ''}">`
  );

  html = html.replace(/<title>[^<]+<\/title>/, `<title>${esc(p.name)} — ProCoders Market</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/g, `<meta property="og:title" content="${esc(p.name)} — ProCoders Market">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/g, `<meta property="og:description" content="${desc}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${ogImage}">`);
  html = html.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${ogImage}">`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(p.name)} — ProCoders Market">`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${desc}">`);

  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n  ${buildJsonLd(p)}\n  </script>`
  );

  html = html.replace(
    /<nav class="breadcrumb"[\s\S]*?<\/nav>/,
    `<nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a><span>/</span>
        <a href="plugins.html">Plugins</a><span>/</span>
        <a href="${bc.href}">${bc.label}</a><span>/</span>
        <span class="breadcrumb__current">${esc(p.name)}</span>
      </nav>`
  );

  html = html.replace(
    /<div class="plugin-banner"[^>]*><\/div>/,
    `<div class="plugin-banner" data-slug="${p.slug}" role="img" aria-label="${esc(p.name)} banner"></div>`
  );

  html = html.replace(
    /<div class="plugin-header__icon[^>]*>CF7<\/div>/,
    `<div class="plugin-header__icon" aria-hidden="true">${esc(p.abbr)}</div>`
  );
  html = html.replace(
    /<h1 class="plugin-header__title">Connect CF7 to HubSpot<\/h1>/,
    `<h1 class="plugin-header__title">${esc(p.name)}</h1>`
  );

  html = html.replace(
    /<div class="plugin-header__meta">\s*<span>Built and supported[\s\S]*?<span>300\+ installs<\/span>\s*<\/div>/,
    `<div class="plugin-header__meta">
            <span>Built and supported by <a href="https://procoders.tech" rel="noopener">ProCoders</a></span>
            <span class="plugin-header__meta-sep" aria-hidden="true">·</span>
            <span class="chip">${p.category}</span>
            <span class="plugin-header__meta-sep" aria-hidden="true">·</span>
            ${buildMetaHeader(p)}
          </div>`
  );

  html = html.replace(
    /<div class="plugin-header__actions-mobile plugin-header__actions">[\s\S]*?<\/div>\s*<\/div>\s*<div class="plugin-header__actions-desktop/,
    `<div class="plugin-header__actions-mobile plugin-header__actions">
            ${cta.mobile}
          </div>
        </div>
        <div class="plugin-header__actions-desktop`
  );

  html = html.replace(
    /<div class="plugin-header__actions-desktop plugin-header__actions">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\n\s*<nav class="plugin-tabs"/,
    `<div class="plugin-header__actions-desktop plugin-header__actions">
          ${cta.desktop}
        </div>
      </div>
    </div>

    <nav class="plugin-tabs"`
  );

  html = html.replace(
    /<h2>What Connect CF7 to HubSpot Does<\/h2>/,
    `<h2>What ${esc(p.name)} Does</h2>`
  );
  html = html.replace(
    /<p>Connect CF7 to HubSpot by ProCoders connects[\s\S]*?<\/p>\s*<p>This plugin integrates with HubSpot[\s\S]*?<\/p>/,
    `<p>${overview}</p>`
  );

  if (p.slug !== 'connect-cf7-to-hubspot') {
    html = html.replace(
      /<h3>Features<\/h3>\s*<ul class="feature-list">[\s\S]*?<\/ul>/,
      `<h3>Overview</h3>
            <p>${esc(decodeHtml(p.excerpt))}</p>`
    );
    if (!p.reviews) {
      html = html.replace(
        /<section id="reviews"[\s\S]*?<\/section>/,
        `<section id="reviews" data-od-id="reviews">
          <h2>Reviews</h2>
          <p class="caption">No reviews yet — ${p.source === 'github' ? 'star the repo on GitHub' : 'be the first to review on WordPress.org'}.</p>
        </section>`
      );
    }
    html = html.replace(
      /<section id="changelog"[\s\S]*?<\/section>/,
      `<section id="changelog" data-od-id="changelog">
          <h2>Changelog</h2>
          <p class="caption">See ${p.source === 'github' ? `<a href="${p.githubUrl}" target="_blank" rel="noopener">release notes on GitHub</a>` : `<a href="${p.sourceUrl}" target="_blank" rel="noopener">WordPress.org changelog</a>`} for version history.</p>
        </section>`
    );
    html = html.replace(
      /<section id="faq"[\s\S]*?<\/section>/,
      `<section id="faq" data-od-id="faq">
          <h2>FAQ</h2>
          <div class="prose"><p>Documentation and support for ${esc(p.name)} are maintained by ProCoders. Visit <a href="docs.html">docs</a> or <a href="support.html">support</a> for help.</p></div>
        </section>`
    );
    if (!cta.hasCheckout) {
      html = html.replace(/<div class="checkout-overlay"[\s\S]*?<\/div>\s*\n\s*<!-- 12\. Footer -->/, '<!-- 12. Footer -->');
    }
  }

  html = html.replace(
    /<div class="meta-row"><span class="meta-row__label">Version[\s\S]*?<div class="meta-support">/,
    `<div class="meta-row"><span class="meta-row__label">Author</span><span class="meta-row__value">ProCoders</span></div>
        ${buildMetaCard(p)}
        <div class="meta-support">`
  );

  html = html.replace(
    /<div class="sticky-cta"[\s\S]*?<\/div>/,
    cta.sticky ? `<div class="sticky-cta" aria-label="Purchase actions">\n    ${cta.sticky}\n  </div>` : ''
  );

  html = html.replace(/plugin\.html#changelog/g, `plugin-${p.slug}.html#changelog`);

  fs.writeFileSync(`plugin-${p.slug}.html`, html);
  console.log('Wrote plugin-' + p.slug + '.html');
}

catalog.products.forEach(generatePage);
