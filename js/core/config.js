/* ============================================================================
   config.js — ayar düğmeleri
   Davranışı değiştirmek istediğinde ilk bakacağın yer burası.
   ========================================================================== */

/**
 * Sürüm numarası — başlığın solunda, depo linki olarak görünür.
 * HER değişiklikte son haneyi bir artır: 0.1.1 -> 0.1.2 -> 0.1.3 ...
 */
export const APP_VERSION = '0.1.2';

/** Versiyon göstergesinin tıklandığında gideceği adres. */
export const REPO_URL = 'https://github.com/emreuctepe/random-topik';

/**
 * Desteklenen diller.
 *  code  : dictionary.js içindeki anahtar (tr / eng / jp)
 *  label : ekranda görünen etiket
 *  flag  : etiketin yanındaki bayrak emojisi
 *  html  : <html lang="..."> için standart kod (erişilebilirlik/SEO)
 *
 * Yeni dil eklemek: buraya bir satır + dictionary.js'teki her satıra karşılığı.
 */
export const LANGS = [
  { code: 'tr',  label: 'tr',  flag: '🇹🇷', html: 'tr' },
  { code: 'eng', label: 'eng', flag: '🇬🇧', html: 'en' },
  { code: 'jp',  label: 'jp',  flag: '🇯🇵', html: 'ja' },
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
