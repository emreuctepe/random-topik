/* ============================================================================
   tabs.js — masaüstündeki sekme çubuğu (Koleksiyon / Kayıt / Hakkında)

   Sekmeler yalnızca masaüstünde görünür. Mobilde CSS onları gizler ve her
   bölme ayrı bir tam ekran panel olarak alt alta dizilir (layout.css),
   o yüzden burada mobil için özel bir iş yapılmıyor.

   Klavye: ← → ile sekmeler arasında gezilir, Home/End uçlara gider.
   ========================================================================== */

import { t, onLangChange } from '../core/i18n.js';

const ACTIVE_PANE = 'pane--active';

/**
 * @param {object} options
 * @param {HTMLElement} options.rootEl sekme çubuğunun basılacağı eleman
 * @param {Array<{paneId: string, labelKey: string}>} options.items
 */
export function createTabs({ rootEl, items }) {
  rootEl.innerHTML = '';
  rootEl.setAttribute('role', 'tablist');

  const buttons = items.map((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tab';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', item.paneId);
    button.dataset.paneId = item.paneId;
    button.dataset.labelKey = item.labelKey;
    button.tabIndex = index === 0 ? 0 : -1;

    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', (event) => onKeydown(event, index));

    rootEl.appendChild(button);
    return button;
  });

  function select(index, { focus = false } = {}) {
    buttons.forEach((button, i) => {
      const isActive = i === index;
      button.setAttribute('aria-selected', String(isActive));
      button.tabIndex = isActive ? 0 : -1;

      const pane = document.getElementById(button.dataset.paneId);
      if (pane) pane.classList.toggle(ACTIVE_PANE, isActive);
    });

    if (focus) buttons[index].focus();
  }

  function onKeydown(event, index) {
    const last = buttons.length - 1;
    let next = null;

    switch (event.key) {
      case 'ArrowRight': next = index === last ? 0 : index + 1; break;
      case 'ArrowLeft':  next = index === 0 ? last : index - 1; break;
      case 'Home':       next = 0; break;
      case 'End':        next = last; break;
      default: return;
    }

    event.preventDefault();
    select(next, { focus: true });
  }

  function syncLabels() {
    buttons.forEach((button) => { button.textContent = t(button.dataset.labelKey); });
  }

  onLangChange(syncLabels);
  syncLabels();
  select(0);

  return { select };
}
