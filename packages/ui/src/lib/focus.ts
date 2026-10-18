/**
 * フォーカス表示（二重リング: 内側が黄 color.focus.ring、外側が color.focus.outline）。
 * Base UI は data-focus-visible を付けないため、:focus-visible で描く。
 * 実体は styles/theme.css の @utility focus-ring。
 */
export const focusRing = 'focus-ring';
/** 子孫にフォーカスがあるとき自分にリングを描く（カード全体をリンクにする場合など） */
export const focusRingWithin = 'focus-ring-within';
