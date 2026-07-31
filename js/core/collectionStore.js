/* ============================================================================
   collectionStore.js — hangi konuların çıktığı (koleksiyon)

   Sadece "görülen konu id'leri" kümesini tutar. Kareler bu kümeden değil,
   sözlüğün kendisinden türetilir (bkz. ui/collectionPanel.js) — buradaki küme
   yalnızca hangilerinin dolu görüneceğini söyler.

   Neden logStore'dan türetmiyoruz: log en fazla STORAGE.max kayıt tutuyor,
   eskiler kırpılıyor. Koleksiyon ondan beslenseydi zamanla geriye giderdi.
   ========================================================================== */

import { STORAGE } from './config.js';
import { createStorage } from './storage.js';

const storage = createStorage({ mode: STORAGE.mode, key: STORAGE.collectionKey });
const subscribers = new Set();

let seen = new Set(storage.load());

function emit() {
  subscribers.forEach((fn) => fn(getAll()));
}

/** Bir konuyu "çıktı" olarak işaretler. Zaten varsa hiçbir şey yapmaz. */
export function markSeen(topicId) {
  if (!topicId || seen.has(topicId)) return;

  seen.add(topicId);
  storage.save([...seen]);
  emit();
}

/** Görülen konu id'lerinin kopyası. */
export function getAll() {
  return new Set(seen);
}

/** Koleksiyonu sıfırlar. */
export function clear() {
  seen = new Set();
  storage.save([]);
  emit();
}

/**
 * Koleksiyon değiştiğinde haber alır.
 * @returns {() => void} aboneliği iptal eden fonksiyon
 */
export function onChange(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}
