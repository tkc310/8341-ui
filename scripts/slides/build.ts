/**
 * スライドのソース（HTML）から、8341-ui のトークンで組んだ 1 ファイルのデッキを作る。
 * 手順とルールは .claude/skills/ds-slides/SKILL.md と docs/rulebook/07-slides.md。
 *
 * 実行: make slides SRC=slides/foo.html [OUT=dist/slides/foo.html] [THEME=light|dark|auto]
 *       （node scripts/slides/build.ts <ソース> [--out <出力>] [--theme light|dark|auto]）
 *
 * - 先に検査（check.ts と同じ）を行い、エラーがあれば出力しない
 * - 出力は CSS・JavaScript・アイコンを埋め込んだ 1 つの HTML。オフラインで開け、印刷すると 1 枚 1 ページの PDF になる
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import {
  type El,
  type Node,
  REPO_ROOT,
  SLIDES_DIR,
  attr,
  checkCss,
  checkDeck,
  classes,
  compact,
  elements,
  escapeHtml,
  find,
  findTag,
  formatIssues,
  hasClass,
  parseHtml,
  readDeck,
  serialize,
  setAttr,
  textOf,
  tokenCss,
} from './lib.ts';

/** Icon コンポーネント（packages/ui/src/components/ui/Icon）と同じ 24×24・線幅 2 の形 */
const ICON_PATHS: Record<string, string> = {
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/>',
  warning: '<path d="M12 3.5L2.5 20h19z"/><path d="M12 10v4.5M12 17v.5"/>',
  danger: '<path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3z"/><path d="M12 7.5v5.5M12 16v.5"/>',
  external:
    '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  'chevron-left': '<path d="M15 6l-6 6 6 6"/>',
  'chevron-right': '<path d="M9 6l6 6-6 6"/>',
};
const icon = (name: string, className = '') =>
  `<svg${className ? ` class="${className}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[name]}</svg>`;

/** NotificationBanner と同じ種別名（色とアイコンだけに頼らず文字でも伝える） */
const TONE_LABEL: Record<string, string> = { info: 'お知らせ', success: '完了', warning: '注意', danger: 'エラー' };

const fragment = (html: string): Node[] => parseHtml(html).children;
const el = (tag: string, attrs: [string, string | null][], children: Node[], parent?: El): El => {
  const e: El = { type: 'el', tag, attrs, children, line: 0, parent };
  for (const c of children) if (c.type === 'el') c.parent = e;
  return e;
};

/** 連続する .col / .stat を、列のグリッド（.deck-cols / .deck-stats）で包む */
function wrapRuns(slide: El, cls: string, wrapperClass: string) {
  const out: Node[] = [];
  let run: El | null = null;
  for (const c of slide.children) {
    if (c.type === 'el' && hasClass(c, cls)) {
      if (!run) {
        run = el('div', [['class', wrapperClass]], [], slide);
        out.push(run);
      }
      run.children.push(c);
      c.parent = run;
    } else if (run && c.type === 'text' && !c.value.trim()) {
      run.children.push(c);
    } else {
      run = null;
      out.push(c);
    }
  }
  slide.children = out;
}

function decorateCallouts(slide: El) {
  for (const box of find(slide, (e) => hasClass(e, 'callout'))) {
    const tone =
      classes(box)
        .find((c) => c.startsWith('callout-'))
        ?.slice('callout-'.length) ?? 'info';
    const label = `<span class="visually-hidden">${TONE_LABEL[tone] ?? TONE_LABEL.info}: </span>`;
    const first = elements(box)[0];
    if (first) first.children.unshift(...fragment(label));
    const body = el('div', [['class', 'deck-callout-body']], box.children, box);
    box.children = [...fragment(icon(tone, 'deck-callout-icon')), body];
  }
}

/** 新しいタブで開くリンクに、Link と同じ外部アイコンと読み上げの補足を付ける */
function decorateLinks(slide: El) {
  for (const a of findTag(slide, 'a')) {
    if (attr(a, 'target') !== '_blank') continue;
    const rel = new Set((attr(a, 'rel') ?? '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    setAttr(a, 'rel', [...rel].join(' '));
    a.children.push(...fragment(`${icon('external')}<span class="visually-hidden">（新しいタブで開きます）</span>`));
  }
}

function buildSlide(slide: El, i: number, total: number, deckTitle: string): string {
  const n = i + 1;
  const layout = attr(slide, 'data-layout') ?? 'content';
  const heading = find(slide, (e) => e.tag === 'h1' || e.tag === 'h2')[0];
  const headingId = heading ? (attr(heading, 'id') ?? `slide-${n}-title`) : undefined;
  if (heading && headingId) setAttr(heading, 'id', headingId);

  setAttr(slide, 'id', `slide-${n}`);
  setAttr(slide, 'role', 'group');
  setAttr(slide, 'aria-roledescription', 'スライド');
  if (headingId) setAttr(slide, 'aria-labelledby', headingId);
  else setAttr(slide, 'aria-label', `${n} 枚目`);

  // 発表者メモはスライドの外（直後）へ出す
  const notes = elements(slide).filter((c) => c.tag === 'aside' && hasClass(c, 'notes'));
  slide.children = slide.children.filter((c) => !notes.includes(c as El));

  wrapRuns(slide, 'col', 'deck-cols');
  wrapRuns(slide, 'stat', 'deck-stats');
  decorateCallouts(slide);
  decorateLinks(slide);

  if (layout !== 'title') {
    slide.children.push(
      ...fragment(
        `\n  <footer class="deck-footer"><span>${escapeHtml(deckTitle)}</span><span class="deck-footer-page">${n} / ${total}</span></footer>\n`,
      ),
    );
  }

  const notesHtml = notes
    .map((note) => {
      const inner = note.children.map(serialize).join('').trim();
      const body = /^\s*</.test(inner) ? inner : `<p>${inner}</p>`;
      return `\n<aside class="deck-notes" aria-label="${n} 枚目の発表者メモ"><p class="deck-notes-label" aria-hidden="true">発表者メモ</p>${body}</aside>`;
    })
    .join('');
  return serialize(slide) + notesHtml;
}

function loadDeck(file: string): ReturnType<typeof readDeck> {
  try {
    return readDeck(file);
  } catch (e) {
    const err = e as Error & { line?: number };
    console.error(`✖ [parse] ${err.message}（${relative(process.cwd(), file)}${err.line ? `:${err.line}` : ''}）`);
    return process.exit(1);
  }
}

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { out: { type: 'string', short: 'o' }, theme: { type: 'string' } },
  });
  const src = positionals[0];
  if (!src) {
    console.error('使い方: node scripts/slides/build.ts <ソース.html> [--out <出力.html>] [--theme light|dark|auto]');
    process.exit(2);
  }
  const file = resolve(process.cwd(), src);
  const deck = loadDeck(file);
  const tokens = tokenCss();
  const deckCss = readFileSync(resolve(SLIDES_DIR, 'deck.css'), 'utf8');
  const deckJs = readFileSync(resolve(SLIDES_DIR, 'deck.js'), 'utf8');

  const issues = [...checkDeck(deck), ...checkCss(deckCss, tokens.names)];
  const errors = issues.filter((i) => i.level === 'error');
  if (issues.length) console.log(formatIssues(relative(process.cwd(), file), issues));
  if (errors.length) {
    console.error(`\n✖ エラーが ${errors.length} 件あるため、ビルドしませんでした`);
    process.exit(1);
  }

  const theme = values.theme ?? deck.theme ?? 'light';
  if (!['light', 'dark', 'auto'].includes(theme)) {
    console.error(`--theme は light / dark / auto のどれかです（${theme}）`);
    process.exit(2);
  }
  const title = deck.title;
  const total = deck.slides.length;
  const slidesHtml = deck.slides.map((s, i) => buildSlide(s, i, total, title)).join('\n');
  const themeAttr = theme === 'auto' ? '' : ` data-theme="${theme}"`;
  const description = deck.description ? `\n<meta name="description" content="${escapeHtml(deck.description)}">` : '';

  const out = `<!doctype html>
<html lang="${escapeHtml(deck.lang ?? 'ja')}"${themeAttr} data-mode="list">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="8341-ui slides">
<title>${escapeHtml(title)}</title>${description}
<style>
${tokens.css}
</style>
<style>
${deckCss}
</style>
</head>
<body>
<header class="deck-bar">
  <p class="deck-bar-title">${escapeHtml(title)}</p>
  <button type="button" class="deck-button" id="deck-prev" hidden>${icon('chevron-left')}<span class="deck-button-label">前のスライド</span></button>
  <span class="deck-counter" id="deck-counter" hidden>1 / ${total}</span>
  <button type="button" class="deck-button" id="deck-next" hidden><span class="deck-button-label">次のスライド</span>${icon('chevron-right')}</button>
  <button type="button" class="deck-button" id="deck-mode" aria-pressed="true" hidden><span class="deck-button-label">一覧で表示</span></button>
  <button type="button" class="deck-button" id="deck-fullscreen"><span class="deck-button-label">全画面で表示</span></button>
</header>
<main class="deck" id="deck">
${slidesHtml}
</main>
<p class="visually-hidden" id="deck-status" role="status" aria-live="polite"></p>
<script>
${deckJs}
</script>
</body>
</html>
`;

  const outFile = values.out
    ? resolve(process.cwd(), values.out)
    : resolve(REPO_ROOT, 'dist/slides', `${basename(file, '.html')}.html`);
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, out);
  const warnings = issues.length - errors.length;
  console.log(
    `✔ ${relative(process.cwd(), outFile)}（${total} 枚、テーマ ${theme}${warnings ? `、警告 ${warnings} 件` : ''}）`,
  );
  // 見出しの一覧（構成の確認用）
  deck.slides.forEach((s, i) => {
    const h = find(s, (e) => e.tag === 'h1' || e.tag === 'h2')[0];
    console.log(`  ${String(i + 1).padStart(2)}. [${attr(s, 'data-layout')}] ${h ? compact(textOf(h)) : ''}`);
  });
}

main();
