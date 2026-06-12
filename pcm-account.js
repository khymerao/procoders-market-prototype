(function () {
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* Account dropdown — supports header + mobile instances */
  document.querySelectorAll('.account-menu').forEach((accountMenu) => {
    const accountTrigger = accountMenu.querySelector('.account-menu__trigger');
    const accountPanel = accountMenu.querySelector('.account-menu__panel');
    if (!accountTrigger || !accountPanel) return;

    accountTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = accountTrigger.getAttribute('aria-expanded') === 'true';
      accountTrigger.setAttribute('aria-expanded', String(!open));
      accountPanel.hidden = open;
    });

    document.addEventListener('click', (e) => {
      if (!accountMenu.contains(e.target)) {
        accountTrigger.setAttribute('aria-expanded', 'false');
        accountPanel.hidden = true;
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && accountTrigger.getAttribute('aria-expanded') === 'true') {
        accountTrigger.setAttribute('aria-expanded', 'false');
        accountPanel.hidden = true;
        accountTrigger.focus();
      }
    });
  });

  /* Account tabs */
  const allTabs = document.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll('.account-panel');

  function switchTab(tabId) {
    allTabs.forEach((tab) => {
      const active = tab.dataset.tab === tabId;
      tab.setAttribute('aria-selected', active);
    });
    panels.forEach((panel) => {
      const active = panel.id === 'panel-' + tabId;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  }

  allTabs.forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  /* Details toggles */
  document.querySelectorAll('[data-details-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.classList.toggle('is-open', !open);
    });
  });

  /* Reveal key modal */
  const revealModal = document.getElementById('reveal-modal');
  const revealPassword = document.getElementById('reveal-password');
  const revealCancel = document.getElementById('reveal-cancel');
  const revealConfirm = document.getElementById('reveal-confirm');
  let revealTarget = null;
  let modalFocusTrap = null;
  let modalPrevFocus = null;

  function getFocusableIn(el) {
    return el.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  function openRevealModal(keyEl) {
    if (!revealModal || !revealPassword) return;
    revealTarget = keyEl;
    modalPrevFocus = document.activeElement;
    revealModal.hidden = false;
    revealPassword.value = '';
    revealPassword.focus();
    modalFocusTrap = (e) => {
      if (e.key === 'Escape') { closeRevealModal(); return; }
      if (e.key !== 'Tab') return;
      const items = getFocusableIn(revealModal);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', modalFocusTrap);
  }

  function closeRevealModal() {
    if (!revealModal) return;
    revealModal.hidden = true;
    revealTarget = null;
    if (modalFocusTrap) {
      document.removeEventListener('keydown', modalFocusTrap);
      modalFocusTrap = null;
    }
    if (modalPrevFocus) modalPrevFocus.focus();
  }

  document.querySelectorAll('.reveal-key-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pcm-license-card');
      const keyEl = card && card.querySelector('[data-key]');
      if (!keyEl) return;
      if (btn.textContent.trim() === 'Hide') {
        keyEl.textContent = keyEl.dataset.masked;
        keyEl.classList.remove('is-revealed');
        btn.textContent = 'Reveal';
        return;
      }
      openRevealModal(keyEl);
    });
  });

  if (revealCancel) revealCancel.addEventListener('click', closeRevealModal);
  if (revealModal) {
    revealModal.addEventListener('click', (e) => {
      if (e.target === revealModal) closeRevealModal();
    });
  }
  if (revealConfirm) {
    revealConfirm.addEventListener('click', () => {
      if (revealPassword && revealPassword.value.length > 0 && revealTarget) {
        revealTarget.textContent = revealTarget.dataset.key;
        revealTarget.classList.add('is-revealed');
        const card = revealTarget.closest('.pcm-license-card');
        const revealBtn = card && card.querySelector('.reveal-key-btn');
        if (revealBtn) revealBtn.textContent = 'Hide';
        closeRevealModal();
      } else if (revealPassword) {
        revealPassword.classList.add('is-error');
        revealPassword.focus();
      }
    });
  }
  if (revealPassword) {
    revealPassword.addEventListener('input', () => revealPassword.classList.remove('is-error'));
  }
})();
