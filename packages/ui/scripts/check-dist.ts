/**
 * ビルド結果（dist/）を検査する。vp pack の後に実行する。
 *   - ソースで 'use client' を持つファイルが、出力でも先頭に 'use client' を保っているか
 *   - package.json の exports が指すファイルがすべて存在するか
 *   - shadcn 方式の import パス（@/components/ui/*, @/lib/*）が出力に残っていないか（npm 利用者の環境では解決できない）
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const errors: string[] = [];

const components = readdirSync(resolve(ROOT, 'src/components/ui'), { withFileTypes: true }).filter((d) =>
  d.isDirectory(),
);
for (const { name } of components) {
  const src = resolve(ROOT, `src/components/ui/${name}/index.tsx`);
  if (!existsSync(src)) continue;
  const needs = /^['"]use client['"];/m.test(readFileSync(src, 'utf8'));
  for (const f of ['index.js', 'index.d.ts']) {
    if (!existsSync(resolve(ROOT, `dist/components/ui/${name}/${f}`)))
      errors.push(`exports の対象がありません: dist/components/ui/${name}/${f}`);
  }
  const out = resolve(ROOT, `dist/components/ui/${name}/index.js`);
  if (!existsSync(out)) continue;
  const has = /^['"]use client['"];?/.test(readFileSync(out, 'utf8').trimStart());
  if (needs && !has) errors.push(`'use client' が出力から消えています: dist/components/ui/${name}/index.js`);
}
for (const f of ['index.js', 'index.d.ts', 'theme.css', 'styles.css']) {
  if (!existsSync(resolve(ROOT, `dist/${f}`))) errors.push(`exports の対象がありません: dist/${f}`);
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(resolve(dir, d.name)) : [resolve(dir, d.name)],
  );
}
for (const file of walk(resolve(ROOT, 'dist')).filter((f) => /\.(js|d\.ts)$/.test(f))) {
  if (/from\s+['"]@\/(components|lib)\//.test(readFileSync(file, 'utf8'))) {
    errors.push(`未解決の "@/" import が残っています: ${file.slice(ROOT.length + 1)}`);
  }
}

for (const e of errors) console.error(`✖ ${e}`);
console.log(`${errors.length ? '✖' : '✔'} dist の検査: ${errors.length} 件の問題`);
if (errors.length) process.exit(1);
