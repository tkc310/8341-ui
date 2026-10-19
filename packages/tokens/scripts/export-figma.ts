/**
 * Figma Variables に取り込める DTCG JSON を書き出す。
 *
 * Figma のネイティブ import の制約（help.figma.com「Modes for variables」）に合わせる。
 *   - 色は srgb / hsl のみ → hex から srgb の components を作る（OKLCH は使えない）
 *   - dimension は px のみ、fontFamily は単一文字列のみ
 *   - typography・shadow・cubicBezier などの複合型は取り込めないため書き出さない
 *   - 1 ファイル = 1 モード。新しいコレクションに取り込むと、全ファイルにあるトークンだけが作られる
 *   - コレクションをまたぐ別名には Figma 固有の ID が要るため、semantic は解決済みの値で書き出す
 *
 * 出力（dist/figma/）
 *   primitives.tokens.json   … 「Primitives」コレクション（モード 1 つ）
 *   light.tokens.json        … 「Semantic」コレクションの Light モード
 *   dark.tokens.json         … 「Semantic」コレクションの Dark モード
 * 取り込み方: Figma の Variables 画面に light と dark を同時にドラッグ＆ドロップ → 2 モードのコレクションになる
 *
 * 実行: make figma
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { type DtcgColor, type DtcgDimension, ROOT, THEMES, resolvedTokens } from './lib/tokens.ts';

const OUT = resolve(ROOT, 'dist/figma');
const SCHEMA = 'https://www.designtokens.org/schemas/2025.10/format.json';

function srgb(c: DtcgColor) {
  const hex = c.hex ?? '#000000';
  const components = [1, 3, 5].map((i) => Number((Number.parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(4)));
  return { colorSpace: 'srgb', components, alpha: c.alpha ?? 1, hex };
}

function toFigma(type: string, value: unknown, path: string[]): { $type: string; $value: unknown } | null {
  switch (type) {
    case 'color':
      return { $type: 'color', $value: srgb(value as DtcgColor) };
    case 'dimension': {
      const d = value as DtcgDimension;
      return { $type: 'dimension', $value: { value: d.unit === 'rem' ? d.value * 16 : d.value, unit: 'px' } };
    }
    case 'fontFamily':
      return { $type: 'fontFamily', $value: Array.isArray(value) ? value[0] : value };
    case 'fontWeight':
    case 'number':
      // 字間は比率のまま渡すと誤解を生むので除外する（Figma の letter spacing は % 指定）
      if (path.includes('letter-spacing')) return null;
      return { $type: 'number', $value: Number(value) };
    case 'duration': {
      const d = value as { value: number; unit: string };
      return { $type: 'duration', $value: { value: d.unit === 'ms' ? d.value / 1000 : d.value, unit: 's' } };
    }
    default:
      return null;
  }
}

function tree(entries: { path: string[]; node: object }[]) {
  const root: Record<string, unknown> = { $schema: SCHEMA };
  for (const { path, node } of entries) {
    let cur = root;
    path.slice(0, -1).forEach((k) => {
      cur[k] ??= {};
      cur = cur[k] as Record<string, unknown>;
    });
    cur[path.at(-1) as string] = node;
  }
  return root;
}

mkdirSync(OUT, { recursive: true });

const defaultTheme = THEMES[0] as string;
const primitives = resolvedTokens(defaultTheme)
  .filter((t) => t.layer === 'primitive')
  .map((t) => ({ path: t.path, node: toFigma(t.type, t.resolved, t.path) }))
  .filter((e): e is { path: string[]; node: { $type: string; $value: unknown } } => e.node !== null);
writeFileSync(resolve(OUT, 'primitives.tokens.json'), `${JSON.stringify(tree(primitives), null, 2)}\n`);

for (const theme of THEMES) {
  const semantic = resolvedTokens(theme)
    .filter((t) => t.layer === 'semantic')
    .map((t) => {
      const f = toFigma(t.type, t.resolved, t.path);
      if (!f) return null;
      const scopes = t.path[0] === 'color' ? { 'com.figma.scopes': scopesFor(t.path) } : undefined;
      return {
        path: t.path,
        node: {
          ...f,
          ...(t.description ? { $description: t.description } : {}),
          ...(scopes ? { $extensions: scopes } : {}),
        },
      };
    })
    .filter((e) => e !== null);
  writeFileSync(resolve(OUT, `${theme}.tokens.json`), `${JSON.stringify(tree(semantic), null, 2)}\n`);
}

/** Figma の変数スコープ（どのプロパティの候補に出すか） */
function scopesFor(path: string[]): string[] {
  switch (path[1]) {
    case 'bg':
      return ['FRAME_FILL', 'SHAPE_FILL'];
    case 'text':
      return ['TEXT_FILL'];
    case 'icon':
      return ['SHAPE_FILL', 'STROKE_COLOR'];
    case 'border':
    case 'focus':
      return ['STROKE_COLOR'];
    default:
      return ['ALL_SCOPES'];
  }
}

console.log(`✔ dist/figma/{primitives,${THEMES.join(',')}}.tokens.json`);
