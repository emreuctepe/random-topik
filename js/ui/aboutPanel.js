/* ============================================================================
   aboutPanel.js — sol sütun

   Şimdilik dictionary.js'teki aboutLine1..3 metinlerini alt alta basar.
   İleride görseldeki kartlara (renkli sol kenarlık, başlık + gövde) geçilecekse
   sadece bu dosya ve panel-about.css değişecek.
   ========================================================================== */

import { t, onLangChange } from '../core/i18n.js';

const LINE_KEYS = ['aboutLine1', 'aboutLine2', 'aboutLine3'];

export function createAboutPanel(root) {
  function render() {
    const fragment = document.createDocumentFragment();

    LINE_KEYS.forEach((key) => {
      const p = document.createElement('p');
      p.className = 'about__line';
      p.textContent = t(key);
      fragment.appendChild(p);
    });

    root.replaceChildren(fragment);
  }

  onLangChange(render);
  render();

  return { render };
}
