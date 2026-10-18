/**
 * semantic トークンと Tailwind v4 のテーマ変数名の対応。build.ts（@theme の生成）と DESIGN.md の生成で共有する。
 */
/**
 * トークンのパス → Tailwind v4 のテーマ変数名。
 * null を返したものは Tailwind に出さない（CSS 変数としてだけ使う）。
 */
export function tailwindName(path: string[]): string | null {
  const [group, kind, ...rest] = path;
  const tail = rest.join('-');
  const named = (base: string, key: string | undefined) => (key === 'default' || key === undefined ? base : `${base}-${key}`);

  if (group === 'color') {
    if (kind === 'primitive') return null;
    if (kind === 'bg') return `--color-${tail}`; // bg-canvas, bg-key, bg-danger-subtle
    if (kind === 'text') return named('--color-fg', tail || undefined); // text-fg, text-fg-subtle, text-fg-on-key
    if (kind === 'icon') return named('--color-icon', tail || undefined);
    if (kind === 'border') return named('--color-border', tail || undefined); // border-border, border-border-input
    if (kind === 'focus') return `--color-focus-${tail}`;
  }
  if (group === 'space') return `--spacing-${[kind, ...rest].join('-')}`; // p-inset-md, gap-stack-lg
  if (group === 'size') {
    const key = [kind, ...rest].join('-');
    if (key === 'content-max') return '--container-content'; // max-w-content
    if (key === 'prose-max') return '--container-prose';
    return `--spacing-${key}`; // h-control-md, size-icon-md, min-h-target-min
  }
  if (group === 'radius') return `--radius-${kind}`;
  if (group === 'shadow') return `--shadow-${kind}`;
  if (group === 'text') {
    const style = kind;
    const prop = rest.join('-');
    if (prop === 'font-size') return `--text-${style}`;
    if (prop === 'line-height') return `--text-${style}--line-height`;
    if (prop === 'letter-spacing') return `--text-${style}--letter-spacing`;
    if (prop === 'font-weight') return `--text-${style}--font-weight`;
    return null; // font-family は --font-sans / --font-mono で扱う
  }
  if (group === 'font' && kind === 'family') return `--font-${tail}`;
  if (group === 'font' && kind === 'weight') return `--font-weight-${tail}`;
  if (group === 'motion' && kind === 'easing') return `--ease-${tail}`;
  if (group === 'breakpoint') return `--breakpoint-${kind}`;
  return null;
}


/** テーマ変数名から、代表的なユーティリティクラスの例を返す（DESIGN.md 用） */
export function utilityExample(themeVar: string | null): string {
  if (!themeVar) return '';
  const m = themeVar.match(/^--([a-z]+(?:-weight)?)-(.+?)(--.+)?$/);
  if (!m) return '';
  const [, ns, key, sub] = m;
  if (sub) return ''; // --text-*--line-height など補助の変数
  switch (ns) {
    case 'color':
      if (key === 'fg' || key?.startsWith('fg-')) return `text-${key}`;
      if (key === 'icon' || key?.startsWith('icon-')) return `text-${key}`;
      if (key === 'border' || key?.startsWith('border-')) return `border-${key}`;
      if (key?.startsWith('focus-')) return `outline-${key}`;
      return `bg-${key}`;
    case 'spacing':
      if (key?.startsWith('stack-') || key?.startsWith('gap-')) return `gap-${key}`;
      if (key?.startsWith('inset-')) return `p-${key}`;
      if (key?.startsWith('icon-')) return `size-${key}`;
      return `h-${key}`;
    case 'container':
      return `max-w-${key}`;
    case 'radius':
      return `rounded-${key}`;
    case 'shadow':
      return `shadow-${key}`;
    case 'text':
      return `text-${key}`;
    case 'font':
      return `font-${key}`;
    case 'font-weight':
      return `font-${key}`;
    case 'ease':
      return `ease-${key}`;
    case 'breakpoint':
      return `${key}:`;
    default:
      return '';
  }
}
