/* ============================================================================
   easing.js — slotun hız profili

   Klasik ease-out eğrileri burada iyi durmuyor: son tek kelime toplam sürenin
   yarısını yiyor, slot takılmış gibi görünüyor. Bunun yerine iki fazlı profil:

     1) SEYİR   : sabit hızda hızlı dönüş  (kelimeler akıp geçer)
     2) YAVAŞLAMA: son birkaç kelimede kübik yavaşlama (oturma hissi)

   İki fazın birleşme noktasındaki hızlar birbirine çok yakın seçildi,
   o yüzden geçişte sıçrama olmaz.
   ========================================================================== */

/** Mesafenin ne kadarı sabit hızda alınsın (0-1). */
export const CRUISE_DISTANCE = 0.78;

/** Bunun için sürenin ne kadarı harcansın (0-1). */
export const CRUISE_TIME = 0.55;

/**
 * @param {number} t 0..1 arası normalize edilmiş zaman
 * @returns {number} 0..1 arası alınan mesafe oranı
 */
export function slotEase(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  // 1) Seyir fazı — sabit hız
  if (t <= CRUISE_TIME) {
    return (t / CRUISE_TIME) * CRUISE_DISTANCE;
  }

  // 2) Yavaşlama fazı — easeOutCubic
  const k = (t - CRUISE_TIME) / (1 - CRUISE_TIME);
  const eased = 1 - Math.pow(1 - k, 3);

  return CRUISE_DISTANCE + eased * (1 - CRUISE_DISTANCE);
}
