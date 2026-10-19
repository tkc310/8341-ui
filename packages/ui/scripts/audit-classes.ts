/**
 * コンポーネントのクラス名がルールブックの規約を守っているかを静的に検査する。
 * 実行: make check（--json で機械可読な結果）
 *
 * error（CI を落とす）
 *   raw-color        … 任意値での色の直書き（bg-[#fff]、text-[rgb(...)] など）。semantic トークンのユーティリティを使う
 *   raw-length       … 任意値での 3px を超える px の直書き（p-[12px] など）。space / size / radius を使う
 *   tailwind-palette … Tailwind 既定のパレット（text-gray-500、bg-blue-600 など）。テーマで消してあり、効かない
 *   primitive-token  … --8341-color-primitive-* の参照
 *   inline-style-color … style 属性での色の指定
 *   missing-use-client … React のフックを使うのに 'use client' が無い
 *   outline-none     … Tailwind v4 の outline-none はアウトラインの線種を none にし、focus-visible の線まで消す。
 *                      フォーカスは focus-ring を使う。別の要素に描く場合だけ行末に `// allow-outline-none: 理由`
 *   bare-read-only   … read-only: は button や無効の input にも当たる。[&:read-only:not(:disabled,button)]: を使う
 *   theme-var-ref    … 任意値・手書き CSS からの Tailwind テーマ変数（--color-* / --spacing-* / --text-* など）の参照。
 *                      @theme inline は使われた変数しか出力しないため未定義になりうる。常に存在する --8341-* を参照する
 * warning
 *   numeric-spacing  … p-4 / gap-6 など数値の余白。semantic な余白（p-inset-md、gap-stack-md）を検討する
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

export interface Finding {
  file: string;
  line: number;
  rule: string;
  severity: 'error' | 'warning';
  message: string;
}

const ROOT = resolve(import.meta.dirname, '..');
const DIR = resolve(ROOT, 'src/components');
const PALETTE =
  /\b(?:bg|text|border|ring|outline|fill|stroke|from|to|via|decoration|divide|accent|caret|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d{2,3})?\b/;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return walk(p);
    return /\.tsx?$/.test(p) && !/\.(stories|test|vrt\.test|figma)\.tsx?$/.test(p) ? [p] : [];
  });
}

export function auditClasses(): Finding[] {
  const findings: Finding[] = [];
  for (const file of walk(DIR)) {
    const rel = relative(ROOT, file);
    const text = readFileSync(file, 'utf8');
    const lines = text.split('\n');
    const usesHooks = /\buse(State|Effect|Context|Ref|Id|Reducer|Memo|Callback|LayoutEffect|FormField)\s*\(/.test(text);
    if (usesHooks && !/^['"]use client['"];/m.test(text)) {
      findings.push({
        file: rel,
        line: 1,
        rule: 'missing-use-client',
        severity: 'error',
        message: "フックを使っているのに 'use client' がありません",
      });
    }
    lines.forEach((raw, i) => {
      const add = (rule: string, severity: Finding['severity'], message: string) =>
        findings.push({ file: rel, line: i + 1, rule, severity, message });
      const line = raw.replace(/\/\/.*$/, '');
      for (const m of line.matchAll(/[\w:-]*-\[([^\]]+)\]/g)) {
        const v = m[1] ?? '';
        if (/#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch|oklab)\(/i.test(v))
          add('raw-color', 'error', `色を直書きしています: ${m[0]}`);
        for (const px of v.matchAll(/(?<![\w-])(\d*\.?\d+)px\b/g)) {
          if (Number(px[1]) > 3) add('raw-length', 'error', `${px[0]} を直書きしています: ${m[0]}`);
        }
      }
      if (/\boutline-none\b/.test(line) && !/allow-outline-none/.test(raw))
        add('outline-none', 'error', 'outline-none はフォーカスの線まで消します。focus-ring を使ってください');
      if (/(?<![\w&:-])read-only:/.test(line))
        add(
          'bare-read-only',
          'error',
          'read-only: は button や無効の input にも当たります。[&:read-only:not(:disabled,button)]: を使ってください',
        );
      const palette = line.match(PALETTE);
      if (palette)
        add('tailwind-palette', 'error', `Tailwind 既定のパレットは使えません: ${palette[0]}（semantic の色を使う）`);
      const themeVar = line.match(
        /(?:var\(|\()(?:length:|color:)?(--(?:color|spacing|text|font|radius|shadow|container|ease)-[a-z0-9-]+)\)/,
      );
      if (themeVar) add('theme-var-ref', 'error', `${themeVar[1]} ではなく --8341-* のトークン変数を参照してください`);
      if (/--8341-color-primitive-/.test(line))
        add('primitive-token', 'error', 'primitive の色を参照しています。semantic を使ってください');
      if (/style=\{\{[^}]*(color|background)[^}]*#/.test(line))
        add('inline-style-color', 'error', 'style 属性で色を指定しています');
      for (const m of line.matchAll(
        /(?<![\w-])-?(?:p|px|py|pt|pb|ps|pe|m|mx|my|mt|mb|ms|me|gap|gap-x|gap-y|space-x|space-y)-(\d+(?:\.5)?)\b/g,
      )) {
        if (m[1] !== '0')
          add('numeric-spacing', 'warning', `${m[0]}: semantic な余白（inset-* / gap-* / stack-*）を検討してください`);
      }
    });
  }
  return findings;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const findings = auditClasses();
  const errors = findings.filter((f) => f.severity === 'error');
  if (process.argv.includes('--json')) console.log(JSON.stringify(findings, null, 2));
  else {
    for (const f of findings)
      (f.severity === 'error' ? console.error : console.warn)(
        `${f.severity === 'error' ? '✖' : '△'} ${f.file}:${f.line} [${f.rule}] ${f.message}`,
      );
    console.log(
      `${errors.length ? '✖' : '✔'} クラス監査: error ${errors.length} 件 / warning ${findings.length - errors.length} 件`,
    );
  }
  if (errors.length) process.exit(1);
}
