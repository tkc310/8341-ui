/**
 * トークンの整合性とコントラストを検査する。
 *   1. テーマ（light / dark）で semantic のキーが一致しているか
 *   2. すべての参照が解決できるか
 *   3. src/contrast.rules.json の組み合わせが、両テーマで基準を満たすか
 * 実行: pnpm --filter tkc310-ui-tokens check:contrast（--json で機械可読な結果）
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { contrastRatio } from './lib/color.ts';
import { type DtcgColor, SRC, THEMES, colorToCssRgba, loadTokens, resolvedTokens } from './lib/tokens.ts';

interface Rule {
  id: string;
  fg?: string[];
  bg?: string[];
  pairs?: [string, string][];
  min: number;
  wcag: string;
}

export interface ContrastResult {
  theme: string;
  rule: string;
  fg: string;
  bg: string;
  ratio: number;
  min: number;
  pass: boolean;
}

/** テーマ間で themed トークンのキーが一致しているか */
export function checkThemeKeys(): string[] {
  const keys = THEMES.map((t) => new Set(loadTokens(t).filter((x) => x.themed).map((x) => x.name)));
  const errors: string[] = [];
  THEMES.forEach((a, i) => {
    THEMES.forEach((b, j) => {
      if (i === j) return;
      for (const k of keys[i] ?? []) if (!keys[j]?.has(k)) errors.push(`${b} に無い: ${k}（${a} にはある）`);
    });
  });
  return [...new Set(errors)];
}

export function runContrast(): ContrastResult[] {
  const { rules } = JSON.parse(readFileSync(resolve(SRC, 'contrast.rules.json'), 'utf8')) as { rules: Rule[] };
  const results: ContrastResult[] = [];
  for (const theme of THEMES) {
    const tokens = new Map(resolvedTokens(theme).map((t) => [t.name, t]));
    const get = (name: string) => {
      const t = tokens.get(name);
      if (!t) throw new Error(`contrast.rules.json に未定義のトークン: ${name}`);
      if (t.type !== 'color') throw new Error(`${name} は color ではありません`);
      return colorToCssRgba(t.resolved as DtcgColor);
    };
    for (const rule of rules) {
      const pairs = rule.pairs ?? (rule.fg ?? []).flatMap((f) => (rule.bg ?? []).map((b) => [f, b] as [string, string]));
      for (const [fg, bg] of pairs) {
        // WCAG は四捨五入しない（4.499 は 4.5 を満たさない）
        const ratio = contrastRatio(get(fg), get(bg));
        results.push({ theme, rule: rule.id, fg, bg, ratio: Math.floor(ratio * 100) / 100, min: rule.min, pass: ratio >= rule.min });
      }
    }
  }
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const keyErrors = checkThemeKeys();
  for (const e of keyErrors) console.error(`✖ テーマ間のキー不一致: ${e}`);

  const results = runContrast();
  const failed = results.filter((r) => !r.pass);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ total: results.length, failed, keyErrors }, null, 2));
  } else {
    for (const r of failed) console.error(`✖ [${r.theme}] ${r.fg} on ${r.bg}: ${r.ratio}:1 (必要 ${r.min}:1, rule=${r.rule})`);
    for (const r of results.filter((x) => x.pass && x.ratio < x.min * 1.05))
      console.warn(`△ [${r.theme}] ${r.fg} on ${r.bg}: ${r.ratio}:1 — 余裕が 5% 未満`);
    console.log(
      `${failed.length || keyErrors.length ? '✖' : '✔'} コントラスト: ${results.length - failed.length}/${results.length} 件が基準を満たしています`,
    );
  }
  if (failed.length || keyErrors.length) process.exit(1);
}
