/* ============================================================================
   random.js — rastgele konu seçimi
   Art arda aynı kelimenin gelmemesi burada garanti edilir.
   ========================================================================== */

import { topics } from '../data/dictionary.js';

/** [min, max] aralığında tam sayı (iki uç da dahil). */
export function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Rastgele bir konu döndürür.
 * @param {string} [excludeId] bu konu seçilmesin (üst üste tekrarı önler)
 */
export function pickTopic(excludeId) {
  if (topics.length === 0) {
    throw new Error('[random] dictionary.js içindeki topics listesi boş');
  }
  if (topics.length === 1) return topics[0];

  const index = randInt(0, topics.length - 1);
  if (topics[index].id !== excludeId) return topics[index];

  // Çakıştı: listeyi 1..n-1 kadar kaydırarak farklı bir konuya geç.
  // (Yeniden zar atmak yerine kaydırmak sonsuz döngü riskini sıfırlar.)
  const shifted = (index + randInt(1, topics.length - 1)) % topics.length;
  return topics[shifted];
}
