/* ============================================================================
   langSwitcher.js — "tr ▾" dropdown'ı

   Küçük ama klavyeyle de kullanılabilir:
   Enter/Space açar, ↑ ↓ gezer, Enter seçer, Esc kapatır, dışarı tıklamak kapatır.
   ========================================================================== */

import { LANGS } from '../core/config.js';
import { getLang, setLang, onLangChange, t } from '../core/i18n.js';

export function createLangSwitcher(root) {
  root.innerHTML = '';

  /* --- Buton --- */
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'lang__btn';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');

  // Butonda bayrak yok, sadece dil kodu — bayraklar açılır menüdeki kutularda
  const current = document.createElement('span');
  current.className = 'lang__current';

  const caret = document.createElement('span');
  caret.className = 'lang__caret';
  caret.textContent = '▾';           // ▾
  caret.setAttribute('aria-hidden', 'true');

  button.append(current, caret);

  /* --- Menü --- */
  const menu = document.createElement('ul');
  menu.className = 'lang__menu';
  menu.setAttribute('role', 'listbox');
  menu.hidden = true;

  const options = LANGS.map((lang) => {
    const option = document.createElement('li');
    option.className = 'lang__option';
    option.setAttribute('role', 'option');
    option.dataset.lang = lang.code;
    option.tabIndex = -1;

    const flag = document.createElement('span');
    flag.className = 'lang__flag';
    flag.setAttribute('aria-hidden', 'true');
    flag.textContent = lang.flag;

    const label = document.createElement('span');
    label.textContent = lang.label;

    option.append(flag, label);
    menu.appendChild(option);
    return option;
  });

  root.append(button, menu);

  /* --- Durum --- */
  function syncLabels() {
    const code = getLang();
    const active = LANGS.find((lang) => lang.code === code);

    current.textContent = active?.label ?? code;
    button.setAttribute('aria-label', t('langLabel'));
    options.forEach((option) => {
      option.setAttribute('aria-selected', String(option.dataset.lang === code));
    });
  }

  function isOpen() {
    return !menu.hidden;
  }

  function open() {
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    const selected = options.find((o) => o.getAttribute('aria-selected') === 'true');
    (selected ?? options[0])?.focus();
  }

  function close({ focusButton = false } = {}) {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (focusButton) button.focus();
  }

  function move(from, direction) {
    const index = options.indexOf(from);
    const next = (index + direction + options.length) % options.length;
    options[next].focus();
  }

  /* --- Olaylar --- */
  button.addEventListener('click', () => (isOpen() ? close() : open()));

  button.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
    }
  });

  options.forEach((option) => {
    option.addEventListener('click', () => {
      setLang(option.dataset.lang);
      close({ focusButton: true });
    });

    option.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          setLang(option.dataset.lang);
          close({ focusButton: true });
          break;
        case 'ArrowDown':
          event.preventDefault();
          move(option, 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          move(option, -1);
          break;
        case 'Escape':
          event.preventDefault();
          close({ focusButton: true });
          break;
        case 'Tab':
          close();
          break;
      }
    });
  });

  // Dışarı tıklayınca kapan
  document.addEventListener('pointerdown', (event) => {
    if (isOpen() && !root.contains(event.target)) close();
  });

  // Esc her yerden kapatsın
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) close({ focusButton: true });
  });

  onLangChange(syncLabels);
  syncLabels();

  return { close };
}
