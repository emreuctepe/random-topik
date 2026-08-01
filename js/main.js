/* ============================================================================
   main.js — giriş noktası
   Parçaları birbirine bağlar. İş mantığı yok, sadece kurulum.
   ========================================================================== */

import { APP_VERSION, REPO_URL } from './core/config.js';
import { getLangMeta, onLangChange, t } from './core/i18n.js';
import * as logStore from './core/logStore.js';
import * as collectionStore from './core/collectionStore.js';

import { createLangSwitcher } from './ui/langSwitcher.js';
import { createSlot } from './ui/slot.js';
import { createLogPanel } from './ui/logPanel.js';
import { createAboutPanel } from './ui/aboutPanel.js';
import { createCollectionPanel } from './ui/collectionPanel.js';
import { createTabs } from './ui/tabs.js';
import { createScrollRail } from './ui/scrollRail.js';

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
  createCollectionPanel({ gridEl: $('collection'), countEl: $('collection-count') });

  // Masaüstündeki üçlü sekme (mobilde CSS gizliyor).
  // İlk sıradaki sekme açılışta seçili gelir.
  createTabs({
    rootEl: $('tabs'),
    items: [
      { paneId: 'pane-collection', labelKey: 'collectionTitle' },
      { paneId: 'pane-log',        labelKey: 'logTitle' },
      { paneId: 'pane-about',      labelKey: 'aboutTitle' },
    ],
  });

  const slot = createSlot({
    reelEl: $('slot-reel'),
    resultEl: $('slot-result'),

    // Dönerken "tekrar seç" pasif olsun (çift tetikleme olmasın)
    onStateChange: (spinning) => {
      againBtn.disabled = spinning;
    },

    // Slot durunca hem kayıt eklenir (metin o anki dilde donar)
    // hem de konu koleksiyonda işaretlenir
    onResult: ({ topicId, lang, text }) => {
      logStore.add({ topicId, lang, text });
      collectionStore.markSeen(topicId);
    },
  });

  // Mobildeki kaydırma göstergesi — her panel geçişinde rengi yenilenir
  createScrollRail({
    scrollerEl: document.querySelector('.app'),
    railEl: $('scroll-rail'),
    thumbEl: $('scroll-rail-thumb'),
    panelSelector: '.panel--main, .pane',
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
