/**
 * デザインシステムの健康診断レポートを作る（改善ループの「気づく」段階）。
 * 実行: make audit → reports/audit.md（リポジトリ直下）
 * 週次の GitHub Actions がこのレポートを Issue に投稿する。
 *
 * 見るもの
 *   1. コントラスト不足と、余裕が 5% 未満の組み合わせ
 *   2. クラス監査（packages/ui）の error / warning
 *   3. どこからも参照されていない semantic トークン
 *   4. ストーリー・テスト・Code Connect が無いコンポーネント
 *   5. 改善バックログの未着手件数
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { auditClasses } from '../../ui/scripts/audit-classes.ts';
import { runContrast } from './check-contrast.ts';
import { tailwindName, utilityExample } from './lib/tailwind.ts';
import { REPO_ROOT, cssVarName, loadTokens } from './lib/tokens.ts';

const UI = resolve(REPO_ROOT, 'packages/ui/src');
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(p) ? [p] : [];
  });
const sources = [...walk(UI), ...walk(resolve(REPO_ROOT, 'apps/storybook/src'))]
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

// 1. コントラスト
const contrast = runContrast();
const failed = contrast.filter((r) => !r.pass);
const tight = contrast
  .filter((r) => r.pass && r.ratio < r.min * 1.05)
  .map((r) => `[${r.theme}] \`${r.fg}\` on \`${r.bg}\`: ${r.ratio}:1（必要 ${r.min}:1）`);

// 2. クラス監査
const classFindings = auditClasses();

// 3. 未使用の semantic トークン（Tailwind のクラス名・CSS 変数のどちらでも参照されていないもの）
const unused = loadTokens('light')
  .filter((t) => t.layer === 'semantic' && t.path[0] !== 'text')
  .filter((t) => {
    const util = utilityExample(tailwindName(t.path));
    const key = util.replace(/^(bg|text|border|p|gap|h|size|max-w|rounded|shadow|outline|ease)-/, '');
    return !sources.includes(cssVarName(t.name)) && !(util && new RegExp(`-${key}\\b`).test(sources));
  })
  .map((t) => t.name);

// 4. 揃っていない付帯ファイル
const components = readdirSync(resolve(UI, 'components/ui'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const has = (c: string, suffix: string) => readdirSync(resolve(UI, 'components/ui', c)).some((f) => f.endsWith(suffix));
const storyText = walk(resolve(UI, 'components'))
  .filter((f) => f.endsWith('.stories.tsx'))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');
const noStory = components.filter((c) => !has(c, '.stories.tsx') && !new RegExp(`<${c}\\b`).test(storyText));
const noFigma = components.filter((c) => !has(c, '.figma.ts'));

// 5. バックログ
const backlog = readFileSync(resolve(REPO_ROOT, 'docs/improvement/backlog.md'), 'utf8');
const open = (backlog.match(/^- \[ \]/gm) ?? []).length;

const date = new Date().toISOString().slice(0, 10);
const section = (title: string, items: string[], empty = 'なし') =>
  `### ${title}（${items.length}）\n\n${items.length ? items.map((i) => `- ${i}`).join('\n') : empty}\n`;
const errors = classFindings.filter((f) => f.severity === 'error');

const report = `# デザインシステム監査レポート ${date}

| 項目 | 結果 |
| --- | --- |
| コントラスト | ${contrast.length - failed.length}/${contrast.length} 件が基準を満たす |
| クラス監査 | error ${errors.length} / warning ${classFindings.length - errors.length} |
| 未使用の semantic トークン | ${unused.length} |
| ストーリーの無いコンポーネント | ${noStory.length} |
| Code Connect の無いコンポーネント | ${noFigma.length} |
| 改善バックログの未着手 | ${open} |

${section(
  'コントラスト不足',
  failed.map((r) => `[${r.theme}] \`${r.fg}\` on \`${r.bg}\`: ${r.ratio}:1`),
)}
${section('コントラストの余裕が 5% 未満', tight)}
${section(
  'クラス監査',
  classFindings.map((f) => `\`${f.file}:${f.line}\` [${f.rule}] ${f.message}`),
)}
${section(
  '未使用の semantic トークン',
  unused.map((n) => `\`${n}\``),
  'なし（すべて参照されている）',
)}
${section(
  'ストーリーの無いコンポーネント',
  noStory.map((n) => `\`${n}\``),
)}
${section(
  'Code Connect の無いコンポーネント',
  noFigma.map((n) => `\`${n}\``),
)}

---
次の一手: 上の項目から 1 つ選び、\`docs/rulebook/06-improvement-loop.md\` の手順で直す。
未使用トークンは利用側のプロジェクトで使っている可能性があるため、削除する前に確認すること。
`;

mkdirSync(resolve(REPO_ROOT, 'reports'), { recursive: true });
writeFileSync(resolve(REPO_ROOT, 'reports/audit.md'), report);
console.log(report);
