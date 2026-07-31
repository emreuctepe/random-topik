/* ============================================================================
   collectionPanel.js — koleksiyon kareleri

   ÖNEMLİ: Kareler doğrudan dictionary.js'teki `topics` dizisinden üretilir.
   Sözlüğe yeni bir kelime eklediğinde kare kendiliğinden belirir, sayaç da
   kendiliğinden büyür. Burada elle güncellenmesi gereken hiçbir liste yok.

   Çıkmış konular dolu, çıkmamışlar soluk görünür (collectionStore).
   ========================================================================== */

import { topics } from '../data/dictionary.js';
import { topicText, onLangChange } from '../core/i18n.js';
import * as collectionStore from '../core/collectionStore.js';

export function createCollectionPanel({ gridEl, countEl }) {
  function render() {
    const seen = collectionStore.getAll();
    const fragment = document.createDocumentFragment();

    topics.forEach((topic) => {
      const cell = document.createElement('li');
      cell.className = 'collection__cell';

      if (seen.has(topic.id)) {
        cell.classList.add('is-found');
        // Bulunmuş karenin üstüne gelince kelime görünsün.
        // Bulunmamışlarda kasten yok — koleksiyonun anlamı kalsın.
        cell.title = topicText(topic.id);
      }

      fragment.appendChild(cell);
    });

    gridEl.replaceChildren(fragment);
    countEl.textContent = `${seen.size}/${topics.length}`;
  }

  collectionStore.onChange(render);
  onLangChange(render);   // tooltip'ler güncel dilde kalsın
  render();

  return { render };
}
