/**
 * コンポーネント CSS がルールブックの規約を守っているかを静的に検査する。
 * 実行: npm run check:css（--json で機械可読な結果）
 *
 * error（CI を落とす）
 *   raw-color        … #hex / rgb() / hsl() の直書き（トークンを使う）
 *   primitive-color  … --tkc-color-primitive-* の直接参照（semantic を使う）
 *   raw-length       … 3px を超える px の直書き（トークンを使う）
 *   unknown-token    … 定義されていない --tkc-* の参照
 * warning（改善候補として記録）
 *   hover-outside-media … @media (hover: hover) の外の :hover
 *   primitive-other     … 色以外の primitive（dimension / font など）の直接参照
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { ROOT } from './lib/tokens.ts';

export interface Finding {
  file: string;
  line: number;
  rule: string;
  severity: 'error' | 'warning';
  message: string;
}

const COMPONENT_DIR = resolve(ROOT, 'src/components');
const defined = new Set(
  [...readFileSync(resolve(ROOT, 'src/styles/tokens.css'), 'utf8').matchAll(/(--tkc-[\w-]+):/g)].map((m) => m[1]),
);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.css') ? [p] : [];
  });
}

export function auditCss(): Finding[] {
  const findings: Finding[] = [];
  for (const file of walk(COMPONENT_DIR)) {
    const rel = relative(ROOT, file);
    const lines = readFileSync(file, 'utf8').split('\n');
    let inComment = false;
    let hoverMediaDepth = -1;
    let depth = 0;
    lines.forEach((raw, i) => {
      const add = (rule: string, severity: Finding['severity'], message: string) =>
        findings.push({ file: rel, line: i + 1, rule, severity, message });

      // コメントと data URL を除去してから検査する
      let line = raw;
      if (inComment) {
        const end = line.indexOf('*/');
        if (end === -1) return;
        line = line.slice(end + 2);
        inComment = false;
      }
      line = line.replace(/\/\*.*?\*\//g, '');
      if (line.includes('/*')) {
        line = line.slice(0, line.indexOf('/*'));
        inComment = true;
      }
      line = line.replace(/url\([^)]*\)/g, 'url()');

      if (/@media[^{]*\(hover:\s*hover\)/.test(line)) hoverMediaDepth = depth;

      if (/#[0-9a-fA-F]{3,8}\b/.test(line) || /\b(rgba?|hsla?|oklch)\(/.test(line)) {
        add('raw-color', 'error', `色を直書きしています: ${line.trim()}`);
      }
      for (const m of line.matchAll(/(?<![\w-])(\d*\.?\d+)px\b/g)) {
        if (Number(m[1]) > 3) add('raw-length', 'error', `${m[0]} を直書きしています。space / size / radius トークンを使ってください`);
      }
      for (const m of line.matchAll(/var\((--tkc-[\w-]+)/g)) {
        const v = m[1];
        if (!defined.has(v)) add('unknown-token', 'error', `未定義のトークン ${v}`);
        else if (v.startsWith('--tkc-color-primitive-')) add('primitive-color', 'error', `${v} は primitive です。semantic カラーを使ってください`);
        else if (/^--tkc-(dimension|font-size|font-line-height|font-letter-spacing|duration|easing)-/.test(v))
          add('primitive-other', 'warning', `${v} は primitive です。対応する semantic トークンの追加を検討してください`);
      }
      if (/:hover/.test(line) && hoverMediaDepth === -1) {
        add('hover-outside-media', 'warning', ':hover は @media (hover: hover) の中に書いてください（タッチ端末で残留するため）');
      }

      depth += (line.match(/{/g) ?? []).length - (line.match(/}/g) ?? []).length;
      if (hoverMediaDepth !== -1 && depth <= hoverMediaDepth) hoverMediaDepth = -1;
    });
  }
  return findings;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const findings = auditCss();
  const errors = findings.filter((f) => f.severity === 'error');
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(findings, null, 2));
  } else {
    for (const f of findings) {
      const mark = f.severity === 'error' ? '✖' : '△';
      (f.severity === 'error' ? console.error : console.warn)(`${mark} ${f.file}:${f.line} [${f.rule}] ${f.message}`);
    }
    console.log(
      `${errors.length ? '✖' : '✔'} CSS 監査: error ${errors.length} 件 / warning ${findings.length - errors.length} 件`,
    );
  }
  if (errors.length) process.exit(1);
}
