/* ============================================================================
   format.js — tarih/saat biçimi
   Görseldeki format:  13:46-28.07.2026   (saat:dakika-gün.ay.yıl)
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
