(function (global) {
  'use strict';

  var CATEGORY_SLUGS = {
    'e-commerce': 'E-commerce',
    seo: 'SEO',
    security: 'Security',
    performance: 'Performance',
    forms: 'Forms',
    membership: 'Membership',
    analytics: 'Analytics',
    ai: 'AI',
    'dev-tools': 'Dev Tools'
  };

  var SLUG_CATEGORY_MAP = {
    Forms: 'forms',
    SEO: 'seo',
    AI: 'ai',
    'Dev Tools': 'dev-tools'
  };

  var ACCENT_BY_CATEGORY = {
    Forms: 'plugin-card--accent-blue',
    SEO: 'plugin-card--accent-green',
    AI: 'plugin-card--accent-violet',
    'Dev Tools': 'plugin-card--accent-blue'
  };

  var BG_CLASSES = ['icon-bg-1', 'icon-bg-2', 'icon-bg-3', 'icon-bg-4', 'icon-bg-5'];

  var cache = null;
  var loadPromise = null;

  function decodeHtml(text) {
    if (!text) return '';
    var el = document.createElement('textarea');
    el.innerHTML = text;
    return el.value.replace(/\s+/g, ' ').trim();
  }

  function truncate(text, max) {
    var clean = decodeHtml(text);
    if (clean.length <= max) return clean;
    return clean.slice(0, max - 1).trim() + '…';
  }

  function pluginHref(slug) {
    return 'plugin-' + slug + '.html';
  }

  function mapProduct(product, index) {
    var hasPro = product.price && product.price.pro != null;
    var isFreeOnly = !hasPro && product.price && product.price.free;
    var rating = product.rating != null ? product.rating : 0;
    var reviews = product.reviews != null ? product.reviews : 0;
    var installs = product.installs != null ? product.installs : '—';
    var accent = ACCENT_BY_CATEGORY[product.category] || '';
    if (product.featured && product.category === 'Forms' && product.slug !== 'connect-cf7-to-hubspot') {
      accent = 'plugin-card--accent-violet';
    }

    return {
      id: product.slug,
      slug: product.slug,
      name: product.name,
      abbr: product.abbr,
      bg: BG_CLASSES[index % BG_CLASSES.length],
      rating: rating,
      reviews: reviews,
      price: hasPro ? '$' + product.price.pro : null,
      free: isFreeOnly || !hasPro,
      installs: installs,
      category: product.category,
      categorySlug: SLUG_CATEGORY_MAP[product.category] || product.category.toLowerCase().replace(/\s+/g, '-'),
      featured: !!product.featured,
      isNew: !!product.isNew,
      accent: accent,
      href: pluginHref(product.slug),
      excerpt: truncate(product.excerpt, 140),
      source: product.source,
      sourceUrl: product.sourceUrl,
      githubUrl: product.githubUrl,
      description: decodeHtml(product.description),
      testedUpTo: product.testedUpTo,
      requiresPhp: product.requiresPhp,
      assets: product.assets,
      visualMetaphor: product.visualMetaphor
    };
  }

  function load() {
    if (cache) return Promise.resolve(cache);
    if (loadPromise) return loadPromise;
    loadPromise = fetch('catalog.json')
      .then(function (res) {
        if (!res.ok) throw new Error('catalog.json fetch failed');
        return res.json();
      })
      .then(function (data) {
        cache = data.products.map(mapProduct);
        return cache;
      });
    return loadPromise;
  }

  function getAll() {
    return cache ? cache.slice() : [];
  }

  function getBySlug(slug) {
    if (!cache) return null;
    for (var i = 0; i < cache.length; i++) {
      if (cache[i].slug === slug) return cache[i];
    }
    return null;
  }

  function filterByCategory(categoryName) {
    return getAll().filter(function (p) { return p.category === categoryName; });
  }

  function categorySlugForName(name) {
    return SLUG_CATEGORY_MAP[name] || name.toLowerCase().replace(/\s+/g, '-');
  }

  global.PCMCatalog = {
    load: load,
    getAll: getAll,
    getBySlug: getBySlug,
    filterByCategory: filterByCategory,
    mapProduct: mapProduct,
    pluginHref: pluginHref,
    CATEGORY_SLUGS: CATEGORY_SLUGS,
    categorySlugForName: categorySlugForName,
    truncate: truncate,
    decodeHtml: decodeHtml
  };
})(typeof window !== 'undefined' ? window : globalThis);
