/* ============================================================================
   slot.js — slot (reel) motoru

   MANTIK
   Slot, önceden hazırlanmış sabit bir şerit DEĞİL. Sonsuz uzunlukta,
   indekslenmiş bir kuyruk gibi düşün:

        ...  n-2   n-1   [n]   n+1   n+2  ...
                          ^ merkez (offset)

   • Bir indeks İLK KEZ görünür alana girdiğinde üretilir ve o anki dille
     dondurulur (items Map'i).
   • Dil dönerken değişirse animasyon HİÇBİR ŞEKİLDE durdurulmaz. Ekranda
     hazır olan 1-2 satır eski dilde kalır, sonraki üretilecek satırlar yeni
     dilde gelir → istenen "birkaç adım sonra dile geçme" hissi.
   • Son birkaç adım (SPIN.tailLock) ve duruş anındaki merkez satır her zaman
     güncel dile çevrilir → sonuç asla yanlış dilde kalmaz.
   • Slot dururken dil değişirse görünen satırlar anında güncellenir.

   DOM'da sadece 5 satır tutulur (merkez ± 2), satırlar geri dönüştürülür.
   ========================================================================== */

import { SPIN } from '../core/config.js';
import { getLang, onLangChange, topicText } from '../core/i18n.js';
import { pickTopic, randInt } from '../core/random.js';
import { slotEase } from '../core/easing.js';

/**
 * @param {object} options
 * @param {HTMLElement} options.reelEl   satırların konacağı kapsayıcı
 * @param {HTMLElement} [options.resultEl] sonucun duyurulacağı aria-live alanı
 * @param {(result: {topicId: string, lang: string, text: string}) => void} [options.onResult]
 * @param {(spinning: boolean) => void} [options.onStateChange]
 */
export function createSlot({ reelEl, resultEl, onResult, onStateChange }) {
  const items = new Map();     // index -> { topicId, lang, text }
  const rendered = new Map();   // index -> HTMLElement
  const pool = [];              // boştaki satır elemanları (geri dönüşüm)

  let offset = 0;      // şeridin anlık konumu (kesirli indeks)
  let endIndex = 0;    // bu turun duracağı indeks
  let spinning = false;
  let rafId = 0;
  let rowHeight = 0;   // px — CSS'ten ölçülür

  /* ---------------------------------------------------------------- veri */

  /** İndeksin içeriğini döndürür; yoksa o anki dille üretir. */
  function itemAt(index) {
    let item = items.get(index);
    if (item) return item;

    const previous = items.get(index - 1);
    const topic = pickTopic(previous?.topicId);
    const lang = getLang();

    item = { topicId: topic.id, lang, text: topicText(topic.id, lang) };
    items.set(index, item);
    return item;
  }

  /** Bir indeksi güncel dile çevirir (konu aynı kalır, sadece metin değişir). */
  function retranslate(index) {
    const item = items.get(index);
    if (!item || item.lang === getLang()) return;

    item.lang = getLang();
    item.text = topicText(item.topicId, item.lang);

    const el = rendered.get(index);
    if (el) el.textContent = item.text;
  }

  /** Uzakta kalmış indeksleri unut (bellek şişmesin). */
  function prune() {
    const center = Math.round(offset);
    for (const index of items.keys()) {
      if (Math.abs(index - center) > 60) items.delete(index);
    }
  }

  /* --------------------------------------------------------------- render */

  function createRow() {
    const el = document.createElement('div');
    el.className = 'slot__row';
    el.setAttribute('aria-hidden', 'true'); // sonuç ayrı bir aria-live alanında duyuruluyor
    return el;
  }

  /**
   * Satır yüksekliğini CSS'ten ölçer (--slot-row rem tabanlı, o yüzden hesaplamak yerine ölçüyoruz).
   *
   * DİKKAT: ekrandaki satırlar ölçüm için kullanılamaz — üzerlerinde scale()
   * transformu var ve getBoundingClientRect() transformlu boyutu döndürür
   * (52px yerine 46px gibi). Her seferinde temiz bir deneme satırı ölçülür.
   */
  function measureRow() {
    const probe = createRow();
    probe.textContent = 'x';
    probe.style.visibility = 'hidden';
    reelEl.appendChild(probe);

    rowHeight = probe.getBoundingClientRect().height || rowHeight;
    probe.remove();
  }

  function render() {
    const center = Math.round(offset);
    const first = center - SPIN.visible;
    const last = center + SPIN.visible;

    // Görüş alanından çıkan satırları havuza geri ver
    for (const [index, el] of rendered) {
      if (index < first || index > last) {
        el.remove();
        rendered.delete(index);
        pool.push(el);
      }
    }

    for (let index = first; index <= last; index += 1) {
      let el = rendered.get(index);

      if (!el) {
        el = pool.pop() ?? createRow();
        el.textContent = itemAt(index).text;
        reelEl.appendChild(el);
        rendered.set(index, el);
      }

      // Merkeze olan mesafe: 0 = tam ortada
      const delta = index - offset;
      const distance = Math.abs(delta);

      const y = (delta * rowHeight).toFixed(2);
      const scale = (1 - Math.min(distance, 2) * 0.06).toFixed(3);
      const opacity = Math.max(0, 1 - distance * 0.5).toFixed(2);
      const blur = distance < 0.15 ? 0 : Math.min(distance * 1.6, 4);

      el.style.transform = `translateY(${y}px) scale(${scale})`;
      el.style.opacity = opacity;
      el.style.filter = blur === 0 ? 'none' : `blur(${blur.toFixed(1)}px)`;
    }
  }

  /* ------------------------------------------------------------ animasyon */

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Son adımları güncel dile sabitle — sonuç yanlış dilde kalmasın. */
  function lockTail() {
    for (let index = endIndex - SPIN.tailLock; index <= endIndex; index += 1) {
      retranslate(index);
    }
  }

  function finish() {
    cancelAnimationFrame(rafId);

    offset = endIndex;
    spinning = false;
    reelEl.classList.remove('is-spinning');

    retranslate(endIndex);   // sonuç her zaman güncel dilde
    render();
    prune();

    const item = items.get(endIndex);
    if (resultEl) resultEl.textContent = item.text;

    onStateChange?.(false);
    onResult?.({ topicId: item.topicId, lang: item.lang, text: item.text });
  }

  /** Yeni tur başlatır. Zaten dönüyorsa hiçbir şey yapmaz. */
  function spin() {
    if (spinning) return false;

    spinning = true;
    onStateChange?.(true);

    const start = Math.round(offset);
    endIndex = start + randInt(SPIN.minSteps, SPIN.maxSteps);

    // Hareket azaltma tercihi açıksa animasyonu atla, doğrudan sonucu göster
    if (prefersReducedMotion()) {
      finish();
      return true;
    }

    reelEl.classList.add('is-spinning');
    const startedAt = performance.now();

    const frame = (now) => {
      const progress = Math.min(1, (now - startedAt) / SPIN.duration);

      offset = start + (endIndex - start) * slotEase(progress);
      lockTail();
      render();

      if (progress < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        finish();
      }
    };

    rafId = requestAnimationFrame(frame);
    return true;
  }

  /* ----------------------------------------------------------- bağlantılar */

  // Dil değişimi
  onLangChange(() => {
    // Dönerken KESİNLİKLE müdahale etme: kuyruk kendi akışında yeni dile geçsin.
    // (Sadece lockTail son adımları düzeltir, o da animasyon döngüsünün içinde.)
    if (spinning) return;

    for (const index of rendered.keys()) retranslate(index);

    const item = items.get(Math.round(offset));
    if (item && resultEl) resultEl.textContent = item.text;
  });

  // Satır yüksekliği rem tabanlı; ekran/font değişince yeniden ölç
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measureRow();
      render();
    }, 120);
  });

  /* -------------------------------------------------------------- başlangıç */

  measureRow();
  render();
  if (resultEl) resultEl.textContent = items.get(0).text;

  return {
    spin,
    isSpinning: () => spinning,
  };
}
