/**
 * コンポーネントのディレクトリ構造と import を検査する（src/components/COMPONENT_STRUCTURE.md）。
 *   - src/components/ui/ の下のディレクトリは PascalCase（子コンポーネントも同じ）
 *   - 本体は index.tsx。置いてよいファイルは index.tsx・index.test.tsx・index.stories.tsx・index.figma.ts・useXxx.ts(x)（とそのテスト）
 *   - 相対パスの import はコンポーネントのディレクトリの中だけ。ほかのコンポーネントは @/components/ui/Name/index で参照する
 *     （shadcn が利用側の alias に書き換え、レジストリの依存も import から作るため）
 *   - 3 階層以上さかのぼる相対パス（../../../）を使わない
 *
 * 実行: pnpm check の中（node scripts/check-structure.ts）
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const COMPONENTS = resolve(ROOT, 'src/components');
const UI = resolve(COMPONENTS, 'ui');
const PASCAL = /^[A-Z][A-Za-z0-9]*$/;
const FILE = /^(index(\.test|\.stories)?\.tsx|index\.figma\.ts|use[A-Z][A-Za-z0-9]*(\.test)?\.tsx?)$/;
const errors: string[] = [];
const rel = (p: string) => relative(ROOT, p);

// src/components 直下: ui/、コンポーネントを横断するテスト（*.vrt.test.tsx）とその基準画像、この規則の文書だけ
for (const name of readdirSync(COMPONENTS)) {
  if (name === 'ui' || name === '__screenshots__' || name === 'COMPONENT_STRUCTURE.md' || name.endsWith('.vrt.test.tsx')) continue;
  errors.push(`src/components/${name}: コンポーネントは src/components/ui/<PascalCase>/ に置く`);
}

function checkDir(dir: string, top: string) {
  const name = dir.split('/').pop() ?? '';
  if (!PASCAL.test(name)) errors.push(`${rel(dir)}: ディレクトリ名は PascalCase にする`);
  const entries = readdirSync(dir);
  if (!entries.includes('index.tsx')) errors.push(`${rel(dir)}: 本体は index.tsx に書く`);
  for (const entry of entries) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      if (entry === '__screenshots__') continue;
      checkDir(p, top); // 子コンポーネント
      continue;
    }
    if (!FILE.test(entry))
      errors.push(`${rel(p)}: ファイル名は index.tsx / index.test.tsx / index.stories.tsx / index.figma.ts / useXxx.ts のどれかにする`);
    if (/\.tsx?$/.test(entry)) checkImports(p, top);
  }
}

function checkImports(file: string, top: string) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/(?:from|import)\s+['"](\.[^'"]*)['"]/g)) {
    const spec = m[1] as string;
    if (spec.startsWith('../../../')) {
      errors.push(`${rel(file)}: 3 階層以上さかのぼる相対パス（${spec}）は @/ のパスエイリアスで書く`);
      continue;
    }
    const target = resolve(dirname(file), spec);
    if (target !== top && !target.startsWith(`${top}/`))
      errors.push(`${rel(file)}: ほかのコンポーネントは相対パス（${spec}）ではなく @/components/ui/<Name>/index で import する`);
  }
}

for (const name of readdirSync(UI)) {
  const p = join(UI, name);
  if (statSync(p).isDirectory()) checkDir(p, p);
  else errors.push(`${rel(p)}: src/components/ui/ の直下にはコンポーネントのディレクトリだけを置く`);
}

for (const e of errors) console.error(`✖ ${e}`);
console.log(`${errors.length ? '✖' : '✔'} コンポーネントの構造: ${errors.length} 件の問題`);
if (errors.length) process.exit(1);
