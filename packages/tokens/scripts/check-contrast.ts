/**
 * tokens/contrast.rules.json に従い、semantic カラーの組み合わせを両テーマで検証する。
 * 実行: npm run check:contrast（--json で機械可読な結果を出力）
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { contrastRatio } from './lib/color.ts';
import { ROOT, type Theme, createResolver, loadTokens } from './lib/tokens.ts';

interface Rule {
  id: string;
  fg?: string[];
  bg?: string[];
  pairs?: [string, string][];
  min: number;
  wcag: string;
}

const { rules } = JSON.parse(
  readFileSync(resolve(ROOT, 'tokens/contrast.rules.json'), 'utf8'),
) as { rules: Rule[] };
const { primitive, base, themes } = loadTokens();

export interface ContrastResult {
  theme: Theme;
  rule: string;
  fg: string;
  bg: string;
  ratio: number;
  min: number;
  pass: boolean;
}

export function runContrast(): ContrastResult[] {
const results: ContrastResult[] = [];
for (const theme of Object.keys(themes) as Theme[]) {
  const all = [...primitive, ...base, ...themes[theme]];
  const { map, resolveValue } = createResolver(all);
  const get = (name: string) => {
    if (!map.has(name)) throw new Error(`contrast.rules.json に未定義のトークン: ${name}`);
    return String(resolveValue(map.get(name)?.value));
  };
  for (const rule of rules) {
    const pairs =
      rule.pairs ?? (rule.fg ?? []).flatMap((f) => (rule.bg ?? []).map((b) => [f, b] as [string, string]));
    for (const [fg, bg] of pairs) {
      const ratio = contrastRatio(get(fg), get(bg));
      results.push({ theme, rule: rule.id, fg, bg, ratio: +ratio.toFixed(2), min: rule.min, pass: ratio >= rule.min });
    }
  }
}

return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
const results = runContrast();
const failed = results.filter((r) => !r.pass);
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ total: results.length, failed }, null, 2));
} else {
  for (const r of failed) {
    console.error(`✖ [${r.theme}] ${r.fg} on ${r.bg}: ${r.ratio}:1 (必要 ${r.min}:1, rule=${r.rule})`);
  }
  const tight = results.filter((r) => r.pass && r.ratio < r.min * 1.05);
  for (const r of tight) {
    console.warn(`△ [${r.theme}] ${r.fg} on ${r.bg}: ${r.ratio}:1 — 余裕が 5% 未満`);
  }
  console.log(`${failed.length ? '✖' : '✔'} コントラスト: ${results.length - failed.length}/${results.length} 件が基準を満たしています`);
}
if (failed.length) process.exit(1);
}
