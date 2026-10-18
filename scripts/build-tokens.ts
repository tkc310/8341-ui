/**
 * トークン JSON から以下を生成する。
 *   src/styles/tokens.css      … CSS カスタムプロパティ（ライト / ダーク）
 *   src/styles/typography.css  … テキストスタイルのユーティリティクラス
 *   src/tokens/tokens.ts       … 型付きの解決済みトークン
 *   src/tokens/tokens.json     … エージェント・ドキュメント生成用のフラットな一覧
 * 実行: npm run tokens:build（--check で差分検出のみ）
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  type FlatToken,
  PREFIX,
  ROOT,
  type Theme,
  createResolver,
  cssVarName,
  isRef,
  loadTokens,
  refName,
} from './lib/tokens.ts';

const CHECK = process.argv.includes('--check');
const HEADER = `/* このファイルは scripts/build-tokens.ts が生成します。直接編集しないでください。 */\n`;

const { primitive, base, themes } = loadTokens();

// --- テーマ間でキーが一致しているか -----------------------------------------
const keys = (ts: FlatToken[]) => ts.map((t) => t.name).sort().join('\n');
if (keys(themes.light) !== keys(themes.dark)) {
  const l = new Set(themes.light.map((t) => t.name));
  const d = new Set(themes.dark.map((t) => t.name));
  const diff = [
    ...[...l].filter((k) => !d.has(k)).map((k) => `dark に無い: ${k}`),
    ...[...d].filter((k) => !l.has(k)).map((k) => `light に無い: ${k}`),
  ];
  throw new Error(`テーマ間でトークンのキーが一致しません\n${diff.join('\n')}`);
}

// --- 値を CSS に変換 -------------------------------------------------------
/** px の dimension を rem に。罫線など 2px 以下とブレークポイントは px のまま */
function dimensionToCss(v: string, name: string): string {
  const m = v.match(/^(-?\d*\.?\d+)px$/);
  if (!m) return v;
  const n = Number(m[1]);
  if (n <= 3 || n >= 9999 || name.startsWith('breakpoint')) return v;
  return `${+(n / 16).toFixed(4)}rem`;
}

function toCss(t: FlatToken, value: unknown): string {
  switch (t.type) {
    case 'fontFamily':
      return (value as string[])
        .map((f) => (/[\s\d]/.test(f) && !f.startsWith('-') ? `"${f}"` : f))
        .join(', ');
    case 'cubicBezier':
      return `cubic-bezier(${(value as number[]).join(', ')})`;
    case 'dimension':
      return dimensionToCss(String(value), t.name);
    default:
      return String(value);
  }
}

/** 単純な参照は var() のまま残し、どの primitive 由来か追えるようにする */
function declaration(t: FlatToken, resolveValue: (v: unknown) => unknown) {
  if (isRef(t.value)) return `var(${cssVarName(refName(t.value))})`;
  return toCss(t, resolveValue(t.value));
}

function block(selector: string, tokens: FlatToken[], all: FlatToken[]) {
  const { resolveValue, map } = createResolver(all);
  const lines: string[] = [];
  for (const t of tokens) {
    if (t.type === 'typography') {
      const v = t.value as Record<string, string>;
      for (const [prop, ref] of Object.entries(v)) {
        const kebab = prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        const val = isRef(ref)
          ? `var(${cssVarName(refName(ref))})`
          : toCss(map.get(refName(ref)) ?? t, ref);
        lines.push(`  ${cssVarName(t.name)}-${kebab}: ${val};`);
      }
      continue;
    }
    const comment = t.description ? ` /* ${t.description} */` : '';
    lines.push(
      `  ${cssVarName(t.name)}: ${declaration(t, resolveValue)};${comment}`,
    );
  }
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

const lightAll = [...primitive, ...base, ...themes.light];
const darkAll = [...primitive, ...base, ...themes.dark];

const css = [
  HEADER,
  `/* Primitive — コンポーネントから直接参照しないこと */`,
  block(':root', primitive, lightAll),
  `/* Semantic — テーマ非依存 */`,
  block(':root', base, lightAll),
  `/* Semantic — Light（既定） */`,
  block(':root,\n[data-theme="light"]', themes.light, lightAll).replace(
    '{\n',
    '{\n  color-scheme: light;\n',
  ),
  `/* Semantic — Dark（明示指定） */`,
  block('[data-theme="dark"]', themes.dark, darkAll).replace(
    '{\n',
    '{\n  color-scheme: dark;\n',
  ),
  `/* Semantic — Dark（OS 設定に追従。data-theme="light" で明示的に解除できる） */`,
  `@media (prefers-color-scheme: dark) {\n${block(
    ':root:not([data-theme="light"])',
    themes.dark,
    darkAll,
  )
    .replace('{\n', '{\n  color-scheme: dark;\n')
    .replace(/^/gm, '  ')
    .trimEnd()}\n}\n`,
].join('\n');

// --- タイポグラフィのユーティリティクラス ---------------------------------
const typography =
  HEADER +
  base
    .filter((t) => t.type === 'typography')
    .map((t) => {
      const v = cssVarName(t.name);
      const name = t.name.replace(/^text\./, '');
      return `.${PREFIX}-text-${name} {\n  font-family: var(${v}-font-family);\n  font-size: var(${v}-font-size);\n  font-weight: var(${v}-font-weight);\n  line-height: var(${v}-line-height);\n  letter-spacing: var(${v}-letter-spacing);\n}\n`;
    })
    .join('\n');

// --- TS / JSON -------------------------------------------------------------
function resolved(theme: Theme) {
  const all = theme === 'light' ? lightAll : darkAll;
  const { resolveValue } = createResolver(all);
  return all.map((t) => ({
    name: t.name,
    cssVar: cssVarName(t.name),
    type: t.type,
    layer: t.layer,
    themed: t.themed,
    value: resolveValue(t.value),
    ref: isRef(t.value) ? refName(t.value) : undefined,
    description: t.description,
  }));
}

const light = resolved('light');
const dark = resolved('dark');
const json = {
  prefix: PREFIX,
  tokens: light.map((t) => ({
    ...t,
    value: t.themed ? { light: t.value, dark: dark.find((d) => d.name === t.name)?.value } : t.value,
    ref: t.themed ? { light: t.ref, dark: dark.find((d) => d.name === t.name)?.ref } : t.ref,
  })),
};

const semanticNames = [...base, ...themes.light].map((t) => t.name);
const ts = `${HEADER.replace('/*', '/**').replace(' */', '\n */')}
export const tokenPrefix = '${PREFIX}' as const;

/** semantic トークン名 */
export type SemanticToken =
${semanticNames.map((n) => `  | '${n}'`).join('\n')};

/** トークン名から CSS 変数参照を返す。例: cssVar('color.text.default') → 'var(--dsm-color-text-default)' */
export const cssVar = (name: SemanticToken): string =>
  \`var(--\${tokenPrefix}-\${name.replace(/\\./g, '-')})\`;

/** 解決済みの値（ライト / ダーク） */
export const tokens = ${JSON.stringify(
  {
    light: Object.fromEntries(light.filter((t) => t.layer === 'semantic').map((t) => [t.name, t.value])),
    dark: Object.fromEntries(dark.filter((t) => t.layer === 'semantic').map((t) => [t.name, t.value])),
  },
  null,
  2,
)} as const;
`;

const outputs: Record<string, string> = {
  'src/styles/tokens.css': css,
  'src/styles/typography.css': typography,
  'src/tokens/tokens.ts': ts,
  'src/tokens/tokens.json': `${JSON.stringify(json, null, 2)}\n`,
};

let stale = 0;
for (const [file, content] of Object.entries(outputs)) {
  const path = resolve(ROOT, file);
  if (CHECK) {
    let current = '';
    try {
      current = readFileSync(path, 'utf8');
    } catch {}
    if (current !== content) {
      console.error(`✖ ${file} が古くなっています。npm run tokens:build を実行してください`);
      stale++;
    }
  } else {
    writeFileSync(path, content);
    console.log(`✔ ${file}`);
  }
}
if (stale) process.exit(1);
