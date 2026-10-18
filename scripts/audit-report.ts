/**
 * デザインシステムの健康診断レポートを作る（改善ループの「気づく」段階）。
 * 実行: npm run audit → reports/audit.md
 * 週次の GitHub Actions がこのレポートを Issue に投稿する。
 *
 * 見るもの
 *   1. コントラストの余裕が少ない組み合わせ（5% 未満）
 *   2. CSS 監査の warning
 *   3. どこからも参照されていない semantic トークン
 *   4. ストーリーが無いコンポーネント
 *   5. 改善バックログの未着手件数
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { auditCss } from './audit-css.ts';
import { runContrast } from './check-contrast.ts';
import { ROOT } from './lib/tokens.ts';

function walk(dir: string, exts: string[]): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return walk(p, exts);
    return exts.some((e) => p.endsWith(e)) ? [p] : [];
  });
}

const GENERATED = ['src/styles/tokens.css', 'src/styles/typography.css', 'src/tokens/tokens.ts', 'src/tokens/tokens.json'];
const sources = walk(resolve(ROOT, 'src'), ['.css', '.tsx', '.ts'])
  .filter((f) => !GENERATED.includes(relative(ROOT, f)))
  .map((f) => ({ file: relative(ROOT, f), text: readFileSync(f, 'utf8') }));

// 1. コントラスト
const contrast = runContrast();
const failedContrast = contrast.filter((r) => !r.pass);
const tight = contrast
  .filter((r) => r.pass && r.ratio < r.min * 1.05)
  .map((r) => `[${r.theme}] \`${r.fg}\` on \`${r.bg}\`: ${r.ratio}:1（必要 ${r.min}:1）`);

// 2. CSS
const cssFindings = auditCss();

// 3. 未使用トークン（semantic のみ。typography は .tkc-text-* クラス経由の利用も数える）
const { tokens } = JSON.parse(readFileSync(resolve(ROOT, 'src/tokens/tokens.json'), 'utf8')) as {
  tokens: { name: string; cssVar: string; layer: string; type: string }[];
};
const corpus = sources.map((s) => s.text).join('\n');
const unused = tokens
  // テキストスタイルは Heading / Text が動的にクラス名を組み立てるため対象外
  .filter((t) => t.layer === 'semantic' && t.type !== 'typography')
  .filter((t) => !corpus.includes(t.cssVar))
  .map((t) => t.name);

// 4. ストーリーの無いコンポーネント
const storyText = sources.filter((s) => s.file.endsWith('.stories.tsx')).map((s) => s.text).join('\n');
const components = readdirSync(resolve(ROOT, 'src/components'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
  .map((d) => d.name);
const noStory = components.filter((c) => !new RegExp(`\\b${c}\\b`).test(storyText));

// 5. バックログ
const backlog = readFileSync(resolve(ROOT, 'docs/improvement/backlog.md'), 'utf8');
const open = (backlog.match(/^- \[ \]/gm) ?? []).length;

const date = new Date().toISOString().slice(0, 10);
const section = (title: string, items: string[], empty = 'なし') =>
  `### ${title}（${items.length}）\n\n${items.length ? items.map((i) => `- ${i}`).join('\n') : empty}\n`;

const report = `# デザインシステム監査レポート ${date}

| 項目 | 結果 |
| --- | --- |
| コントラスト | ${contrast.length - failedContrast.length}/${contrast.length} 件が基準を満たす |
| CSS 監査 | error ${cssFindings.filter((f) => f.severity === 'error').length} / warning ${cssFindings.filter((f) => f.severity === 'warning').length} |
| 未使用の semantic トークン | ${unused.length} |
| ストーリーの無いコンポーネント | ${noStory.length} |
| 改善バックログの未着手 | ${open} |

${section('コントラスト不足', failedContrast.map((r) => `[${r.theme}] \`${r.fg}\` on \`${r.bg}\`: ${r.ratio}:1`))}
${section('コントラストの余裕が 5% 未満', tight)}
${section('CSS 監査', cssFindings.map((f) => `\`${f.file}:${f.line}\` [${f.rule}] ${f.message}`))}
${section('未使用の semantic トークン', unused.map((n) => `\`${n}\``), 'なし（すべて参照されている）')}
${section('ストーリーの無いコンポーネント', noStory.map((n) => `\`${n}\``))}

---
次の一手: 上の項目から 1 つ選び、\`docs/rulebook/06-improvement-loop.md\` の手順で直す。
未使用トークンはアプリ側で使っている可能性があるため、削除前に利用プロジェクトを確認すること。
`;

mkdirSync(resolve(ROOT, 'reports'), { recursive: true });
writeFileSync(resolve(ROOT, 'reports/audit.md'), report);
console.log(report);
