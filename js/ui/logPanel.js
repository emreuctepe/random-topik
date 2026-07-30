/* ============================================================================
   logPanel.js — kayıt listesi çizimi

   Satır yapısı:  [kelime]......[13:46-28.07.2026]
   Kelime sola, saat sağa yaslı; aradaki boşluğu .log-dots dolduruyor
   (hizalama CSS'te flex ile yapılıyor, panel-log.css).

   Kayıtlar seçildikleri dilde donmuş metinle geldiği için bu panel
   dil değişimini dinlemez — eski satırlar olduğu gibi kalır.
   ========================================================================== */

import { formatStamp } from '../core/format.js';
import * as logStore from '../core/logStore.js';

export function createLogPanel({ listEl, emptyEl }) {
  function buildRow(record) {
    const row = document.createElement('li');
    row.className = 'log-row';

    const word = document.createElement('span');
    word.className = 'log-word';
    word.textContent = record.text;
    word.title = record.text;          // kesilirse tam hali tooltip'te görünsün

    const dots = document.createElement('span');
    dots.className = 'log-dots';
    dots.setAttribute('aria-hidden', 'true');

    const time = document.createElement('time');
    time.className = 'log-time';
    time.dateTime = new Date(record.ts).toISOString();
    time.textContent = formatStamp(record.ts);

    row.append(word, dots, time);
    return row;
  }

  function render(records = logStore.getAll()) {
    const fragment = document.createDocumentFragment();
    records.forEach((record) => fragment.appendChild(buildRow(record)));

    listEl.replaceChildren(fragment);
    if (emptyEl) emptyEl.hidden = records.length > 0;
  }

  logStore.onChange(render);
  render();

  return { render };
}
