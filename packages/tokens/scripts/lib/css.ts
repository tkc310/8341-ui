/**
 * DTCG の値を CSS にする規則と、テーマのセレクタ。
 * tokens.css を作る build.ts（Style Dictionary の transform）と、スライドのデッキ（scripts/slides/lib.ts）が同じ規則を使う。
 */
import type { DtcgDimension } from './tokens.ts';

/** テーマの切り替え。明示が無ければ OS の設定に従う */
export const THEME_SELECTOR = {
  light: ':root, .light, [data-theme="light"]',
  dark: '.dark, [data-theme="dark"]',
  darkMedia: '(prefers-color-scheme: dark)',
  darkMediaSelector: ':root:not(.light):not([data-theme="light"])',
} as const;

/** px の寸法は rem に（ユーザーの文字サイズ設定に追従させる）。罫線など 3px 以下、9999px、ブレークポイントは px のまま */
export function dimensionToCss({ value, unit }: DtcgDimension, path: string[]): string {
  if (unit === 'rem') return `${value}rem`;
  if (value <= 3 || value >= 9999 || path[0] === 'breakpoint') return `${value}px`;
  return `${Number((value / 16).toFixed(4))}rem`;
}

/** 字間（文字サイズに対する比率）を em に */
export const letterSpacingToCss = (ratio: number) => `${ratio}em`;

export const durationToCss = ({ value, unit }: { value: number; unit: 'ms' | 's' }) => `${value}${unit}`;

interface ShadowLayer {
  color: { hex: string; alpha?: number } | string;
  offsetX: DtcgDimension;
  offsetY: DtcgDimension;
  blur: DtcgDimension;
  spread: DtcgDimension;
  inset?: boolean;
}

/** 影（1 つまたは配列）を box-shadow に。入れ子の値は Style Dictionary の他の transform が届かないため、ここでまとめて変換する */
export function shadowToCss(v: ShadowLayer | ShadowLayer[]): string {
  const len = (d: DtcgDimension) => `${d.value}${d.unit}`;
  const color = (c: ShadowLayer['color']) => {
    if (typeof c === 'string') return c;
    const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(c.hex.slice(i, i + 2), 16));
    return c.alpha === undefined || c.alpha === 1 ? c.hex : `rgb(${r} ${g} ${b} / ${c.alpha})`;
  };
  return (Array.isArray(v) ? v : [v])
    .map(
      (l) =>
        `${l.inset ? 'inset ' : ''}${len(l.offsetX)} ${len(l.offsetY)} ${len(l.blur)} ${len(l.spread)} ${color(l.color)}`,
    )
    .join(', ');
}
