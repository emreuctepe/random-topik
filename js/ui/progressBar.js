/* ============================================================================
   progressBar.js — sayfanın en üstündeki proje ilerleme çubuğu

   Yüzde config.js -> PROGRESS.value içinde duruyor; proje ilerledikçe orayı
   elle güncellemek yeterli, burada değişecek bir şey yok.

   Renk her açılışta rastgele geliyor (color.js -> renk formülü). Panellerde ve
   kaydırma göstergesinde de aynı formül kullanılıyor; sayfa her açıldığında
   farklı bir tonla karşılıyor ama parlaklık dengesi hep aynı kalıyor.
   ========================================================================== */

import { PROGRESS } from '../core/config.js';
import { randomVividColor } from '../core/color.js';
import { formatPercent } from '../core/format.js';
import { getLangMeta, onLangChange } from '../core/i18n.js';

export function createProgressBar({ trackEl, fillEl, valueEl }) {
  // config'e ne yazılırsa yazılsın çubuk kendi kabından taşmasın
  const value = Math.min(100, Math.max(0, PROGRESS.value));

  // Yüzde işaretinin yeri dile göre değişiyor (tr '%20', en '20%')
  function render() {
    valueEl.textContent = formatPercent(value, getLangMeta().html);
  }

  // Yüzde ve renk CSS'e devrediliyor; dolma animasyonunu progress.css yürütüyor
  fillEl.style.setProperty('--progress-value', `${value}%`);
  fillEl.style.setProperty('--progress-accent', randomVividColor());
  trackEl.setAttribute('aria-valuenow', String(value));

  onLangChange(render);
  render();

  return { render };
}
