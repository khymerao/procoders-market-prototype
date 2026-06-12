(function () {
  const TIER_DATA = {
    annual: { label: 'Annual', price: '$49.00', period: '/year', total: '$49.00' },
    lifetime: { label: 'Lifetime', price: '$149.00', period: ' once', total: '$149.00' }
  };

  function getFocusableIn(el) {
    return el.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  /* ── Checkout overlay (plugin page) ── */
  const overlay = document.getElementById('checkout-overlay');
  if (overlay) {
    const panel = overlay.querySelector('.checkout-panel');
    const triggers = document.querySelectorAll('[data-checkout-trigger]');
    const closeEls = overlay.querySelectorAll('[data-checkout-close]');
    const stepEls = overlay.querySelectorAll('[data-checkout-step]');
    const stepIndicators = overlay.querySelectorAll('[data-checkout-step-indicator]');
    const tierInputs = overlay.querySelectorAll('input[name="checkout-tier"]');
    const tierCards = overlay.querySelectorAll('.checkout-tier');
    const nextBtn = overlay.querySelector('[data-checkout-next]');
    const backBtn = overlay.querySelector('[data-checkout-back]');
    const stripeBtn = document.getElementById('checkout-stripe');
    const summaryTier = document.getElementById('checkout-summary-tier');
    const summaryPrice = document.getElementById('checkout-summary-price');
    const summaryTotal = document.getElementById('checkout-summary-total');
    let currentStep = 1;
    let focusTrap = null;
    let prevFocus = null;

    function getSelectedTier() {
      const checked = overlay.querySelector('input[name="checkout-tier"]:checked');
      return checked ? checked.value : 'annual';
    }

    function updateTierUI() {
      const tier = getSelectedTier();
      const data = TIER_DATA[tier] || TIER_DATA.annual;
      tierCards.forEach((card) => {
        const input = card.querySelector('input[name="checkout-tier"]');
        card.classList.toggle('is-selected', input && input.checked);
      });
      if (summaryTier) summaryTier.textContent = data.label;
      if (summaryPrice) summaryPrice.textContent = data.price + data.period;
      if (summaryTotal) summaryTotal.textContent = data.total;
    }

    function goToStep(step) {
      currentStep = step;
      stepEls.forEach((el) => {
        const n = Number(el.dataset.checkoutStep);
        el.hidden = n !== step;
      });
      stepIndicators.forEach((el) => {
        const n = Number(el.dataset.checkoutStepIndicator);
        el.classList.toggle('is-active', n === step);
        el.classList.toggle('is-done', n < step);
      });
    }

    function openCheckout() {
      prevFocus = document.activeElement;
      overlay.hidden = false;
      document.body.classList.add('checkout-open');
      goToStep(1);
      updateTierUI();
      const focusable = getFocusableIn(panel);
      if (focusable.length) focusable[0].focus();
      focusTrap = (e) => {
        if (e.key === 'Escape') { closeCheckout(); return; }
        if (e.key !== 'Tab') return;
        const items = getFocusableIn(panel);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      };
      document.addEventListener('keydown', focusTrap);
    }

    function closeCheckout() {
      overlay.hidden = true;
      document.body.classList.remove('checkout-open');
      if (focusTrap) {
        document.removeEventListener('keydown', focusTrap);
        focusTrap = null;
      }
      if (prevFocus) prevFocus.focus();
    }

    triggers.forEach((btn) => btn.addEventListener('click', openCheckout));
    closeEls.forEach((el) => el.addEventListener('click', closeCheckout));
    overlay.querySelector('.checkout-overlay__backdrop')?.addEventListener('click', closeCheckout);

    tierInputs.forEach((input) => {
      input.addEventListener('change', updateTierUI);
    });

    tierCards.forEach((card) => {
      card.addEventListener('click', () => {
        const input = card.querySelector('input[name="checkout-tier"]');
        if (input) {
          input.checked = true;
          updateTierUI();
        }
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateTierUI();
        goToStep(2);
        const email = overlay.querySelector('#checkout-email');
        if (email) email.focus();
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => goToStep(1));
    }

    if (stripeBtn) {
      stripeBtn.addEventListener('click', () => {
        const tier = getSelectedTier();
        window.location.href = 'order-confirmation.html?tier=' + encodeURIComponent(tier);
      });
    }
  }

  /* ── Order confirmation page ── */
  const confirmTierEl = document.getElementById('confirm-tier');
  if (confirmTierEl) {
    const params = new URLSearchParams(window.location.search);
    const tier = params.get('tier') === 'lifetime' ? 'lifetime' : 'annual';
    const data = TIER_DATA[tier];

    confirmTierEl.textContent = data.label;
    const confirmPrice = document.getElementById('confirm-price');
    const confirmTotal = document.getElementById('confirm-total');
    if (confirmPrice) confirmPrice.textContent = data.price + data.period;
    if (confirmTotal) confirmTotal.textContent = data.total;

    const revealModal = document.getElementById('reveal-modal');
    const revealPassword = document.getElementById('reveal-password');
    const revealCancel = document.getElementById('reveal-cancel');
    const revealConfirm = document.getElementById('reveal-confirm');
    const revealBtn = document.getElementById('confirm-reveal-key');
    const copyBtn = document.getElementById('confirm-copy-key');
    const keyEl = document.getElementById('confirm-license-key');
    let revealTarget = null;
    let modalFocusTrap = null;
    let modalPrevFocus = null;

    function openRevealModal() {
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

    if (revealBtn && keyEl) {
      revealBtn.addEventListener('click', () => {
        if (keyEl.classList.contains('is-revealed')) {
          keyEl.textContent = keyEl.dataset.masked;
          keyEl.classList.remove('is-revealed');
          revealBtn.textContent = 'Reveal';
          return;
        }
        openRevealModal();
      });
    }

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

    if (copyBtn && keyEl) {
      copyBtn.addEventListener('click', async () => {
        const text = keyEl.classList.contains('is-revealed') ? keyEl.dataset.key : keyEl.dataset.masked;
        try {
          await navigator.clipboard.writeText(text);
          const orig = copyBtn.textContent;
          copyBtn.textContent = 'Copied';
          setTimeout(() => { copyBtn.textContent = orig; }, 2000);
        } catch (_) {
          copyBtn.textContent = 'Copy failed';
          setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
        }
      });
    }
  }
})();
