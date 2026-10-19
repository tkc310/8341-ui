/**
 * アーキテクチャルール。pnpm check（depcruise packages apps）で検査する。
 * レイヤー: tokens ← ui（lib → primitives → components）← storybook / registry
 * @type {import('dependency-cruiser').IConfiguration}
 */
module.exports = {
  forbidden: [
    { name: 'no-circular', severity: 'error', from: {}, to: { circular: true } },
    {
      name: 'tokens-are-leaf',
      comment: 'トークンはどのパッケージにも依存しない',
      severity: 'error',
      from: { path: '^packages/tokens/src' },
      to: { path: '^(packages/ui|apps)/' },
    },
    {
      name: 'ui-not-to-apps',
      comment: 'コンポーネントは Storybook などのアプリに依存しない',
      severity: 'error',
      from: { path: '^packages/ui/src' },
      to: { path: '^apps/' },
    },
    {
      name: 'lib-not-to-components',
      comment: 'lib（cn・variants の共通処理）はコンポーネントに依存しない',
      severity: 'error',
      from: { path: '^packages/ui/src/lib' },
      to: { path: '^packages/ui/src/components' },
    },
    {
      name: 'components-not-to-stories-or-tests',
      comment: '本体からストーリー・テスト・Code Connect・テスト用の道具（src/test）を参照しない（配布物に混ざるため）',
      severity: 'error',
      from: {
        path: '^packages/ui/src',
        pathNot: ['[.](stories|test|vrt[.]test|figma)[.]tsx?$', '^packages/ui/src/test/'],
      },
      to: { path: ['[.](stories|test|vrt[.]test|figma)[.]tsx?$', '^packages/ui/src/test/'] },
    },
    {
      name: 'components-via-public-api',
      comment:
        'コンポーネント同士は各ディレクトリの index.tsx（公開 API）経由で参照する。子コンポーネント（Button/Child/）やフック（useXxx.ts）は親の配下からだけ使う（packages/ui/src/components/COMPONENT_STRUCTURE.md）',
      severity: 'error',
      from: { path: '^packages/ui/src/components/ui/([^/]+)/' },
      to: {
        path: '^packages/ui/src/components/ui/([^/]+)/(?!index[.]tsx$)',
        pathNot: '^packages/ui/src/components/ui/$1/',
      },
    },
    {
      name: 'base-ui-only-in-components',
      comment: 'Base UI はコンポーネント層だけで使い、アプリから直接使わない（registry:base で固定しているため）',
      severity: 'error',
      from: { path: '^apps/' },
      to: { path: 'node_modules/@base-ui/react' },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: [
          '[.]d[.]ts$',
          '(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|json)$',
          'vite[.]config[.]ts$',
          '(^|/)[.]storybook/',
          '[.](stories|figma|test|vrt[.]test)[.]tsx?$',
          '(^|/)scripts/',
        ],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '(dist|storybook-static|[.]vitest)/' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'types', 'default'],
    },
  },
};
