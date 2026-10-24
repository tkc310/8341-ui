/**
 * shadcn 方式の配布用 registry.json を、各コンポーネントの import から生成する。
 * 依存（npm パッケージ・他のコンポーネント）を手で書かないので、ずれない。
 *
 * - registry:base  8341-base … Base UI を固定した土台。利用側の `shadcn init` で読み込む
 * - registry:lib   tv       … tv / cn / フォーカス表示のクラス
 * - registry:file  theme    … Tailwind のテーマ。トークンの CSS を同梱した 1 ファイル（scripts/build-registry-assets.ts が作る）
 * - registry:file  design-md … プロダクト用の DESIGN.md と docs/design-principles/（同上。ADR-0019）
 * - registry:ui    各コンポーネント
 *
 * 実行: make registry（--check で差分検出）。公開は shadcn build（registry:build）
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = resolve(ROOT, 'registry.json');
const CHECK = process.argv.includes('--check');
const NS = '@8341';
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8')) as { version: string };
const catalog = readFileSync(resolve(ROOT, '../../pnpm-workspace.yaml'), 'utf8');
const versionOf = (name: string) => {
  const m = catalog.match(new RegExp(`^\\s+'?${name.replace('/', '\\/')}'?: (\\S+)`, 'm'));
  return m ? `${name}@${m[1]}` : name;
};

interface Item {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: { path: string; type: string; target?: string }[];
  [k: string]: unknown;
}

/** docs/design-principles/ のファイル（design-md で利用側の docs/design-principles/ に置く） */
const PRINCIPLES = resolve(ROOT, '../../docs/design-principles');
const principleFiles = readdirSync(PRINCIPLES, { recursive: true, withFileTypes: true })
  .filter((d) => d.isFile() && d.name.endsWith('.md'))
  .map((d) => relative(PRINCIPLES, resolve(d.parentPath, d.name)))
  .sort();

/** コンポーネントのディレクトリ（PascalCase。src/components/ui/Button など） */
const components = readdirSync(resolve(ROOT, 'src/components/ui'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

/** レジストリの名前は kebab-case（Button → button、FormField → form-field）。`shadcn add @8341/form-field` で使う */
const kebab = (dir: string) => dir.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** メインの export function（ディレクトリ名と同じ名前）の直前の JSDoc の 1 文目を説明にする */
function describe(fn: string, source: string): string {
  for (const m of source.matchAll(/\/\*\*((?:(?!\*\/)[\s\S])*?)\*\/\s*export function (\w+)/g)) {
    if (m[2] !== fn) continue;
    const text = (m[1] ?? '')
      .split('\n')
      .map((l) => l.replace(/^\s*\*\s?/, '').trim())
      .filter(Boolean)
      .join('');
    const first = text.split('。')[0];
    if (first) return `${first}。`;
  }
  return fn;
}

/** 配布するファイル（本体・フック・子コンポーネント）。テスト・ストーリー・Code Connect は除く */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((d) => (d.isDirectory() ? sourceFiles(resolve(dir, d.name)) : [resolve(dir, d.name)]))
    .filter((f) => /\.tsx?$/.test(f) && !/\.(test|stories|figma)\.tsx?$/.test(f))
    .sort();
}

const uiItems: Item[] = components.map((dir) => {
  const name = kebab(dir);
  // パスに ui/ を含めると、shadcn は利用側の ui ディレクトリの下に Button/index.tsx として置く（ui/ より後ろを保つ）
  const paths = sourceFiles(resolve(ROOT, 'src/components/ui', dir)).map((f) => relative(ROOT, f));
  const main = `src/components/ui/${dir}/index.tsx`;
  const source = paths.map((p) => readFileSync(resolve(ROOT, p), 'utf8')).join('\n');
  const npm = new Set<string>();
  const local = new Set<string>([`${NS}/tv`]);
  for (const m of source.matchAll(/from '([^']+)'/g)) {
    const spec = m[1] as string;
    if (spec.startsWith('@base-ui/react')) npm.add(versionOf('@base-ui/react'));
    else if (spec.startsWith('@/components/ui/')) local.add(`${NS}/${kebab(spec.split('/')[3] ?? '')}`);
  }
  if (source.includes('focusRing')) local.add(`${NS}/theme`);
  return {
    name,
    type: 'registry:ui',
    title: dir,
    description: describe(dir, readFileSync(resolve(ROOT, main), 'utf8')),
    dependencies: [...npm].sort(),
    registryDependencies: [...local].filter((d) => d !== `${NS}/${name}`).sort(),
    files: [main, ...paths.filter((p) => p !== main)].map((path) => ({ path, type: 'registry:ui' })),
  };
});

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: '8341-ui',
  homepage: 'https://github.com/tkc310/8341-ui',
  items: [
    {
      name: '8341-base',
      type: 'registry:base',
      title: '8341-ui base',
      description: `8341-ui ${pkg.version} の土台。ヘッドレス UI は Base UI に固定し、トークンとテーマを入れる`,
      // shadcn のドキュメントの「Custom base」の形（JSON スキーマとは食い違うため、CLI で受け付けられる方に合わせる）
      config: { style: 'base-nova', iconLibrary: 'none', rsc: true, tailwind: { cssVariables: true } },
      dependencies: [versionOf('@base-ui/react'), versionOf('tailwind-variants')],
      registryDependencies: [`${NS}/tv`, `${NS}/theme`],
    },
    {
      name: 'tv',
      type: 'registry:lib',
      title: 'tv / cn',
      description: '8341-ui のテーマ名を登録した tailwind-variants と、フォーカス表示のクラス',
      dependencies: [versionOf('tailwind-variants')],
      files: [
        { path: 'src/lib/tv.ts', type: 'registry:lib' },
        { path: 'src/lib/tw-merge-config.ts', type: 'registry:lib' },
        { path: 'src/lib/focus.ts', type: 'registry:lib' },
      ],
    },
    {
      name: 'theme',
      type: 'registry:file',
      title: 'Theme',
      description: 'Tailwind v4 のテーマ（トークン同梱）。globals.css で tailwindcss の後に @import する',
      // npm の 8341-ui-tokens に依存させず、レジストリだけで完結させる（ADR-0012）
      files: [{ path: 'registry-assets/8341-ui.css', type: 'registry:file', target: 'styles/8341-ui.css' }],
    },
    {
      name: 'design-md',
      type: 'registry:file',
      title: 'DESIGN.md',
      description:
        'プロダクト用の DESIGN.md（コードから読み取れない設計の考え方）と design-principles。リポジトリ直下に DESIGN.md、docs/design-principles/ に原則の全文を置く',
      // ~ は利用側のプロジェクトのルート
      files: [
        { path: 'registry-assets/DESIGN.md', type: 'registry:file', target: '~/DESIGN.md' },
        ...principleFiles.map((f) => ({
          path: `registry-assets/design-principles/${f}`,
          type: 'registry:file',
          target: `~/docs/design-principles/${f}`,
        })),
      ],
    },
    ...uiItems,
  ],
};

// レジストリだけで導入できるよう、npm に公開していない自前のパッケージには依存させない（ADR-0012）
for (const item of registry.items as Item[]) {
  const own = (item.dependencies ?? []).filter((d) => d.startsWith('8341-ui'));
  if (own.length) {
    console.error(`✖ ${item.name} が npm の ${own.join(', ')} に依存しています。レジストリだけで完結させてください`);
    process.exit(1);
  }
}

const content = `${JSON.stringify(registry, null, 2)}\n`;
if (CHECK) {
  let current = '';
  try {
    current = readFileSync(OUT, 'utf8');
  } catch {}
  if (current !== content) {
    console.error('✖ registry.json が古くなっています。make registry を実行してください');
    process.exit(1);
  }
  console.log('✔ registry.json はコンポーネントと一致しています');
} else {
  writeFileSync(OUT, content);
  console.log(`✔ registry.json（${registry.items.length} 件）`);
}
