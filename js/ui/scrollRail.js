/* ============================================================================
   scrollRail.js — mobildeki kaydırma göstergesi

   Neden native scrollbar değil:
   iOS Safari dokunmatik kaydırma çubuklarını ::-webkit-scrollbar ile
   boyamaya izin vermez; çubuk sistemin yarı saydam overlay'i olarak kalır ve
   kendiliğinden gizlenir. Yani hem "görünür olsun" hem "renkli olsun"
   isteğinin ikisi de iPhone'da karşılanmazdı. Kendi göstergemiz her yerde
   aynı çalışır, yer kaplamaz (üstte duruyor) ve tam renk kontrolü verir.

   Renk her panel değişiminde yenilenir — kaydırmanın her karesinde değil.
   Sürekli değişse hem titrek görünürdü hem de her scroll karesinde stil
   yazmak gerekirdi.
   ========================================================================== */

import { randomVividColor } from '../core/color.js';

const MIN_THUMB = 24;   // px — çok kısalıp kaybolmasın

export function createScrollRail({ scrollerEl, railEl, thumbEl, panelSelector }) {
  let ticking = false;

  function draw() {
    ticking = false;

    const { scrollTop, scrollHeight, clientHeight } = scrollerEl;
    const railHeight = railEl.clientHeight;

    // Kaydırma yoksa (masaüstü düzeni) göstergeyi gizle
    const scrollable = scrollHeight - clientHeight;
    if (scrollable <= 0 || railHeight <= 0) {
      railEl.style.opacity = '0';
      return;
    }
    railEl.style.opacity = '';

    const thumbHeight = Math.max(MIN_THUMB, (clientHeight / scrollHeight) * railHeight);
    const progress = scrollTop / scrollable;

    thumbEl.style.height = `${thumbHeight}px`;
    thumbEl.style.transform = `translateY(${progress * (railHeight - thumbHeight)}px)`;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(draw);
  }

  function setAccent() {
    document.documentElement.style.setProperty('--scroll-accent', randomVividColor());
  }

  /* Panel değişimini yakala: yeni panel ekranın çoğunu kapladığında renk yenilenir. */
  let current = null;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target === current) return;
        current = entry.target;
        setAccent();
      });
    },
    { root: scrollerEl, threshold: 0.6 },
  );

  scrollerEl.querySelectorAll(panelSelector).forEach((panel) => observer.observe(panel));

  scrollerEl.addEventListener('scroll', onScroll, { passive: true });

  // Resize doğrudan çizer, rAF kapısından geçmez: masaüstü <-> mobil geçişinde
  // düzen tamamen değişiyor ve bir sonraki kaydırmaya kadar beklemesi gerekmiyor.
  window.addEventListener('resize', draw);

  setAccent();
  draw();

  return { draw, setAccent };
}
