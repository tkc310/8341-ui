/*
 * 8341-ui のスライド（HTML のデッキ）の操作。ルールは docs/rulebook/07-slides.md（S16〜S18）。
 * ビルド（scripts/slides/build.ts）が HTML に埋め込む。依存なし。
 *
 * - 発表モード: 1 枚ずつ表示し、キャンバス（960×540 の論理サイズ）を画面に合わせて拡大・縮小する
 * - 一覧モード: 全スライドを縦に並べる。幅 768px 未満では常にこちら（S17）
 * - キー: → ↓ PageDown Space で次へ、← ↑ PageUp Shift+Space で前へ、Home / End で最初 / 最後。
 *         文字キー 1 つのショートカットは作らない（WCAG 2.1.4）
 * - 切り替えはライブリージョンで「3 / 12 枚目: 見出し」と知らせ、現在以外のスライドは hidden にする（S18）
 * - URL の #3 で 3 枚目を開く
 */
(() => {
  const root = document.documentElement;
  const deck = document.getElementById('deck');
  if (!deck) return;
  const slides = Array.from(deck.querySelectorAll(':scope > .slide'));
  const total = slides.length;
  if (!total) return;

  const $ = (id) => document.getElementById(id);
  const status = $('deck-status');
  const counter = $('deck-counter');
  const prev = $('deck-prev');
  const next = $('deck-next');
  const modeButton = $('deck-mode');
  const fullButton = $('deck-fullscreen');
  const narrow = window.matchMedia('(max-width: 767.98px)');

  let index = 0;
  let preferList = false;

  const clamp = (i) => Math.min(Math.max(i, 0), total - 1);
  const mode = () => (narrow.matches || preferList ? 'list' : 'present');
  const headingOf = (s) => (s.querySelector('h1, h2')?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const fromHash = () => {
    const n = Number.parseInt(location.hash.slice(1), 10);
    return Number.isFinite(n) ? clamp(n - 1) : 0;
  };

  function setDisabled(button, disabled) {
    // disabled 属性だとフォーカスが外れるため aria-disabled で示し、押しても何もしない
    if (!button) return;
    if (disabled) button.setAttribute('aria-disabled', 'true');
    else button.removeAttribute('aria-disabled');
  }

  function fit() {
    if (mode() !== 'present') return;
    const slide = slides[index];
    const scale = Math.min(deck.clientWidth / slide.offsetWidth, deck.clientHeight / slide.offsetHeight);
    root.style.setProperty('--deck-scale', String(Math.max(scale, 0.1)));
  }

  function warnOverflow() {
    const slide = slides[index];
    const over = slide.scrollHeight > slide.clientHeight + 1 || slide.scrollWidth > slide.clientWidth + 1;
    slide.toggleAttribute('data-overflow', over);
    if (over)
      console.warn(`スライド ${index + 1} の内容がキャンバスからはみ出しています。分量を減らすか分けてください（S4）`);
  }

  function render({ announce = false, scroll = false } = {}) {
    const m = mode();
    root.dataset.mode = m;
    slides.forEach((s, i) => {
      const current = i === index;
      s.hidden = m === 'present' && !current;
      if (current) s.setAttribute('aria-current', 'true');
      else s.removeAttribute('aria-current');
    });
    if (counter) counter.textContent = `${index + 1} / ${total}`;
    setDisabled(prev, index === 0);
    setDisabled(next, index === total - 1);
    if (prev) prev.hidden = m !== 'present';
    if (next) next.hidden = m !== 'present';
    if (counter) counter.hidden = m !== 'present';
    if (fullButton) fullButton.hidden = narrow.matches || !document.fullscreenEnabled;
    if (modeButton) {
      modeButton.hidden = narrow.matches;
      modeButton.setAttribute('aria-pressed', String(m === 'list'));
    }
    if (m === 'present') {
      fit();
      warnOverflow();
    } else if (scroll) {
      slides[index].scrollIntoView({ block: 'start' });
    }
    if (announce && status) status.textContent = `${index + 1} / ${total} 枚目: ${headingOf(slides[index])}`;
    const hash = `#${index + 1}`;
    if (location.hash !== hash) history.replaceState(null, '', hash);
  }

  function go(i) {
    const target = clamp(i);
    if (target === index) return;
    index = target;
    render({ announce: true, scroll: true });
  }

  /** 一覧モードで画面の上端に近いスライドを現在のスライドにする */
  function nearestInList() {
    const found = slides.findIndex((s) => s.getBoundingClientRect().bottom > 0);
    return found < 0 ? index : found;
  }

  prev?.addEventListener('click', () => go(index - 1));
  next?.addEventListener('click', () => go(index + 1));
  modeButton?.addEventListener('click', () => {
    if (mode() === 'list') index = nearestInList();
    preferList = !preferList;
    render({ scroll: true });
  });

  if (fullButton) {
    fullButton.addEventListener('click', () => {
      if (document.fullscreenElement) void document.exitFullscreen();
      else {
        if (mode() === 'list') {
          index = nearestInList();
          preferList = false;
        }
        void root.requestFullscreen().then(() => render());
      }
    });
    document.addEventListener('fullscreenchange', () => {
      const label = fullButton.querySelector('.deck-button-label');
      if (label) label.textContent = document.fullscreenElement ? '全画面を終了' : '全画面で表示';
      render();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (mode() !== 'present' || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t instanceof HTMLElement && t.closest('input, textarea, select, [contenteditable]')) return;
    const onControl = t instanceof HTMLElement && t.closest('a, button');
    let to = null;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
        to = index + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        to = index - 1;
        break;
      case ' ':
        if (onControl) return;
        to = e.shiftKey ? index - 1 : index + 1;
        break;
      case 'Home':
        to = 0;
        break;
      case 'End':
        to = total - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    go(to);
  });

  window.addEventListener('hashchange', () => go(fromHash()));
  narrow.addEventListener('change', () => render({ scroll: true }));
  new ResizeObserver(() => fit()).observe(deck);

  index = fromHash();
  render({ scroll: index > 0 });
})();
