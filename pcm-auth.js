(function () {
  'use strict';

  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  function switchAuthStep(flow, step) {
    if (!flow) return;
    const stepNum = String(step);
    flow.dataset.activeStep = stepNum;
    flow.querySelectorAll('[data-auth-step]').forEach((el) => {
      const active = el.dataset.authStep === stepNum;
      el.classList.toggle('is-active', active);
      el.hidden = !active;
    });
  }

  function scorePassword(value) {
    if (!value) return 0;
    let score = 0;
    if (value.length >= 8) score += 1;
    if (value.length >= 12) score += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^a-zA-Z0-9]/.test(value)) score += 1;
    return Math.min(4, Math.max(1, score));
  }

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  function bindPasswordMeter(input, meter) {
    if (!input || !meter) return;
    const label = meter.querySelector('.password-meter__label')
      || (meter.parentElement && meter.parentElement.querySelector('.password-meter__label'));
    const update = () => {
      const score = scorePassword(input.value);
      meter.dataset.strength = input.value ? String(score) : '0';
      if (label) {
        label.textContent = input.value ? strengthLabels[score] || '' : '';
      }
    };
    input.addEventListener('input', update);
    update();
  }

  function bindPasswordToggle(wrap) {
    const input = wrap.querySelector('.form-input');
    const btn = wrap.querySelector('.password-toggle');
    if (!input || !btn) return;
    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.setAttribute('aria-pressed', show ? 'true' : 'false');
    });
  }

  function bindCodeInputs(group) {
    const inputs = Array.from(group.querySelectorAll('.code-input'));
    if (!inputs.length) return;

    inputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        const val = input.value.replace(/\D/g, '').slice(-1);
        input.value = val;
        if (val && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          inputs[index - 1].focus();
          inputs[index - 1].value = '';
        }
        if (e.key === 'ArrowLeft' && index > 0) {
          inputs[index - 1].focus();
        }
        if (e.key === 'ArrowRight' && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData)
          .getData('text')
          .replace(/\D/g, '')
          .slice(0, inputs.length);
        pasted.split('').forEach((ch, i) => {
          if (inputs[i]) inputs[i].value = ch;
        });
        const focusIdx = Math.min(pasted.length, inputs.length - 1);
        inputs[focusIdx].focus();
      });
    });
  }

  document.querySelectorAll('[data-auth-flow]').forEach((flow) => {
    const initial = flow.dataset.activeStep || '1';
    switchAuthStep(flow, initial);

    flow.querySelectorAll('[data-auth-goto]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        const step = trigger.dataset.authGoto;
        if (step) {
          e.preventDefault();
          switchAuthStep(flow, step);
        }
      });
    });

    const signUpForm = flow.querySelector('[data-auth-signup-form]');
    if (signUpForm) {
      signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = signUpForm.querySelector('[name="email"]');
        const echo = flow.querySelector('[data-auth-email-echo]');
        if (echo && emailInput) {
          echo.textContent = emailInput.value || 'you@company.com';
        }
        switchAuthStep(flow, '2');
      });
    }

    const signInForm = flow.querySelector('[data-auth-signin-form]');
    if (signInForm) {
      signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        switchAuthStep(flow, '2');
        const firstCode = flow.querySelector('.code-input');
        if (firstCode) firstCode.focus();
      });
    }

    const resetForm = flow.querySelector('[data-auth-reset-form]');
    if (resetForm) {
      resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = resetForm.querySelector('[name="email"]');
        const echo = flow.querySelector('[data-auth-email-echo]');
        if (echo && emailInput) {
          echo.textContent = emailInput.value || 'you@company.com';
        }
        switchAuthStep(flow, '2');
      });
    }

    const setPasswordForm = flow.querySelector('[data-auth-set-password-form]');
    if (setPasswordForm) {
      setPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const step = setPasswordForm.closest('[data-auth-step]');
        const formWrap = step && step.querySelector('.auth-step__form');
        const success = step && step.querySelector('.auth-step__success');
        if (formWrap) formWrap.classList.add('is-hidden');
        if (success) success.classList.add('is-visible');
      });
    }

    flow.querySelectorAll('.password-field').forEach(bindPasswordToggle);

    flow.querySelectorAll('[data-password-meter]').forEach((meter) => {
      const inputId = meter.dataset.passwordFor;
      const input = inputId ? document.getElementById(inputId) : meter.previousElementSibling;
      const target = input && input.classList.contains('form-input')
        ? input
        : meter.closest('.form-field') && meter.closest('.form-field').querySelector('.form-input');
      bindPasswordMeter(target, meter);
    });

    flow.querySelectorAll('.code-input-group').forEach(bindCodeInputs);
  });
})();
