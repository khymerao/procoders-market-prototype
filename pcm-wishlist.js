(function () {
  'use strict';

  var grid = document.getElementById('wishlist-grid');
  var empty = document.getElementById('wishlist-empty');
  if (!grid || !empty) return;

  function getItems() {
    return grid.querySelectorAll('[data-wishlist-item]');
  }

  function updateBadges(count) {
    var label = count === 1 ? 'Wishlist, 1 item' : 'Wishlist, ' + count + ' items';
    document.querySelectorAll('.wishlist-btn').forEach(function (btn) {
      btn.setAttribute('aria-label', count ? label : 'Wishlist');
      var badge = btn.querySelector('.wishlist-btn__badge');
      if (!badge) return;
      if (count > 0) {
        badge.textContent = String(count);
        badge.hidden = false;
      } else {
        badge.textContent = '';
        badge.hidden = true;
      }
    });
  }

  function syncEmptyState() {
    var count = getItems().length;
    var isEmpty = count === 0;
    grid.classList.toggle('is-empty', isEmpty);
    empty.classList.toggle('is-visible', isEmpty);
    updateBadges(count);
  }

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.wishlist-item__remove');
    if (!btn) return;
    var item = btn.closest('[data-wishlist-item]');
    if (!item) return;
    item.classList.add('is-removing');
    window.setTimeout(function () {
      item.remove();
      syncEmptyState();
    }, 280);
  });

  syncEmptyState();
})();
