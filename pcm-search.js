(function () {
  'use strict';

  var starSvg = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  var installSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>';

  var CATEGORY_SLUGS = {
    'e-commerce': 'E-commerce',
    seo: 'SEO',
    security: 'Security',
    performance: 'Performance',
    forms: 'Forms',
    membership: 'Membership',
    analytics: 'Analytics',
    'dev-tools': 'Dev Tools'
  };

  var SEARCH_CATALOG = [
    { id: 'cf7hubspot', name: 'Connect CF7 to HubSpot', abbr: 'CF7', bg: 'icon-bg-1', rating: 5.0, reviews: 2, price: '$49', free: false, installs: '300+', category: 'Forms', featured: true, isNew: false, accent: 'plugin-card--accent-blue', href: 'plugin.html', excerpt: 'Sync Contact Form 7 submissions to HubSpot contacts and deals.' },
    { id: 'formcraft', name: 'FormCraft Elite', abbr: 'FC', bg: 'icon-bg-2', rating: 4.9, reviews: 218, price: '$59', free: false, installs: '8k', category: 'Forms', featured: true, isNew: false, accent: 'plugin-card--accent-violet', href: 'plugins.html', excerpt: 'Advanced forms with conditional logic API and field validation hooks.' },
    { id: 'formlogic', name: 'FormLogic API', abbr: 'FL', bg: 'icon-bg-5', rating: 4.7, reviews: 45, price: '$39', free: false, installs: '2k', category: 'Forms', featured: false, isNew: true, accent: '', href: 'plugins.html', excerpt: 'REST API layer for custom form endpoints and webhook routing.' },
    { id: 'smartforms', name: 'SmartForms Lite', abbr: 'SF', bg: 'icon-bg-3', rating: 4.6, reviews: 89, price: null, free: true, installs: '5k', category: 'Forms', featured: false, isNew: false, accent: 'plugin-card--accent-green', href: 'plugins.html', excerpt: 'Drag-and-drop form builder with spam protection and email alerts.' },
    { id: 'seopulse', name: 'SEO Pulse', abbr: 'SP', bg: 'icon-bg-5', rating: 4.7, reviews: 156, price: '$29', free: false, installs: '6k', category: 'SEO', featured: false, isNew: false, accent: '', href: 'plugins.html', excerpt: 'Real-time SEO scoring and schema markup for posts and pages.' },
    { id: 'shieldgate', name: 'ShieldGate Security', abbr: 'SG', bg: 'icon-bg-3', rating: 4.8, reviews: 891, price: null, free: true, installs: '18k', category: 'Security', featured: true, isNew: false, accent: 'plugin-card--accent-green', href: 'plugins.html', excerpt: 'Firewall, malware scan, and login hardening for production sites.' },
    { id: 'webpilot', name: 'WebPilot Analytics', abbr: 'WP', bg: 'icon-bg-4', rating: 4.6, reviews: 94, price: '$39', free: false, installs: '4k', category: 'Analytics', featured: false, isNew: false, accent: '', href: 'plugins.html', excerpt: 'Privacy-first analytics dashboard with custom event tracking.' },
    { id: 'memberstack', name: 'MemberStack Pro', abbr: 'MS', bg: 'icon-bg-2', rating: 4.8, reviews: 203, price: '$79', free: false, installs: '5k', category: 'Membership', featured: true, isNew: false, accent: 'plugin-card--accent-violet', href: 'plugins.html', excerpt: 'Membership tiers, gated content, and subscription billing for WP.' },
    { id: 'devkit', name: 'DevKit CLI', abbr: 'DK', bg: 'icon-bg-1', rating: 4.9, reviews: 67, price: null, free: true, installs: '9k', category: 'Dev Tools', featured: true, isNew: false, accent: 'plugin-card--accent-blue', href: 'plugins.html', excerpt: 'WP-CLI extensions and local dev helpers for plugin authors.' },
    { id: 'cartflow', name: 'CartFlow Boost', abbr: 'CB', bg: 'icon-bg-4', rating: 4.5, reviews: 112, price: '$45', free: false, installs: '3k', category: 'E-commerce', featured: false, isNew: false, accent: '', href: 'plugins.html', excerpt: 'Checkout funnel optimization and abandoned cart recovery for WooCommerce.' },
    { id: 'edgecache', name: 'EdgeCache CDN', abbr: 'EC', bg: 'icon-bg-1', rating: 4.8, reviews: 124, price: '$39', free: false, installs: '7k', category: 'Performance', featured: true, isNew: true, accent: 'plugin-card--accent-blue', href: 'plugins.html', excerpt: 'Edge caching and CDN purge hooks for high-traffic WordPress sites.' },
    { id: 'minifypro', name: 'MinifyPro', abbr: 'MP', bg: 'icon-bg-5', rating: 4.7, reviews: 88, price: '$29', free: false, installs: '5k', category: 'Performance', featured: false, isNew: true, accent: '', href: 'plugins.html', excerpt: 'CSS/JS minification and critical path optimization for Core Web Vitals.' },
    { id: 'webhook', name: 'Webhook Sync', abbr: 'WS', bg: 'icon-bg-4', rating: 4.8, reviews: 34, price: '$29', free: false, installs: '1.2k', category: 'Forms', featured: false, isNew: false, accent: '', href: 'plugins.html', excerpt: 'Push form submissions to any endpoint with retry and payload mapping.' },
    { id: 'mailchimp', name: 'MailChimp Bridge', abbr: 'MC', bg: 'icon-bg-2', rating: 4.5, reviews: 67, price: null, free: true, installs: '3k', category: 'Forms', featured: false, isNew: false, accent: 'plugin-card--accent-green', href: 'plugins.html', excerpt: 'Subscribe form users to MailChimp lists with double opt-in support.' }
  ];

  function renderPluginCard(p) {
    var categoryTag = p.category ? '<span class="plugin-card__tag">' + p.category.toLowerCase() + '</span>' : '';
    var featuredTag = p.featured ? '<span class="plugin-card__tag plugin-card__tag--featured">Team pick</span>' : '';
    var excerpt = p.excerpt ? '<p class="plugin-card__excerpt">' + p.excerpt + '</p>' : '';
    var priceStat = p.free
      ? '<span class="plugin-card__stat plugin-card__stat--free">Free</span>'
      : '<span class="plugin-card__stat plugin-card__stat--price">' + p.price + '</span>';
    var accent = p.accent ? ' ' + p.accent : '';
    return (
      '<article><a href="' + p.href + '" class="plugin-card plugin-card--grid' + accent + '" data-featured="' + p.featured + '" data-free="' + p.free + '" data-new="' + p.isNew + '">' +
      '<div class="plugin-card__head"><div class="plugin-card__icon ' + p.bg + '">' + p.abbr + '</div>' +
      '<div class="plugin-card__meta"><h3>' + p.name + '</h3>' +
      '<div class="plugin-card__stats"><span class="plugin-card__stat plugin-card__stat--rating">' + starSvg + ' ' + p.rating + '</span>' +
      '<span class="plugin-card__stat plugin-card__stat--installs">' + installSvg + ' ' + p.installs + '</span>' + priceStat +
      '</div></div></div>' + excerpt +
      '<div class="plugin-card__tags">' + categoryTag + featuredTag + '</div></a></article>'
    );
  }

  function filterCatalog(query, categorySlug) {
    var q = (query || '').trim().toLowerCase();
    var categoryName = categorySlug ? CATEGORY_SLUGS[categorySlug.toLowerCase()] : '';

    return SEARCH_CATALOG.filter(function (p) {
      if (categoryName && p.category !== categoryName) return false;
      if (!q) return true;
      var haystack = (p.name + ' ' + p.excerpt + ' ' + p.category).toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
  }

  function initHeaderSearch() {
    document.querySelectorAll('.header__search, .mobile-nav__search').forEach(function (el) {
      if (el.tagName === 'FORM') return;
      var input = el.querySelector('input[type="search"]');
      if (!input) return;
      var form = document.createElement('form');
      form.className = el.className;
      form.setAttribute('action', 'search.html');
      form.setAttribute('method', 'get');
      form.setAttribute('role', 'search');
      while (el.firstChild) form.appendChild(el.firstChild);
      if (!input.getAttribute('name')) input.setAttribute('name', 'q');
      el.parentNode.replaceChild(form, el);
    });
  }

  function applySearchIndexing(query, category) {
    var hasFilter = !!(query && query.trim()) || !!(category && category.trim());
    var robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', hasFilter ? 'noindex,follow' : 'index,follow');
  }

  function renderSearchPage() {
    var page = document.getElementById('search-page');
    if (!page) return;

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var category = params.get('category') || '';

    applySearchIndexing(query, category);

    var form = document.getElementById('search-form');
    if (form) {
      var qInput = form.querySelector('input[name="q"]');
      var catSelect = form.querySelector('select[name="category"]');
      if (qInput) qInput.value = query;
      if (catSelect) catSelect.value = category;
    }

    var results = filterCatalog(query, category);
    var resultsEl = document.getElementById('search-results');
    var emptyEl = document.getElementById('search-empty');
    var summaryEl = document.getElementById('search-summary');

    if (summaryEl) {
      if (!query && !category) {
        summaryEl.textContent = 'Showing all ' + SEARCH_CATALOG.length + ' ProCoders plugins';
      } else if (query && category) {
        summaryEl.textContent = results.length + ' result' + (results.length === 1 ? '' : 's') + ' for “' + query + '” in ' + (CATEGORY_SLUGS[category] || category);
      } else if (query) {
        summaryEl.textContent = results.length + ' result' + (results.length === 1 ? '' : 's') + ' for “' + query + '”';
      } else {
        summaryEl.textContent = results.length + ' plugin' + (results.length === 1 ? '' : 's') + ' in ' + (CATEGORY_SLUGS[category] || category);
      }
    }

    if (results.length === 0) {
      if (resultsEl) {
        resultsEl.innerHTML = '';
        resultsEl.classList.add('is-hidden');
        resultsEl.classList.remove('pcm-grid-skeleton', 'pcm-grid-skeleton--pulse');
      }
      if (emptyEl) emptyEl.classList.add('is-visible');
    } else {
      if (resultsEl) {
        resultsEl.innerHTML = results.map(renderPluginCard).join('');
        resultsEl.classList.remove('is-hidden', 'pcm-grid-skeleton', 'pcm-grid-skeleton--pulse');
      }
      if (emptyEl) emptyEl.classList.remove('is-visible');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderSearch();
    renderSearchPage();
  });
})();
