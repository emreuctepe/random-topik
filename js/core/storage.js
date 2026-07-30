/* ============================================================================
   storage.js — kayıtların nerede tutulacağı

   Tek arayüz:  { load(): Array, save(records): void }
   Böylece logStore.js verinin nereye yazıldığını bilmek zorunda kalmaz.

   İleride sunucu / IP tabanlı depolama eklemek için:
   aşağıya aynı arayüze sahip üçüncü bir adapter yazıp
   config.js -> STORAGE.mode değerini o isme çevirmen yeterli.
   (Sunucu adapter'ı async olacaksa logStore.js'teki load çağrısı da
    await'lenecek şekilde güncellenmeli — tek satır.)
   ========================================================================== */

/** Bellek: sayfa yenilenince sıfırlanır. */
function memoryAdapter() {
  let data = [];
  return {
    load: () => data.slice(),
    save: (records) => { data = records.slice(); },
  };
}

/** localStorage: tarayıcıda kalıcı. Gizli sekmede/kotada patlarsa sessizce yutar. */
function localAdapter(key) {
  return {
    load() {
      try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    },
    save(records) {
      try {
        localStorage.setItem(key, JSON.stringify(records));
      } catch {
        /* kota dolu veya erişim yok — kayıt bellekte devam eder */
      }
    },
  };
}

const adapters = {
  memory: memoryAdapter,
  local:  localAdapter,
};

export function createStorage({ mode, key }) {
  const factory = adapters[mode] ?? adapters.memory;
  if (!adapters[mode]) {
    console.warn(`[storage] bilinmeyen mod "${mode}", "memory" kullanıldı`);
  }
  return factory(key);
}
