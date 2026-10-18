/**
 * ビルド結果（dist/）を検査する。vp pack の後に実行する。
 *   - ソースで 'use client' を持つファイルが、出力でも先頭に 'use client' を保っているか
 *   - package.json の exports が指すファイルがすべて存在するか
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const errors: string[] = [];

const components = readdirSync(resolve(ROOT, 'src/components'), { withFileTypes: true }).filter((d) => d.isDirectory());
for (const { name } of components) {
  const src = resolve(ROOT, `src/components/${name}/${name}.tsx`);
  const out = resolve(ROOT, `dist/components/${name}/${name}.js`);
  if (!existsSync(src)) continue;
  const needs = /^['"]use client['"];/m.test(readFileSync(src, 'utf8'));
  if (!existsSync(out)) {
    errors.push(`出力がありません: dist/components/${name}/${name}.js`);
    continue;
  }
  const has = /^['"]use client['"];?/.test(readFileSync(out, 'utf8').trimStart());
  if (needs && !has) errors.push(`'use client' が出力から消えています: dist/components/${name}/${name}.js`);
  for (const f of ['index.js', 'index.d.ts']) {
    if (!existsSync(resolve(ROOT, `dist/components/${name}/${f}`))) errors.push(`exports の対象がありません: dist/components/${name}/${f}`);
  }
}
for (const f of ['index.js', 'index.d.ts', 'theme.css', 'styles.css']) {
  if (!existsSync(resolve(ROOT, `dist/${f}`))) errors.push(`exports の対象がありません: dist/${f}`);
}

for (const e of errors) console.error(`✖ ${e}`);
console.log(`${errors.length ? '✖' : '✔'} dist の検査: ${errors.length} 件の問題`);
if (errors.length) process.exit(1);
