/* ============================================================================
   format.js — tarih/saat + sayı biçimi
   Görseldeki tarih formatı:  13:46-28.07.2026   (saat:dakika-gün.ay.yıl)
   ========================================================================== */

const pad = (n) => String(n).padStart(2, '0');

/**
 * @param {number|Date} ts zaman damgası (ms) veya Date
 * @returns {string} '13:46-28.07.2026'
 */
export function formatStamp(ts) {
  const d = ts instanceof Date ? ts : new Date(ts);

  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const date = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

  return `${time}-${date}`;
}

/**
 * Yüzde işaretinin yeri dile göre değişir; sözlüğe üç ayrı kalıp yazmak
 * yerine tarayıcının kendi bilgisini kullanıyoruz.
 *
 * @param {number} value 0-100 arası
 * @param {string} locale <html lang> kodu — config.js -> LANGS[].html
 * @returns {string} tr '%20' · en '20%' · ja '20%'
 */
export function formatPercent(value, locale) {
  return new Intl.NumberFormat(locale, { style: 'percent' }).format(value / 100);
}
