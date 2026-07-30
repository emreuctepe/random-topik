/* ============================================================================
   logStore.js — kayıt listesi

   Bir kayıt:
     {
       topicId: 'pets',              // konunun kimliği
       lang:    'tr',                // seçim anındaki dil
       text:    'Evcil Hayvanlar',   // seçim anında donmuş metin (ekranda bu görünür)
       ts:      1753875960000        // zaman damgası (ms)
     }

   text donmuş halde saklanır: dil değişse bile eski kayıtlar seçildikleri
   dilde kalır. topicId + lang de tutulur ki ileride istersen kayıtları
   çevirebilir ya da istatistik çıkarabilirsin — bilgi kaybı yok.
   ========================================================================== */

import { STORAGE } from './config.js';
import { createStorage } from './storage.js';

const storage = createStorage(STORAGE);
const subscribers = new Set();

let records = storage.load();

function emit() {
  subscribers.forEach((fn) => fn(getAll()));
}

/** Yeni kayıt ekler (en yeni başa gelir) ve depolamaya yazar. */
export function add({ topicId, lang, text, ts = Date.now() }) {
  records = [{ topicId, lang, text, ts }, ...records].slice(0, STORAGE.max);
  storage.save(records);
  emit();
}

/** Tüm kayıtlar, en yeniden eskiye. */
export function getAll() {
  return records.slice();
}

/** Kayıtları temizler. */
export function clear() {
  records = [];
  storage.save(records);
  emit();
}

/**
 * Kayıt listesi değiştiğinde haber alır.
 * @returns {() => void} aboneliği iptal eden fonksiyon
 */
export function onChange(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}
