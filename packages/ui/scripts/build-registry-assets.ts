/**
 * shadcn のレジストリで配るファイルを registry-assets/ に作る。
 *
 * 1. テーマ CSS（8341-ui.css）
 *
 * src/styles/theme.css は npm パッケージ 8341-ui-tokens の CSS を @import している。
 * レジストリだけで導入した利用者はそのパッケージを持たないので、@import をビルド済みのトークン CSS の中身に置き換え、
 * 1 ファイルで完結させる（ADR-0012）。
 *
 * 2. プロダクト用の DESIGN.md と design-principles（@8341/design-md。ADR-0019）
 * templates/PRODUCT-DESIGN.md を DESIGN.md として、docs/design-principles/ を置く。
 * 利用側はファクトリーではないので、<!-- factory:start --> 〜 <!-- factory:end --> は取り除く。
 *
 * 実行: registry:build の中で自動で呼ばれる。先に 8341-ui-tokens のビルドが要る
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const TOKENS_CSS = resolve(ROOT, '../tokens/dist/css');
const OUT_DIR = resolve(ROOT, 'registry-assets');

const inline = (file: string) => {
  const path = resolve(TOKENS_CSS, file);
  if (!existsSync(path)) {
    throw new Error(`${path} がありません。先に make tokens を実行してください`);
  }
  return `/* ---- 8341-ui-tokens/${file} ---- */\n${readFileSync(path, 'utf8').trim()}\n`;
};

let css = readFileSync(resolve(ROOT, 'src/styles/theme.css'), 'utf8');
for (const file of ['tokens.css', 'tailwind.css']) {
  const line = `@import '8341-ui-tokens/${file}';`;
  if (!css.includes(line)) throw new Error(`theme.css に ${line} がありません`);
  css = css.replace(line, inline(file));
}

const header = [
  '/*',
  ' * 8341-ui のテーマ（shadcn のレジストリ版。トークンを同梱しているので、このファイルだけで動く）。',
  ' * 生成物なので編集しない。更新は npx shadcn@latest add @8341/theme --overwrite',
  ' *',
  " *   @import 'tailwindcss';",
  " *   @import './styles/8341-ui.css';",
  ' */',
  '',
].join('\n');

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(resolve(OUT_DIR, '8341-ui.css'), header + css.replace(/^\/\*[\s\S]*?\*\/\n/, ''));

const REPO = resolve(ROOT, '../..');
cpSync(resolve(REPO, 'templates/PRODUCT-DESIGN.md'), resolve(OUT_DIR, 'DESIGN.md'));
const principlesDir = resolve(OUT_DIR, 'design-principles');
rmSync(principlesDir, { recursive: true, force: true });
cpSync(resolve(REPO, 'docs/design-principles'), principlesDir, { recursive: true });
for (const d of readdirSync(principlesDir, { recursive: true, withFileTypes: true })) {
  if (!d.isFile() || !d.name.endsWith('.md')) continue;
  const file = resolve(d.parentPath, d.name);
  const md = readFileSync(file, 'utf8');
  writeFileSync(file, md.replace(/<!-- factory:start -->[\s\S]*?<!-- factory:end -->\n?/g, ''));
}
console.log('✔ registry-assets/（8341-ui.css・DESIGN.md・design-principles/）');
