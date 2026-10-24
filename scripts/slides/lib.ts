/**
 * スライド（HTML のデッキ）の共通処理。依存ゼロ（Node.js の型除去で実行）。
 *
 * - トークン: packages/tokens の Resolver（scripts/lib/tokens.ts）で semantic トークンを解決し、CSS 変数を作る。
 *   `make tokens` を実行していなくても動く。変数名は tokens.css と同じ（--8341-*）
 * - HTML: スライドのソースを小さな木に読み込む（ソースはエージェントが書く整った HTML を前提にする）
 * - 検査: docs/rulebook/07-slides.md のルール（S1〜S20）のうち、静的に確かめられるもの
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  THEME_SELECTOR,
  dimensionToCss,
  durationToCss,
  letterSpacingToCss,
  shadowToCss,
} from '../../packages/tokens/scripts/lib/css.ts';
import {
  PREFIX,
  THEMES,
  colorToCssRgba,
  cssVarName,
  resolvedTokens,
} from '../../packages/tokens/scripts/lib/tokens.ts';
import type { DtcgColor, DtcgDimension } from '../../packages/tokens/scripts/lib/tokens.ts';

export const SLIDES_DIR = import.meta.dirname;
export const REPO_ROOT = resolve(SLIDES_DIR, '../..');

// ---------------------------------------------------------------------------
// ルールの定数（docs/rulebook/07-slides.md と合わせる）
// ---------------------------------------------------------------------------

const LAYOUTS = [
  'title',
  'section',
  'statement',
  'content',
  'columns',
  'stats',
  'steps',
  'figure',
  'table',
  'summary',
] as const;

/** ソースで使えるクラス（S9）。増やすときは deck.css と 07-slides.md も直す */
const ALLOWED_CLASSES = new Set([
  'slide',
  'subtitle',
  'meta',
  'eyebrow',
  'lead',
  'source',
  'notes',
  'col',
  'card',
  'stat',
  'stat-value',
  'stat-label',
  'steps',
  'num',
  'callout',
  'callout-info',
  'callout-success',
  'callout-warning',
  'callout-danger',
  'tag',
  'tag-key',
  'tag-success',
  'tag-warning',
  'tag-danger',
  'chart-key',
  'chart-base',
  'chart-axis',
  'chart-label',
  'chart-label-subtle',
  'visually-hidden',
]);

const LIMITS = {
  listItems: 5,
  listDepth: 2,
  slideChars: 150,
  itemChars: 40,
  headingChars: 40,
  emphasis: 2,
  tableRows: 6,
  tableCols: 5,
} as const;

/** 行き先が分からないリンク文言（05 文言） */
const VAGUE_LINK_TEXT = new Set(['こちら', 'ここ', '詳細', '詳しくはこちら', 'リンク', 'click here', 'here', 'more']);

const FORBIDDEN_TAGS = new Set(['style', 'script', 'link', 'font', 'center', 'marquee', 'blink', 'iframe']);

// ---------------------------------------------------------------------------
// トークン → CSS 変数
// ---------------------------------------------------------------------------

/** build.ts（tokens.css）と同じ規則（packages/tokens/scripts/lib/css.ts）で値を CSS にする */
function cssValue(name: string, type: string, path: string[], v: unknown): string {
  if (typeof v === 'string') return v;
  switch (type) {
    case 'color':
      return colorToCssRgba(v as DtcgColor);
    case 'dimension':
      return dimensionToCss(v as DtcgDimension, path);
    case 'fontFamily':
      return (Array.isArray(v) ? v : [v]).map((f) => (/[\s\d]/.test(String(f)) ? `"${f}"` : String(f))).join(', ');
    case 'duration':
      return durationToCss(v as Parameters<typeof durationToCss>[0]);
    case 'cubicBezier':
      return `cubic-bezier(${(v as number[]).join(', ')})`;
    case 'shadow':
      return shadowToCss(v as Parameters<typeof shadowToCss>[0]);
    default:
      if (typeof v === 'number' && name.endsWith('.letter-spacing')) return letterSpacingToCss(v);
      return String(v);
  }
}

function block(selector: string, lines: string[], colorScheme?: string): string {
  const scheme = colorScheme ? `  color-scheme: ${colorScheme};\n` : '';
  return `${selector} {\n${scheme}${lines.map((l) => `  ${l}`).join('\n')}\n}\n`;
}

/**
 * semantic トークンだけの CSS 変数（primitive は出さない＝スライドから参照できない）。
 * テーマ非依存 → :root、テーマ依存 → light / dark / OS 追従の 3 ブロック（tokens.css と同じ切り替え方）
 */
export function tokenCss(): { css: string; names: Set<string> } {
  const names = new Set<string>();
  const base: string[] = [];
  const themed: Record<string, string[]> = {};
  for (const theme of THEMES) {
    themed[theme] = [];
    for (const t of resolvedTokens(theme)) {
      if (t.layer !== 'semantic') continue;
      const line = `${cssVarName(t.name)}: ${cssValue(t.name, t.type, t.path, t.resolved)};`;
      names.add(cssVarName(t.name));
      if (t.themed) themed[theme]?.push(line);
      else if (theme === THEMES[0]) base.push(line);
    }
  }
  const light = themed.light ?? [];
  const dark = themed.dark ?? [];
  const media = block(THEME_SELECTOR.darkMediaSelector, dark, 'dark').replace(/^/gm, '  ').trimEnd();
  const css = [
    `/* ${PREFIX}-ui のトークン（semantic のみ。scripts/slides/lib.ts が packages/tokens/src から生成） */`,
    block(':root', base),
    block(THEME_SELECTOR.light, light, 'light'),
    block(THEME_SELECTOR.dark, dark, 'dark'),
    `@media ${THEME_SELECTOR.darkMedia} {\n${media}\n}\n`,
  ].join('\n');
  return { css, names };
}

// ---------------------------------------------------------------------------
// HTML の木
// ---------------------------------------------------------------------------

export interface El {
  type: 'el';
  tag: string;
  attrs: [string, string | null][];
  children: Node[];
  line: number;
  parent?: El;
}
interface Text {
  type: 'text';
  value: string;
}
interface Comment {
  type: 'comment';
  value: string;
}
export type Node = El | Text | Comment;

const VOID = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr',
]);
const RAW_TEXT = new Set(['script', 'style']);

class ParseError extends Error {
  line: number;
  constructor(message: string, line: number) {
    super(message);
    this.line = line;
  }
}

function parseAttrs(src: string): [string, string | null][] {
  const out: [string, string | null][] = [];
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const m of src.matchAll(re)) {
    const [, name, dq, sq, uq] = m;
    if (!name) continue;
    out.push([name.toLowerCase(), dq ?? sq ?? uq ?? null]);
  }
  return out;
}

/** 整った HTML を木にする。閉じタグの対応が崩れていたら ParseError */
export function parseHtml(html: string): El {
  const root: El = { type: 'el', tag: '#root', attrs: [], children: [], line: 1 };
  const stack: El[] = [root];
  const re =
    /<!--([\s\S]*?)-->|<!doctype[^>]*>|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/gi;
  let last = 0;
  const lineAt = (i: number) => html.slice(0, i).split('\n').length;
  const top = () => stack[stack.length - 1] as El;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    if (m.index > last) top().children.push({ type: 'text', value: html.slice(last, m.index) });
    last = re.lastIndex;
    const [whole, comment, closeTag, openTag, rawAttrs = ''] = m;
    if (comment !== undefined) {
      top().children.push({ type: 'comment', value: comment });
    } else if (closeTag) {
      const tag = closeTag.toLowerCase();
      const cur = top();
      if (cur.tag !== tag)
        throw new ParseError(
          `</${tag}> に対応する開始タグがありません（開いているのは <${cur.tag}>）`,
          lineAt(m.index),
        );
      stack.pop();
    } else if (openTag) {
      const tag = openTag.toLowerCase();
      const selfClosing = /\/\s*$/.test(rawAttrs);
      const el: El = {
        type: 'el',
        tag,
        attrs: parseAttrs(rawAttrs.replace(/\/\s*$/, '')),
        children: [],
        line: lineAt(m.index),
        parent: top(),
      };
      top().children.push(el);
      if (RAW_TEXT.has(tag)) {
        const end = html.toLowerCase().indexOf(`</${tag}`, last);
        if (end < 0) throw new ParseError(`<${tag}> が閉じられていません`, el.line);
        el.children.push({ type: 'text', value: html.slice(last, end) });
        const close = html.indexOf('>', end);
        re.lastIndex = last = close + 1;
      } else if (!VOID.has(tag) && !selfClosing) {
        stack.push(el);
      }
    } else if (whole) {
      // doctype は捨てる（出力側で付け直す）
    }
  }
  if (last < html.length) top().children.push({ type: 'text', value: html.slice(last) });
  if (stack.length > 1) {
    const open = top();
    throw new ParseError(`<${open.tag}> が閉じられていません`, open.line);
  }
  return root;
}

export const attr = (el: El, name: string): string | null | undefined => el.attrs.find(([k]) => k === name)?.[1];
const hasAttr = (el: El, name: string) => el.attrs.some(([k]) => k === name);
export function setAttr(el: El, name: string, value: string | null) {
  const found = el.attrs.find(([k]) => k === name);
  if (found) found[1] = value;
  else el.attrs.push([name, value]);
}
export const classes = (el: El) => (attr(el, 'class') ?? '').split(/\s+/).filter(Boolean);
export const hasClass = (el: El, c: string) => classes(el).includes(c);
export const elements = (n: El) => n.children.filter((c): c is El => c.type === 'el');

function walk(n: El, fn: (el: El) => void) {
  for (const c of elements(n)) {
    fn(c);
    walk(c, fn);
  }
}
export function find(n: El, pred: (el: El) => boolean): El[] {
  const out: El[] = [];
  walk(n, (el) => {
    if (pred(el)) out.push(el);
  });
  return out;
}
export const findTag = (n: El, tag: string) => find(n, (el) => el.tag === tag);

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s: string) =>
  s.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (all, e: string) => {
    if (e[0] === '#')
      return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
    return ENTITIES[e.toLowerCase()] ?? all;
  });
export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 要素の文字（発表者メモ・出典・SVG の中は除くかを選べる） */
export function textOf(n: Node, skip: (el: El) => boolean = () => false): string {
  if (n.type === 'text') return decode(n.value);
  if (n.type === 'comment') return '';
  if (skip(n)) return '';
  return n.children.map((c) => textOf(c, skip)).join('');
}
export const compact = (s: string) => s.replace(/\s+/g, ' ').trim();
/** 空白を除いた字数（和文の分量の目安） */
const charCount = (s: string) => s.replace(/\s+/g, '').length;

export function serialize(n: Node): string {
  if (n.type === 'text') return n.value;
  if (n.type === 'comment') return `<!--${n.value}-->`;
  const inner = n.children.map(serialize).join('');
  if (n.tag === '#root') return inner;
  const attrs = n.attrs.map(([k, v]) => (v === null ? ` ${k}` : ` ${k}="${v.replace(/"/g, '&quot;')}"`)).join('');
  if (VOID.has(n.tag)) return `<${n.tag}${attrs}>`;
  return `<${n.tag}${attrs}>${inner}</${n.tag}>`;
}

// ---------------------------------------------------------------------------
// デッキの読み込み
// ---------------------------------------------------------------------------

interface Deck {
  root: El;
  html?: El;
  body?: El;
  title: string;
  lang: string | null | undefined;
  theme: string | null | undefined;
  description: string | null | undefined;
  slides: El[];
}

export function readDeck(file: string): Deck {
  const root = parseHtml(readFileSync(file, 'utf8'));
  const html = findTag(root, 'html')[0];
  const body = findTag(root, 'body')[0];
  const titleEl = findTag(root, 'title')[0];
  const desc = find(root, (el) => el.tag === 'meta' && attr(el, 'name') === 'description')[0];
  return {
    root,
    html,
    body,
    title: titleEl ? compact(textOf(titleEl)) : '',
    lang: html ? attr(html, 'lang') : undefined,
    theme: html ? attr(html, 'data-theme') : undefined,
    description: desc ? attr(desc, 'content') : undefined,
    slides: body ? elements(body).filter((el) => el.tag === 'section' && hasClass(el, 'slide')) : [],
  };
}

// ---------------------------------------------------------------------------
// 検査
// ---------------------------------------------------------------------------

export interface Issue {
  id: string;
  level: 'error' | 'warning';
  /** 1 始まりのスライド番号（デッキ全体なら undefined） */
  slide?: number;
  line?: number;
  message: string;
}

const isNotes = (el: El) => el.tag === 'aside' && hasClass(el, 'notes');
/** 分量（S4）に数えない要素: 発表者メモ・出典・図と表（図表は S12〜S14 で別に見る） */
const notCounted = (el: El) => isNotes(el) || hasClass(el, 'source') || el.tag === 'svg' || el.tag === 'table';

function listDepth(el: El): number {
  let d = 0;
  for (let p: El | undefined = el; p; p = p.parent) if (p.tag === 'ul' || p.tag === 'ol') d++;
  return d;
}

export function checkDeck(deck: Deck): Issue[] {
  const issues: Issue[] = [];
  const add = (i: Issue) => issues.push(i);

  if (!deck.html) add({ id: 'doc-html', level: 'error', message: '<html> がありません' });
  if (!deck.lang)
    add({ id: 'doc-lang', level: 'error', message: '<html lang="ja"> のように言語を書いてください（S19）' });
  if (!deck.title) add({ id: 'doc-title', level: 'error', message: '<title> にデッキの題を書いてください（S19）' });
  if (deck.theme && !['light', 'dark'].includes(deck.theme))
    add({ id: 'doc-theme', level: 'error', message: `data-theme は light か dark です（"${deck.theme}"）` });
  if (!deck.body) {
    add({ id: 'structure', level: 'error', message: '<body> がありません' });
    return issues;
  }

  // body の直下は section.slide だけ
  for (const c of deck.body.children) {
    if (c.type === 'text' && c.value.trim())
      add({
        id: 'structure',
        level: 'error',
        message: `<body> の直下に文字があります: "${compact(c.value).slice(0, 20)}"`,
      });
    if (c.type === 'el' && !(c.tag === 'section' && hasClass(c, 'slide')))
      add({
        id: 'structure',
        level: 'error',
        line: c.line,
        message: `<body> の直下には <section class="slide"> だけを置きます（<${c.tag}>）`,
      });
  }
  if (deck.slides.length === 0) add({ id: 'structure', level: 'error', message: 'スライドがありません' });

  // 文書全体: 禁止タグ・style・クラス
  walk(deck.root, (el) => {
    if (FORBIDDEN_TAGS.has(el.tag) && !(el.tag === 'link' && attr(el, 'rel') !== 'stylesheet'))
      add({
        id: el.tag === 'style' || el.tag === 'link' ? 'style-tag' : 'tag-forbidden',
        level: 'error',
        line: el.line,
        message: `<${el.tag}> は使えません。見た目と動きはビルドが付けます（S9）`,
      });
    if (hasAttr(el, 'style'))
      add({ id: 'style-attr', level: 'error', line: el.line, message: `<${el.tag}> の style 属性は使えません（S9）` });
    if (el.attrs.some(([k]) => k.startsWith('on')))
      add({ id: 'tag-forbidden', level: 'error', line: el.line, message: `<${el.tag}> にイベント属性は書けません` });
    for (const c of classes(el))
      if (!ALLOWED_CLASSES.has(c))
        add({
          id: 'class-unknown',
          level: 'error',
          line: el.line,
          message: `クラス "${c}" は使えません。使えるクラスは docs/rulebook/07-slides.md の「使えるクラス」（S9）`,
        });
  });

  let h1Count = 0;
  deck.slides.forEach((slide, i) => {
    const n = i + 1;
    const at = (id: string, level: Issue['level'], message: string, line = slide.line) =>
      add({ id, level, slide: n, line, message });
    const layout = attr(slide, 'data-layout');
    if (!layout) at('layout-missing', 'error', 'data-layout を指定してください（title / content など）');
    else if (!(LAYOUTS as readonly string[]).includes(layout))
      at('layout-unknown', 'error', `data-layout="${layout}" はありません。使えるのは ${LAYOUTS.join(' / ')}`);

    // 見出し（S2）
    const h1 = findTag(slide, 'h1');
    const h2 = findTag(slide, 'h2');
    const h3 = findTag(slide, 'h3');
    h1Count += h1.length;
    if (layout === 'title') {
      if (h1.length !== 1) at('heading-h1', 'error', '表紙には h1 を 1 つ置きます');
      if (h2.length) at('heading-h2', 'error', '表紙に h2 は置きません（デッキの題は h1）');
      if (h3.length) at('heading-level', 'error', '表紙に h3 は置きません');
      if (i !== 0) at('heading-h1', 'warning', '表紙は先頭に置きます');
    } else {
      if (h1.length) at('heading-h1', 'error', 'h1 は表紙だけに置きます。このスライドの見出しは h2');
      if (h2.length !== 1) at('heading-h2', 'error', `スライドには h2 を 1 つ置きます（${h2.length} 個）`);
    }
    for (const h of find(slide, (el) => /^h[4-6]$/.test(el.tag)))
      at('heading-level', 'error', `<${h.tag}> は使えません。スライドの中の小見出しは h3 までにします`, h.line);
    for (const h of [...h1, ...h2]) {
      const len = charCount(textOf(h));
      if (len === 0) at('heading-empty', 'error', '見出しが空です', h.line);
      if (len > LIMITS.headingChars)
        at('text-heading', 'warning', `見出しが ${len} 字です。${LIMITS.headingChars} 字（2 行）以内に（S4）`, h.line);
    }

    // 箇条書き（S3・S4）
    for (const list of find(slide, (el) => el.tag === 'ul' || el.tag === 'ol')) {
      const items = elements(list).filter((c) => c.tag === 'li');
      if (items.length > LIMITS.listItems)
        at(
          'list-items',
          'error',
          `箇条書きが ${items.length} 項目あります。${LIMITS.listItems} 項目以内に分けてください（S3）`,
          list.line,
        );
      if (listDepth(list) > LIMITS.listDepth)
        at('list-depth', 'error', `箇条書きの入れ子は ${LIMITS.listDepth} 段までです（S3）`, list.line);
      for (const li of items) {
        const len = charCount(
          textOf(li, (el) => el.tag === 'ul' || el.tag === 'ol' || el.tag === 'p' || /^h\d$/.test(el.tag)),
        );
        if (len > LIMITS.itemChars)
          at(
            'text-item',
            'warning',
            `箇条書きの 1 項目が ${len} 字です。${LIMITS.itemChars} 字（2 行）以内に（S4）`,
            li.line,
          );
      }
    }

    // 分量（S4）・強調（S5）
    const chars = charCount(textOf(slide, notCounted));
    if (chars > LIMITS.slideChars)
      at(
        'text-slide',
        'warning',
        `本文が ${chars} 字あります。${LIMITS.slideChars} 字以内にし、残りは発表者メモへ（S4・S8）`,
      );
    const strong = findTag(slide, 'strong').length + findTag(slide, 'b').length;
    if (strong > LIMITS.emphasis)
      at('emphasis-many', 'warning', `強調が ${strong} か所あります。${LIMITS.emphasis} か所までに（S5）`);
    if (findTag(slide, 'b').length) at('emphasis-tag', 'warning', '<b> ではなく <strong> を使います');

    // リンク（S6）
    for (const a of findTag(slide, 'a')) {
      if (!attr(a, 'href')) at('link-href', 'error', '<a> に href がありません', a.line);
      const text = compact(textOf(a));
      if (!text) at('link-text', 'error', 'リンクの文字が空です', a.line);
      else if (VAGUE_LINK_TEXT.has(text.toLowerCase()))
        at(
          'link-text',
          'error',
          `リンクの文字「${text}」では行き先が分かりません。行き先を文で書いてください（S6）`,
          a.line,
        );
    }

    // 画像・図（S11〜S13）
    for (const img of findTag(slide, 'img'))
      if (!hasAttr(img, 'alt')) at('img-alt', 'error', '<img> に alt がありません。飾りなら alt=""（S13）', img.line);
    for (const svg of findTag(slide, 'svg')) {
      let nested = false;
      for (let p = svg.parent; p; p = p.parent) if (p.tag === 'svg') nested = true;
      if (nested) continue;
      const hidden = attr(svg, 'aria-hidden') === 'true';
      const named =
        hasAttr(svg, 'aria-label') || hasAttr(svg, 'aria-labelledby') || elements(svg).some((c) => c.tag === 'title');
      if (!hidden && (attr(svg, 'role') !== 'img' || !named))
        at(
          'svg-name',
          'error',
          '<svg> には role="img" と aria-label（または <title>）を付けます。飾りなら aria-hidden="true"（S13）',
          svg.line,
        );
      walk(svg, (el) => {
        for (const k of ['fill', 'stroke', 'color', 'stop-color']) {
          const v = attr(el, k);
          if (v && !['none', 'currentcolor', 'transparent'].includes(v.toLowerCase()))
            at('chart-color', 'error', `SVG の ${k}="${v}" は使えません。chart-* クラスで色を付けます（S12）`, el.line);
        }
      });
    }
    if (layout === 'figure') {
      const fig = findTag(slide, 'figure')[0];
      if (!fig) at('figure-missing', 'error', 'figure レイアウトには <figure> を置きます');
      else if (!findTag(fig, 'figcaption').length)
        at('figure-caption', 'warning', '<figcaption> で図の読み方か出典を書きます', fig.line);
    }

    // 表（S14）
    for (const table of findTag(slide, 'table')) {
      if (!findTag(table, 'th').length) at('table-th', 'error', '表に見出しセル（th）がありません（S14）', table.line);
      const rows = find(table, (el) => el.tag === 'tr' && el.parent?.tag !== 'thead');
      const cols = Math.max(0, ...findTag(table, 'tr').map((tr) => elements(tr).length));
      if (rows.length > LIMITS.tableRows || cols > LIMITS.tableCols)
        at(
          'table-size',
          'warning',
          `表が ${rows.length} 行 × ${cols} 列です。${LIMITS.tableRows} 行 × ${LIMITS.tableCols} 列以内に（S14）`,
          table.line,
        );
    }

    // レイアウトごとの個数
    const count = (pred: (el: El) => boolean) => elements(slide).filter(pred).length;
    const range = (what: string, got: number, min: number, max: number) => {
      if (got < min || got > max)
        at(
          'layout-count',
          got === 0 ? 'error' : 'warning',
          `${layout} レイアウトの${what}は ${min}〜${max} 個です（${got} 個）`,
        );
    };
    if (layout === 'columns')
      range(
        ' .col ',
        count((el) => hasClass(el, 'col')),
        2,
        3,
      );
    if (layout === 'stats')
      range(
        ' .stat ',
        count((el) => hasClass(el, 'stat')),
        2,
        4,
      );
    if (layout === 'steps') {
      const steps = elements(slide).find((el) => el.tag === 'ol' && hasClass(el, 'steps'));
      range('手順（ol.steps の li）', steps ? elements(steps).length : 0, 3, 5);
    }
    if (layout === 'table' && !findTag(slide, 'table').length)
      at('layout-count', 'error', 'table レイアウトには <table> を置きます');

    // 発表者メモ・出典はスライドの直下に
    for (const notes of find(slide, isNotes))
      if (notes.parent !== slide) at('notes-place', 'error', 'aside.notes はスライドの直下に置きます', notes.line);
  });
  if (deck.slides.length && h1Count === 0)
    add({
      id: 'heading-h1',
      level: 'error',
      message: '表紙（data-layout="title"）の h1 でデッキの題を示してください（S2）',
    });

  return issues;
}

/** deck.css 自体の監査（S10・S15・S20 の担保。トークン以外の値を書いていないか） */
export function checkCss(css: string, tokenNames: Set<string>): Issue[] {
  const issues: Issue[] = [];
  const lines = css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' ')).split('\n');
  const deckVars = new Set([...css.matchAll(/(--deck-[\w-]+)\s*:/g)].map((m) => m[1]));
  lines.forEach((line, i) => {
    const at = (id: string, message: string) => issues.push({ id, level: 'error', line: i + 1, message });
    if (/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\(/i.test(line))
      at('css-raw-color', `色を直書きしています: ${line.trim()}`);
    if (/:\s*(?:[^;]*\s)?(?:black|white|gray|grey|red|blue|green|yellow)\b/i.test(line) && !/font|content/.test(line))
      at('css-raw-color', `色名を直書きしています: ${line.trim()}`);
    // メディアクエリは var() を使えないため px を許す
    if (!/^\s*@media/.test(line))
      for (const m of line.matchAll(/(-?\d*\.?\d+)px\b/g))
        if (!['0', '1', '-1'].includes(m[1] ?? '')) at('css-raw-length', `px を直書きしています: ${line.trim()}`);
    if (/font-weight:\s*\d/.test(line)) at('css-font-weight', `太さはトークンで指定します: ${line.trim()}`);
    if (/text-align:\s*(?:center|justify)/.test(line))
      at('css-align', `中央揃え・両端揃えは使いません（S15）: ${line.trim()}`);
    if (/\b(?:transition|animation)\s*:/.test(line))
      at('css-motion', `切り替えの動きは使いません（S15）: ${line.trim()}`);
    if (/linear-gradient|radial-gradient/.test(line))
      at('css-decoration', `グラデーションは使いません（S15）: ${line.trim()}`);
    if (/--color-|--spacing-|--text-/.test(line.replace(/--\d+-|--deck-/g, '')))
      at('css-theme-var', `Tailwind のテーマ変数は参照しません: ${line.trim()}`);
    for (const m of line.matchAll(/var\((--[\w-]+)/g)) {
      const name = m[1] ?? '';
      if (name.startsWith(`--${PREFIX}-color-primitive`))
        at('css-primitive', `primitive トークンは参照しません: ${name}`);
      else if (name.startsWith(`--${PREFIX}-`) && !tokenNames.has(name))
        at('css-unknown-var', `存在しないトークンです: ${name}`);
      else if (!name.startsWith(`--${PREFIX}-`) && !deckVars.has(name))
        at('css-unknown-var', `未定義の変数です: ${name}`);
    }
  });
  return issues;
}

export function formatIssues(file: string, issues: Issue[]): string {
  return issues
    .map((i) => {
      const where = [i.slide ? `スライド ${i.slide}` : '', i.line ? `${file}:${i.line}` : file]
        .filter(Boolean)
        .join(' / ');
      return `${i.level === 'error' ? '✖' : '⚠'} [${i.id}] ${i.message}（${where}）`;
    })
    .join('\n');
}
