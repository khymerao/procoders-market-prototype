(function () {
  const mobileNav = document.getElementById('mobile-nav');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');

  if (!mobileNav || !menuToggle || !mobileNavPanel) return;

  let focusTrapHandler = null;
  let previousFocus = null;

  function getFocusable(container) {
    return container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  function openMobileNav() {
    previousFocus = document.activeElement;
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
    const focusable = getFocusable(mobileNavPanel);
    if (focusable.length) focusable[0].focus();
    focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;
      const items = getFocusable(mobileNavPanel);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', focusTrapHandler);
  }

  function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
    if (focusTrapHandler) {
      document.removeEventListener('keydown', focusTrapHandler);
      focusTrapHandler = null;
    }
    if (previousFocus) previousFocus.focus();
  }

  menuToggle.addEventListener('click', () => {
    mobileNav.classList.contains('is-open') ? closeMobileNav() : openMobileNav();
  });

  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) closeMobileNav();
  });

  mobileNavPanel.querySelectorAll('a.mobile-nav__link, a.mobile-nav__sub-link').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  document.querySelectorAll('[data-accordion]').forEach((acc) => {
    const btn = acc.querySelector('.mobile-nav__accordion-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = acc.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });

  /* GDPR cookie bar */
  const cookieBar = document.getElementById('cookie-bar');
  const cookieManage = document.getElementById('cookie-manage');
  const cookieManageBtn = document.getElementById('cookie-manage-btn');
  const cookieEssential = document.getElementById('cookie-essential');
  const cookieAccept = document.getElementById('cookie-accept');

  function syncCookieConsentState(consented) {
    document.documentElement.setAttribute('data-cookie-consent', consented ? 'yes' : 'pending');
    if (consented) {
      document.body.classList.remove('has-cookie-bar');
    } else {
      document.body.classList.add('has-cookie-bar');
    }
  }

  function hideCookieBar() {
    if (!cookieBar) return;
    cookieBar.hidden = true;
    syncCookieConsentState(true);
    try { localStorage.setItem('pcm-cookie-consent', '1'); } catch (_) {}
  }

  function showCookieBar() {
    if (!cookieBar) return;
    cookieBar.hidden = false;
    syncCookieConsentState(false);
    try { localStorage.removeItem('pcm-cookie-consent'); } catch (_) {}
  }

  if (cookieBar) {
    var consented = false;
    try { consented = !!localStorage.getItem('pcm-cookie-consent'); } catch (_) {}
    if (consented) {
      cookieBar.hidden = true;
      syncCookieConsentState(true);
    } else {
      cookieBar.hidden = false;
      syncCookieConsentState(false);
    }
    [cookieManage, cookieEssential, cookieAccept].forEach((el) => {
      if (el) el.addEventListener('click', hideCookieBar);
    });
    if (cookieManageBtn) cookieManageBtn.addEventListener('click', showCookieBar);
  }
})();
