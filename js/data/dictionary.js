/* ============================================================================
   dictionary.js — ELLE DÜZENLENECEK TEK DOSYA

   Hem arayüz metinleri hem de konu sözlüğü burada.
   İkisi de aynı kalıbı kullanır:  { tr: '...', eng: '...', jp: '...' }

   • Yeni arayüz metni  -> ui objesine bir satır ekle
   • Yeni konu          -> topics dizisine bir satır ekle (id benzersiz olmalı)
   • Yeni dil           -> js/core/config.js içindeki LANGS listesine ekle,
                           sonra buradaki her satıra o dilin karşılığını yaz

   Bir dil karşılığını yazmayı unutursan sayfa patlamaz: varsayılan dile
   (config.js -> DEFAULT_LANG) düşer ve konsola tek satır uyarı basar.
   ========================================================================== */


/* ---------------------------------------------------------------------------
   1) ARAYÜZ METİNLERİ
   HTML'de kullanımı:  <h1 data-i18n="siteTitle"></h1>
                       <a data-i18n-aria="scrollHint">  (aria-label için)
   --------------------------------------------------------------------------- */
export const ui = {
  siteTitle: {
    tr:  'random topik',
    eng: 'random topic',
    jp:  'ランダムトピック',
  },

  progressTitle: {
    tr:  'proje ilerleme',
    eng: 'project progress',
    jp:  'プロジェクト進捗',
  },

  aboutTitle: {
    tr:  'Hakkında',
    eng: 'About',
    jp:  'について',
  },

  logTitle: {
    tr:  'Kayıt',
    eng: 'Log',
    jp:  '記録',
  },

  logEmpty: {
    tr:  'henüz kayıt yok',
    eng: 'no records yet',
    jp:  'まだ記録がありません',
  },

  collectionTitle: {
    tr:  'Koleksiyon',
    eng: 'Collection',
    jp:  'コレクション',
  },

  again: {
    tr:  'tekrar seç',
    eng: 'pick again',
    jp:  'もう一度選ぶ',
  },

  // aria-label'lar (ekranda görünmez, ekran okuyucular için)
  langLabel: {
    tr:  'dil seç',
    eng: 'choose language',
    jp:  '言語を選択',
  },

  // --- Sol sütundaki 3 düz yazı ---
  aboutLine1: {
    tr:  'Bu siteyi İngilizce konuşma kulübünde konuşma pratiği için kullanıyoruz.',
    eng: 'We use this site as speaking practice in our English conversation club.',
    jp:  '英会話クラブのスピーキング練習にこのサイトを使っています。',
  },

  aboutLine2: {
    tr:  'Yönetici rastgele bir kelime seçiyor, herkes o kelime üzerine düşünüyor.',
    eng: 'The host picks a random word and everyone thinks about it.',
    jp:  'ホストがランダムに単語を選び、全員がそのテーマについて考えます。',
  },

  aboutLine3: {
    tr:  'Her üye 1 dakika düşünüp ardından 1 dakika boyunca o kelime hakkında konuşuyor.',
    eng: 'Each member thinks for one minute, then speaks about the word for one minute.',
    jp:  '各メンバーは1分間考えてから、その単語について1分間話します。',
  },
};


/* ---------------------------------------------------------------------------
   2) KONU SÖZLÜĞÜ
   Her konu tek satır. "id" slot ve kayıt sisteminin ortak anahtarı —
   bir kez yazdıktan sonra değiştirme (eski kayıtlar ona bağlanıyor).
   --------------------------------------------------------------------------- */
export const topics = [
  { id: 'pets',         tr: 'Evcil Hayvanlar', eng: 'Pets',         jp: 'ペット' },
  { id: 'music',        tr: 'Müzik',           eng: 'Music',        jp: '音楽' },
  { id: 'mousepad',     tr: 'Mouse Pad',       eng: 'Mousepad',     jp: 'マウスパッド' },
  { id: 'paper',        tr: 'Kâğıt',           eng: 'Paper',        jp: '紙' },
  { id: 'reflection',   tr: 'Yansıma',         eng: 'Reflection',   jp: '反射' },
  { id: 'pepper',       tr: 'Biber',           eng: 'Pepper',       jp: 'コショウ' },
  { id: 'computer',     tr: 'Bilgisayar',      eng: 'Computer',     jp: 'コンピュータ' },
  { id: 'room',         tr: 'Oda',             eng: 'Room',         jp: '部屋' },
  { id: 'war',          tr: 'Savaş',           eng: 'War',          jp: '戦争' },
  { id: 'programming',  tr: 'Programlama',     eng: 'Programming',  jp: 'プログラミング' },
  { id: 'doctors',      tr: 'Doktorlar',       eng: 'Doctors',      jp: '医者' },
  { id: 'engineering',  tr: 'Mühendislik',     eng: 'Engineering',  jp: '工学' },
  { id: 'family',       tr: 'Aile',            eng: 'Family',       jp: '家族' },
  { id: 'universities', tr: 'Üniversiteler',   eng: 'Universities', jp: '大学' },
  { id: 'memories',     tr: 'Anılar',          eng: 'Memories',     jp: '思い出' },
  { id: 'travel',       tr: 'Seyahat',         eng: 'Travel',       jp: '旅行' },
  { id: 'food',         tr: 'Yemek',           eng: 'Food',         jp: '食べ物' },
  { id: 'cinema',       tr: 'Sinema',          eng: 'Cinema',       jp: '映画' },
  { id: 'weather',      tr: 'Hava Durumu',     eng: 'Weather',      jp: '天気' },
  { id: 'sports',       tr: 'Spor',            eng: 'Sports',       jp: 'スポーツ' },
  { id: 'books',        tr: 'Kitaplar',        eng: 'Books',        jp: '本' },
  { id: 'dreams',       tr: 'Rüyalar',         eng: 'Dreams',       jp: '夢' },
  { id: 'childhood',    tr: 'Çocukluk',        eng: 'Childhood',    jp: '子供時代' },
  { id: 'technology',   tr: 'Teknoloji',       eng: 'Technology',   jp: 'テクノロジー' },
  { id: 'coffee',       tr: 'Kahve',           eng: 'Coffee',       jp: 'コーヒー' },
];
