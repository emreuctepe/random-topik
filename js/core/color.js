/* ============================================================================
   color.js — rastgele canlı renk

   emreuctepe.com'daki formülün aynısı: hsl(rastgele ton, %80, %65).
   Doygunluk ve açıklık sabit olduğu için hangi ton çıkarsa çıksın koyu zemin
   üzerinde parlaklık dengesi aynı kalır — hiçbir renk diğerinden sönük
   ya da fazla parlak durmaz.
   ========================================================================== */

/** @returns {string} örn. "hsl(217, 80%, 65%)" */
export function randomVividColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 80%, 65%)`;
}
