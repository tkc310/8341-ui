/**
 * スライドのソースを docs/rulebook/07-slides.md のルールで検査する。
 *
 * 実行: make slides-check SRC=slides/foo.html（複数可）
 *       引数なし … deck.css の監査と、examples/ のサンプルの検査（make check から呼ぶ）
 *
 * error（終了コード 1）: 必須ルールの違反。warning: 推奨ルールからの外れ（分量・強調の数など）
 */
import { readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { SLIDES_DIR, checkCss, checkDeck, formatIssues, readDeck, tokenCss } from './lib.ts';
import type { Issue } from './lib.ts';

const cwd = process.cwd();
const tokens = tokenCss();
const results: { file: string; issues: Issue[] }[] = [];

const cssFile = resolve(SLIDES_DIR, 'deck.css');
results.push({ file: cssFile, issues: checkCss(readFileSync(cssFile, 'utf8'), tokens.names) });

const args = process.argv.slice(2);
const files = args.length
  ? args.map((a) => resolve(cwd, a))
  : readdirSync(resolve(SLIDES_DIR, 'examples'))
      .filter((f) => f.endsWith('.html'))
      .map((f) => resolve(SLIDES_DIR, 'examples', f));

for (const file of files) {
  try {
    results.push({ file, issues: checkDeck(readDeck(file)) });
  } catch (e) {
    const err = e as Error & { line?: number };
    results.push({ file, issues: [{ id: 'parse', level: 'error', line: err.line, message: err.message }] });
  }
}

let errors = 0;
let warnings = 0;
for (const { file, issues } of results) {
  const rel = relative(cwd, file);
  errors += issues.filter((i) => i.level === 'error').length;
  warnings += issues.filter((i) => i.level === 'warning').length;
  if (issues.length) console.log(`${rel}\n${formatIssues(rel, issues)}\n`);
}
console.log(
  errors
    ? `✖ スライドの検査: エラー ${errors} 件、警告 ${warnings} 件`
    : `✔ スライドの検査: ${files.length} ファイルと deck.css（警告 ${warnings} 件）`,
);
process.exit(errors ? 1 : 0);
