# Renk Formülümüz

Bu dosya projedeki renk seçiminin **tek referansı**. Yeni bir renge ihtiyaç
olduğunda göz kararı bir hex yazmak yerine buraya bakılır.

İki ayrı iş var, ikisi de ayrı kurala tabi:

1. **Vurgu rengi** — rastgele üretilir, formülü var. (Slot, koleksiyon,
   kaydırma göstergesi, ilerleme çubuğu.)
2. **Arayüz renkleri** — sabit palet, kontrast oranına göre seçilmiş.
   (`css/base.css` içindeki token'lar.)

---

## 1) Vurgu rengi — formül

```js
hsl(rastgele 0-359, 80%, 65%)
```

Kod: [`js/core/color.js`](js/core/color.js)

```js
export function randomVividColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 80%, 65%)`;
}
```

Aynı formül [emreuctepe.com](https://emreuctepe.com)'da da kullanılıyor
(`js/color.js` ve yükleme çubuğundaki `--loader-hue`). İki proje bilerek aynı
renk mantığını paylaşıyor.

### Neden böyle

**Sadece ton (hue) rastgele; doygunluk ve açıklık sabit.**

Üç kanalı da rastgele bıraksak (`#` + 6 rastgele hane) renkler birbirini
tutmazdı: bir seferinde bembeyaza yakın bir pastel, ötekinde koyu zeminde zar
zor seçilen bir lacivert çıkardı. Doygunluk ve açıklığı sabitleyince tesadüfe
bırakılan tek şey **"hangi renk"** oluyor — canlılık ve koyuluk hep aynı
ayarda kalıyor, hiçbir sonuç ne pastele ne de neona kaçıyor.

| Değer | Neden bu |
| --- | --- |
| Ton `0-359` | Tek rastgele olan. Tam tur — hiçbir renk ailesi dışarıda kalmıyor. |
| Doygunluk `%80` | %100 neon gibi durup koyu zeminde titriyor; %60 altı griye kaçıp "renk" hissini kaybediyor. %80 canlı ama sakin. |
| Açıklık `%65` | `#101214` zemininde ~%50'nin altı okunmuyor, ~%80 üstü göz alıyor. %65 her tonda zeminden net ayrılıyor. |

### Örnek çıktılar

Formülün ürettiği bazı değerler (`hsl(ton, 80%, 65%)`), yanlarında `--bg`
(`#101214`) zeminine karşı ölçülen kontrast oranı:

| Ton | Değer | Hex | Kontrast | Nasıl görünüyor |
| --- | --- | --- | --- | --- |
| 0   | `hsl(0, 80%, 65%)`   | `#ED5E5E` | 5.7:1  | mercan kırmızısı |
| 45  | `hsl(45, 80%, 65%)`  | `#EDC95E` | 11.7:1 | hardal sarısı |
| 90  | `hsl(90, 80%, 65%)`  | `#A6ED5E` | 13.3:1 | fıstık yeşili |
| 150 | `hsl(150, 80%, 65%)` | `#5EEDA6` | 12.6:1 | nane |
| 200 | `hsl(200, 80%, 65%)` | `#5EBEED` | 9.0:1  | gök mavisi |
| 260 | `hsl(260, 80%, 65%)` | `#8E5EED` | 4.5:1  | menekşe |
| 320 | `hsl(320, 80%, 65%)` | `#ED5EBE` | 6.2:1  | fuşya |

### Formülün bildiği sınır

HSL'deki "açıklık" gözün gördüğü parlaklık değil. Aynı `%65` değerinde sarı
zeminden çok daha fazla ayrılıyor, mavi çok daha az:

| | Ton | Kontrast |
| --- | --- | --- |
| en parlak | 60 (sarı) | **15.1:1** |
| en sönük | 240 (lacivert) | **3.8:1** |

Yani 360 tonun tamamı `3.8:1 – 15.1:1` aralığına yayılıyor ve **233-261
arasındaki mavi/mor tonları 4.5:1'in altına düşüyor** — metin için AA'yı
geçemezler.

Bu bilinerek kabul edildi: vurgu rengi hiçbir yerde yazı taşımıyor, sadece
çizgi ve dolgu oluyor. 2px'lik bir dolguda 3.8:1 fazlasıyla seçiliyor.
Formülü bir gün metin için kullanmak gerekirse açıklığı tona göre ayarlamak
(ya da OKLCH'e geçmek) şart — bugünkü hâliyle uygun değil.

### Nerede kullanılıyor

| Yer | Ne zaman yenilenir |
| --- | --- |
| Kaydırma göstergesi (`js/ui/scrollRail.js`) | her panel geçişinde |
| İlerleme çubuğu dolgusu (`js/ui/progressBar.js`) | sayfa her açıldığında bir kez |

### Kullanım kuralı

- Vurgu rengi **dekoratiftir**: çizgi, dolgu, işaretçi olur.
- Yazı rengi olmaz, üstüne de yazı yazılmaz — sebebi yukarıdaki kontrast
  aralığı. Rastgele gelen ton lacivert çıkarsa yazı okunmaz.
- Aynı ekranda ikiden fazla rastgele renk aynı anda durmaz — rastlantı hoş
  duruyorsa azlığından duruyor.

---

## 2) Arayüz paleti — sabit token'lar

Kod: [`css/base.css`](css/base.css) → `:root`

Tek zemin (`--bg`) üstünde, yazı renkleri **kontrast oranına göre** kademeli
seçildi. WCAG AA normal metin için 4.5:1, AAA için 7:1 ister.

| Token | Değer | Kontrast (bg'ye karşı) | İş |
| --- | --- | --- | --- |
| `--bg` | `#101214` | — | ana zemin, tüm paneller aynı |
| `--fg` | `#f2f4f6` | 17.0:1 | birincil yazı |
| `--fg-dim` | `#9aa3ad` | 7.3:1 (AAA) | ikincil: açıklama, log |
| `--fg-faint` | `#7d8792` | 5.1:1 (AA) | üçüncül: versiyon, boş liste, etiket |
| `--line` | `#4d555e` | — | dekoratif: çizgi, nokta, kenarlık |
| `--surface` | `#1b1f23` | — | menü hover zemini |
| `--cell-off` | `#242930` | — | koleksiyon: çıkmamış kare, boş ray |
| `--cell-on` | `#7d8792` | — | koleksiyon: çıkmış kare |
| `--focus` | `#7aa2ff` | — | klavye odak halkası |

### Neden böyle

- **Tek zemin.** Panel başına ayrı zemin tonu yok; ayrım boşlukla ve ince
  çizgiyle yapılıyor. Kutu kutu görünmesin diye.
- **Üç kademe yazı.** Hiyerarşi punto büyütmekle değil, soldurmakla kuruluyor.
  Ekranda tek bir başlık boyu var, gerisi aynı puntoda farklı tonlarda.
- **4.5:1 tabanı.** `--fg-faint` en soluk yazı rengi ve hâlâ AA'yı geçiyor.
  Daha soluk bir ton gerekirse o artık yazı değil, çizgidir (`--line`).
- **Kontrast hesabı yorum olarak duruyor.** `base.css` içindeki her satırın
  yanında oranı yazılı — yeni bir ton eklerken oranını hesaplayıp yanına yaz.

---

## Yeni renk eklerken

1. Dekoratif ve rastgele mi? → `randomVividColor()` kullan, yeni bir şey üretme.
2. Sabit bir arayüz rengi mi? → `base.css`'e token olarak ekle, doğrudan CSS'in
   içine hex yazma.
3. Yazı rengi mi? → `--bg`'ye karşı kontrastını hesapla, 4.5:1'in altındaysa
   kullanma. Oranı token'ın yanına yorum olarak yaz.
