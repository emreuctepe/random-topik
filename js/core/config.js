/* ============================================================================
   config.js — ayar düğmeleri
   Davranışı değiştirmek istediğinde ilk bakacağın yer burası.
   ========================================================================== */

/**
 * Sürüm numarası — başlığın yanında görünür.
 * Elle artır: yama = 0.1.1, yeni özellik = 0.2.0, büyük değişiklik = 1.0.0
 */
export const APP_VERSION = '0.1.0';

/**
 * Desteklenen diller.
 *  code  : dictionary.js içindeki anahtar (tr / eng / jp)
 *  label : ekranda görünen etiket
 *  html  : <html lang="..."> için standart kod (erişilebilirlik/SEO)
 *
 * Yeni dil eklemek: buraya bir satır + dictionary.js'teki her satıra karşılığı.
 */
export const LANGS = [
  { code: 'tr',  label: 'tr',  html: 'tr' },
  { code: 'eng', label: 'eng', html: 'en' },
  { code: 'jp',  label: 'jp',  html: 'ja' },
];

/** Açılışta seçili dil + çeviri eksikse düşülecek dil. */
export const DEFAULT_LANG = 'tr';

/** Slot animasyonu ayarları. */
export const SPIN = {
  duration: 2800,   // toplam süre (ms)
  minSteps: 20,     // en az kaç kelime geçsin
  maxSteps: 30,     // en fazla kaç kelime geçsin
  tailLock: 3,      // son kaç adım her zaman güncel dile çevrilsin
  visible:  2,      // merkezin üstünde/altında kaç satır render edilsin
};

/**
 * Kayıt (log) depolaması.
 *  mode: 'memory' -> sayfa yenilenince sıfırlanır (şu anki tercih)
 *        'local'  -> localStorage'a yazar, yenilemede kalır
 * İleride sunucu/IP tabanlı depolama eklenecekse js/core/storage.js içine
 * yeni bir adapter yazıp burayı o isme çevirmek yeterli.
 */
export const STORAGE = {
  mode: 'memory',
  key:  'randomTopik.log',
  max:  200,          // en fazla kaç kayıt tutulsun
};
