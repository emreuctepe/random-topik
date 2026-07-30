/* ============================================================================
   i18n.js — aktif dil durumu + çeviri erişimi

   Dil değişimi burada tek noktadan yönetilir. Değişince abone olan her modül
   (dil dropdown'ı, slot, arayüz metinleri) haber alır.
   ========================================================================== */

import { LANGS, DEFAULT_LANG } from './config.js';
import { ui, topics } from '../data/dictionary.js';

/** id -> konu satırı (hızlı erişim için) */
const topicById = new Map(topics.map((topic) => [topic.id, topic]));

const langCodes = LANGS.map((lang) => lang.code);
const subscribers = new Set();
const warned = new Set();          // aynı eksik çeviriyi bir kez uyar

let current = langCodes.includes(DEFAULT_LANG) ? DEFAULT_LANG : langCodes[0];

/** Eksik çeviriyi tek sefer konsola yaz, sonra varsayılan dile düş. */
function resolve(entry, lang, where) {
  if (!entry) {
    warnOnce(`${where}: sözlükte böyle bir kayıt yok`);
    return '';
  }
  if (entry[lang]) return entry[lang];

  warnOnce(`${where}: "${lang}" çevirisi eksik, "${DEFAULT_LANG}" kullanıldı`);
  return entry[DEFAULT_LANG] ?? Object.values(entry).find((v) => typeof v === 'string') ?? '';
}

function warnOnce(message) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`[dictionary] ${message}`);
}

/** Aktif dil kodu. */
export function getLang() {
  return current;
}

/** LANGS içindeki dil tanımı (label, html kodu vs.). */
export function getLangMeta(code = current) {
  return LANGS.find((lang) => lang.code === code) ?? LANGS[0];
}

/** Dili değiştirir ve abonelere haber verir. Aynı dile geçişte hiçbir şey yapmaz. */
export function setLang(code) {
  if (!langCodes.includes(code) || code === current) return;

  current = code;
  document.documentElement.lang = getLangMeta(code).html;
  subscribers.forEach((fn) => fn(code));
}

/**
 * Dil değişimine abone ol.
 * @returns {() => void} aboneliği iptal eden fonksiyon
 */
export function onLangChange(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/** Arayüz metni: t('again') -> 'tekrar seç' */
export function t(key, lang = current) {
  return resolve(ui[key], lang, `ui.${key}`);
}

/** Konu metni: topicText('pets', 'jp') -> 'ペット' */
export function topicText(id, lang = current) {
  return resolve(topicById.get(id), lang, `topics.${id}`);
}
