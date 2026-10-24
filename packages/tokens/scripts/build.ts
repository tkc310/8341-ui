/**
 * Style Dictionary v5 で DTCG 2025.10 のトークンを CSS 変数と Tailwind v4 の @theme に変換する。
 *
 * 出力（dist/）
 *   css/tokens.css     … primitive + semantic（light / dark / OS 追従）をまとめたもの。利用側はこれを読み込む
 *   css/tailwind.css   … Tailwind v4 の `@theme inline`。semantic トークンを Tailwind のユーティリティ名に対応づける
 *   tokens.json        … テーマ別の解決済みトークン（エージェント・ドキュメント生成用）
 *
 * テーマの切り替え
 *   light: :root / .light / [data-theme="light"]
 *   dark : .dark / [data-theme="dark"]、および OS がダークで .light / [data-theme="light"] が無いとき
 *
 * Style Dictionary v5 は DTCG の Resolver モジュールに未対応のため、
 * どのファイルをどの順で読むかは scripts/lib/tokens.ts が Resolver 文書から求めて渡す。
 * 実行: make tokens
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import StyleDictionary, { type Config, type TransformedToken } from 'style-dictionary';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';
import { THEME_SELECTOR, dimensionToCss, durationToCss, letterSpacingToCss, shadowToCss } from './lib/css.ts';
import { tailwindName } from './lib/tailwind.ts';
import { type DtcgDimension, PREFIX, ROOT, THEMES, cssVarName, resolvedTokens, sourceFiles } from './lib/tokens.ts';

const DIST = resolve(ROOT, 'dist');
const CSS_DIR = resolve(DIST, 'css');
const PARTS = resolve(DIST, '.parts');

// ---------------------------------------------------------------------------
// Transforms
// ---------------------------------------------------------------------------
const typeOf = (t: TransformedToken) => (t.$type ?? t.type) as string | undefined;
const valueOf = (t: TransformedToken) => (t.$value ?? t.value) as unknown;

/** px の dimension を rem に（ユーザーの文字サイズ設定に追従させる）。罫線など 3px 以下とブレークポイントは px のまま */
StyleDictionary.registerTransform({
  name: '8341/dimension/rem',
  type: 'value',
  transitive: true,
  filter: (t) => typeOf(t) === 'dimension',
  transform: (t) => {
    const v = valueOf(t);
    return typeof v === 'string' ? v : dimensionToCss(v as DtcgDimension, t.path);
  },
});

/** 字間（文字サイズに対する比率の number）を em に */
StyleDictionary.registerTransform({
  name: '8341/letter-spacing/em',
  type: 'value',
  transitive: true,
  filter: (t) => t.path.includes('letter-spacing'),
  transform: (t) => {
    const v = valueOf(t);
    return typeof v === 'string' ? v : letterSpacingToCss(v as number);
  },
});

/** duration（{ value, unit }）を ms / s のまま CSS に */
StyleDictionary.registerTransform({
  name: '8341/duration/css',
  type: 'value',
  transitive: true,
  filter: (t) => typeOf(t) === 'duration',
  transform: (t) => {
    const v = valueOf(t);
    return typeof v === 'string' ? v : durationToCss(v as { value: number; unit: 'ms' | 's' });
  },
});

/** 影（DTCG の shadow）を CSS の box-shadow に */
StyleDictionary.registerTransform({
  name: '8341/shadow/css',
  type: 'value',
  transitive: true,
  filter: (t) => typeOf(t) === 'shadow',
  transform: (t) => {
    const v = valueOf(t);
    return typeof v === 'string' ? v : shadowToCss(v as Parameters<typeof shadowToCss>[0]);
  },
});

const transforms = [
  'attribute/cti',
  'name/kebab',
  '8341/dimension/rem',
  '8341/letter-spacing/em',
  '8341/duration/css',
  // 色は oklch() で出力する（DTCG の色オブジェクトを Style Dictionary v5.3+ が解釈する）
  'color/oklch',
  'fontFamily/css',
  'cubicBezier/css',
  '8341/shadow/css',
];

// ---------------------------------------------------------------------------
// Formats
// ---------------------------------------------------------------------------

/** セレクタ（と任意のメディアクエリ）で包んだ CSS 変数のブロック */
StyleDictionary.registerFormat({
  name: '8341/css-block',
  format: async ({ dictionary, file, options }) => {
    const header = await fileHeader({ file });
    const body = formattedVariables({
      format: 'css',
      dictionary,
      outputReferences: options.outputReferences,
      usesDtcg: true,
    });
    const scheme = options.colorScheme ? `  color-scheme: ${options.colorScheme};\n` : '';
    const block = `${options.selector} {\n${scheme}${body}\n}\n`;
    if (!options.media) return `${header}${block}`;
    return `${header}@media ${options.media} {\n${block.replace(/^/gm, '  ').trimEnd()}\n}\n`;
  },
});

StyleDictionary.registerFormat({
  name: '8341/tailwind-theme',
  format: async ({ dictionary, file }) => {
    const header = await fileHeader({ file });
    const lines = dictionary.allTokens
      .map((t) => {
        const name = tailwindName(t.path);
        if (!name) return null;
        // メディアクエリでは var() が使えないため、ブレークポイントだけは値をそのまま書く
        if (t.path[0] === 'breakpoint') return `  ${name}: ${String(t.$value ?? t.value)};`;
        return `  ${name}: var(--${t.name});`;
      })
      .filter(Boolean);
    return `${header}/*
 * Tailwind v4 のテーマ。値はすべて tokens.css の CSS 変数を参照する（テーマ切り替えに追従させるため inline）。
 * Tailwind の既定の色・文字サイズ・太さ・角丸・影・ブレークポイントは消し、semantic トークンだけを使えるようにする。
 * 余白（--spacing）は 4px の既定スケールを残しつつ、semantic な名前（p-inset-md など）を追加する。
 */
@custom-variant dark {
  &:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) {
    @slot;
  }
  /* トークンと同じく、明示が無ければ OS の設定に従う */
  @media (prefers-color-scheme: dark) {
    &:where(:root:not(.light):not([data-theme="light"]) *) {
      @slot;
    }
  }
}

@theme inline {
  --color-*: initial;
  --text-*: initial;
  --radius-*: initial;
  --shadow-*: initial;
  --breakpoint-*: initial;
  --font-weight-*: initial;
  --color-transparent: transparent;
  --color-current: currentColor;
  --default-transition-duration: var(--${PREFIX}-motion-duration-fast);
  --default-transition-timing-function: var(--${PREFIX}-motion-easing-standard);
${lines.join('\n')}
}
`;
  },
});

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
const rel = (files: { file: string }[]) => files.map((f) => f.file);

function config(opts: {
  include: string[];
  source: string[];
  destination: string;
  format: string;
  filter?: (t: TransformedToken) => boolean;
  options?: Record<string, unknown>;
}): Config {
  return {
    // semantic は include した primitive を var() で参照する（意図どおり）。
    // その「出力から外したトークンへの参照」警告をエラーにしないため warn にする
    // 「Token collisions detected」は各ファイル直下の $schema / $description が重なるだけで、トークンの衝突ではない。
    // 詳細を見るときは SD_VERBOSE=1 make tokens
    log: { verbosity: process.env.SD_VERBOSE ? 'verbose' : 'default', warnings: 'warn' },
    include: opts.include,
    source: opts.source,
    platforms: {
      css: {
        prefix: PREFIX,
        transforms,
        buildPath: `${PARTS}/`,
        files: [
          {
            destination: opts.destination,
            format: opts.format,
            ...(opts.filter ? { filter: opts.filter } : {}),
            options: { outputReferences: true, ...opts.options },
          },
        ],
      },
    },
  };
}

async function build() {
  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(CSS_DIR, { recursive: true });

  const files = sourceFiles();
  const primitive = rel(files.filter((f) => f.kind === 'set' && f.name === 'primitive'));
  const base = rel(files.filter((f) => f.kind === 'set' && f.name === 'semantic'));

  // 1. primitive（:root）
  await new StyleDictionary(
    config({
      include: [],
      source: primitive,
      destination: '1-primitive.css',
      format: '8341/css-block',
      options: { selector: ':root', outputReferences: false },
    }),
  ).buildAllPlatforms();

  // 2. テーマ非依存の semantic（:root）
  await new StyleDictionary(
    config({
      include: primitive,
      source: base,
      destination: '2-semantic.css',
      format: '8341/css-block',
      filter: (t) => t.isSource === true,
      options: { selector: ':root' },
    }),
  ).buildAllPlatforms();

  // 3. テーマごとの semantic
  for (const theme of THEMES) {
    const themed = rel(sourceFiles({ theme }).filter((f) => f.kind === 'modifier'));
    const variants: { destination: string; selector: string; media?: string }[] =
      theme === 'dark'
        ? [
            { destination: '4-dark.css', selector: THEME_SELECTOR.dark },
            {
              destination: '5-dark-media.css',
              selector: THEME_SELECTOR.darkMediaSelector,
              media: THEME_SELECTOR.darkMedia,
            },
          ]
        : [{ destination: '3-light.css', selector: THEME_SELECTOR.light }];
    for (const v of variants) {
      await new StyleDictionary(
        config({
          include: [...primitive, ...base],
          source: themed,
          destination: v.destination,
          format: '8341/css-block',
          filter: (t) => t.isSource === true,
          options: { selector: v.selector, media: v.media, colorScheme: theme },
        }),
      ).buildAllPlatforms();
    }
  }

  // 4. Tailwind v4 の @theme
  await new StyleDictionary(
    config({
      include: [],
      source: rel(sourceFiles()),
      destination: 'tailwind.css',
      format: '8341/tailwind-theme',
    }),
  ).buildAllPlatforms();

  // 5. まとめる
  const part = (name: string) => readFileSync(resolve(PARTS, name), 'utf8');
  writeFileSync(
    resolve(CSS_DIR, 'tokens.css'),
    ['1-primitive.css', '2-semantic.css', '3-light.css', '4-dark.css', '5-dark-media.css'].map(part).join('\n'),
  );
  writeFileSync(resolve(CSS_DIR, 'tailwind.css'), part('tailwind.css'));
  rmSync(PARTS, { recursive: true, force: true });

  // 6. 解決済みトークン（エージェント・ドキュメント用）
  const json = {
    prefix: PREFIX,
    themes: THEMES,
    tokens: Object.fromEntries(
      THEMES.map((theme) => [
        theme,
        resolvedTokens(theme).map(({ name, type, layer, themed, resolved, value, description }) => ({
          name,
          cssVar: cssVarName(name),
          tailwind: tailwindName(name.split('.')),
          type,
          layer,
          themed,
          value: resolved,
          ref: typeof value === 'string' && value.startsWith('{') ? value.slice(1, -1) : undefined,
          description,
        })),
      ]),
    ),
  };
  writeFileSync(resolve(DIST, 'tokens.json'), `${JSON.stringify(json, null, 2)}\n`);

  console.log('✔ dist/css/tokens.css, dist/css/tailwind.css, dist/tokens.json');
}

if (import.meta.url === `file://${process.argv[1]}`) await build();
