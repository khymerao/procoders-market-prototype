(function () {
  'use strict';

  var starSvg = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  var installSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>';

  var SEARCH_CATALOG = [];

  function renderPluginCard(p) {
    var categoryTag = p.category ? '<span class="plugin-card__tag">' + p.category.toLowerCase() + '</span>' : '';
    var featuredTag = p.featured ? '<span class="plugin-card__tag plugin-card__tag--featured">Team pick</span>' : '';
    var excerpt = p.excerpt ? '<p class="plugin-card__excerpt">' + p.excerpt + '</p>' : '';
    var priceStat = p.free
      ? '<span class="plugin-card__stat plugin-card__stat--free">Free</span>'
      : '<span class="plugin-card__stat plugin-card__stat--price">' + p.price + '</span>';
    var accent = p.accent ? ' ' + p.accent : '';
    var ratingDisplay = p.rating > 0 ? p.rating : '—';
    var installsDisplay = p.installs || '—';
    return (
      '<article><a href="' + p.href + '" class="plugin-card plugin-card--grid' + accent + '" data-featured="' + p.featured + '" data-free="' + p.free + '" data-new="' + p.isNew + '">' +
      '<div class="plugin-card__head">' + PCMCatalog.renderCardIcon(p) +
      '<div class="plugin-card__meta"><h3>' + p.name + '</h3>' +
      '<div class="plugin-card__stats"><span class="plugin-card__stat plugin-card__stat--rating">' + starSvg + ' ' + ratingDisplay + '</span>' +
      '<span class="plugin-card__stat plugin-card__stat--installs">' + installSvg + ' ' + installsDisplay + '</span>' + priceStat +
      '</div></div></div>' + excerpt +
      '<div class="plugin-card__tags">' + categoryTag + featuredTag + '</div></a></article>'
    );
  }

  function filterCatalog(query, categorySlug) {
    var q = (query || '').trim().toLowerCase();
    var categoryName = categorySlug ? PCMCatalog.CATEGORY_SLUGS[categorySlug.toLowerCase()] : '';

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
        summaryEl.textContent = results.length + ' result' + (results.length === 1 ? '' : 's') + ' for “' + query + '” in ' + (PCMCatalog.CATEGORY_SLUGS[category] || category);
      } else if (query) {
        summaryEl.textContent = results.length + ' result' + (results.length === 1 ? '' : 's') + ' for “' + query + '”';
      } else {
        summaryEl.textContent = results.length + ' plugin' + (results.length === 1 ? '' : 's') + ' in ' + (PCMCatalog.CATEGORY_SLUGS[category] || category);
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
    PCMCatalog.load().then(function (catalog) {
      SEARCH_CATALOG = catalog;
      renderSearchPage();
    });
  });
})();
