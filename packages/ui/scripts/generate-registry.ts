/**
 * shadcn 方式の配布用 registry.json を、各コンポーネントの import から生成する。
 * 依存（npm パッケージ・他のコンポーネント）を手で書かないので、ずれない。
 *
 * - registry:base  tkc-base … Base UI を固定した土台。利用側の `shadcn init` で読み込む
 * - registry:lib   tv       … tv / cn / フォーカス表示のクラス
 * - registry:file  theme    … Tailwind のテーマ。トークンの CSS を同梱した 1 ファイル（scripts/build-registry-css.ts が作る）
 * - registry:ui    各コンポーネント
 *
 * 実行: pnpm --filter 8341-ui registry（--check で差分検出）。公開は shadcn build（registry:build）
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = resolve(ROOT, 'registry.json');
const CHECK = process.argv.includes('--check');
const NS = '@tkc';
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

const components = readdirSync(resolve(ROOT, 'src/components'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

/** メインの export function（ディレクトリ名を PascalCase にした名前）の直前の JSDoc の 1 文目を説明にする */
function describe(name: string, source: string): string {
  const fn = name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());
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

const uiItems: Item[] = components.map((name) => {
  const path = `src/components/${name}/${name}.tsx`;
  const source = readFileSync(resolve(ROOT, path), 'utf8');
  const npm = new Set<string>();
  const local = new Set<string>([`${NS}/tv`]);
  for (const m of source.matchAll(/from '([^']+)'/g)) {
    const spec = m[1] as string;
    if (spec.startsWith('@base-ui/react')) npm.add(versionOf('@base-ui/react'));
    else if (spec.startsWith('@/components/ui/')) local.add(`${NS}/${spec.split('/').pop()}`);
  }
  if (source.includes('focusRing')) local.add(`${NS}/theme`);
  return {
    name,
    type: 'registry:ui',
    title: name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase()),
    description: describe(name, source),
    dependencies: [...npm].sort(),
    registryDependencies: [...local].filter((d) => d !== `${NS}/${name}`).sort(),
    files: [{ path, type: 'registry:ui' }],
  };
});

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: '8341-ui',
  homepage: 'https://github.com/tkc310/design-system-myself',
  items: [
    {
      name: 'tkc-base',
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
    console.error('✖ registry.json が古くなっています。pnpm --filter 8341-ui registry を実行してください');
    process.exit(1);
  }
  console.log('✔ registry.json はコンポーネントと一致しています');
} else {
  writeFileSync(OUT, content);
  console.log(`✔ registry.json（${registry.items.length} 件）`);
}
