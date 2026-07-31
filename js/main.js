/* ============================================================================
   main.js — giriş noktası
   Parçaları birbirine bağlar. İş mantığı yok, sadece kurulum.
   ========================================================================== */

import { APP_VERSION, REPO_URL } from './core/config.js';
import { getLangMeta, onLangChange, t } from './core/i18n.js';
import * as logStore from './core/logStore.js';

import { createLangSwitcher } from './ui/langSwitcher.js';
import { createSlot } from './ui/slot.js';
import { createLogPanel } from './ui/logPanel.js';
import { createAboutPanel } from './ui/aboutPanel.js';

const $ = (id) => document.getElementById(id);

/* --- HTML'deki data-i18n / data-i18n-aria alanlarını doldur --- */
function applyStaticText() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });

  document.title = t('siteTitle');
  document.documentElement.lang = getLangMeta().html;
}

function init() {
  const againBtn = $('again');

  // Sürüm göstergesi dile bağlı değil, bir kez yazılır — aynı zamanda depo linki
  const versionEl = $('version');
  versionEl.textContent = `v${APP_VERSION}`;
  versionEl.href = REPO_URL;

  createAboutPanel($('about'));
  createLangSwitcher($('lang'));
  createLogPanel({ listEl: $('log-list'), emptyEl: $('log-empty') });

  const slot = createSlot({
    reelEl: $('slot-reel'),
    resultEl: $('slot-result'),

    // Dönerken "tekrar seç" pasif olsun (çift tetikleme olmasın)
    onStateChange: (spinning) => {
      againBtn.disabled = spinning;
    },

    // Slot durunca kayıt eklenir — metin o anki dilde donar
    onResult: ({ topicId, lang, text }) => {
      logStore.add({ topicId, lang, text });
    },
  });

  againBtn.addEventListener('click', () => slot.spin());

  onLangChange(applyStaticText);
  applyStaticText();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
