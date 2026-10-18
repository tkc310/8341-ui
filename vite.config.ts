/**
 * ルートの Vite+ 設定。lint / fmt / staged / run（タスク）はここに集約する。
 * Vite / Vitest / pack の設定は各パッケージの vite.config.ts に置く。
 * 参考: https://main.viteplus.dev/guide/monorepo
 */
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    ignorePatterns: ['**/dist/**', '**/storybook-static/**', '**/.vitest/**', 'packages/tokens/dist/**'],
    plugins: ['typescript', 'import', 'unicorn'],
    // 型情報つきの lint（oxlint-tsgolint）。vp check で型検査も行う
    options: { typeAware: true, typeCheck: true },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'typescript/no-explicit-any': 'error',
      'typescript/no-floating-promises': 'error',
      'import/no-cycle': 'error',
    },
    overrides: [
      {
        files: ['packages/ui/src/**/*.tsx'],
        plugins: ['react', 'jsx-a11y'],
        rules: {
          'react/self-closing-comp': 'error',
          'react/jsx-key': 'error',
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn',
          // アクセシビリティ（ルールブック 02 章）
          'jsx-a11y/alt-text': 'error',
          'jsx-a11y/anchor-has-content': 'error',
          'jsx-a11y/aria-props': 'error',
          'jsx-a11y/aria-role': 'error',
          'jsx-a11y/no-autofocus': 'error',
          'jsx-a11y/no-redundant-roles': 'error',
          'jsx-a11y/role-has-required-aria-props': 'error',
        },
      },
      {
        files: ['**/*.test.{ts,tsx}', '**/*.stories.tsx', '**/e2e/**'],
        plugins: ['vitest'],
        rules: { 'typescript/no-floating-promises': 'off' },
      },
      {
        files: ['packages/tokens/scripts/**', 'packages/ui/scripts/**', 'apps/storybook/scripts/**'],
        rules: { 'no-console': 'off' },
      },
    ],
  },

  fmt: {
    ignorePatterns: [
      '**/dist/**',
      '**/storybook-static/**',
      'pnpm-lock.yaml',
      'packages/tokens/dist/**',
      'packages/ui/src/lib/tw-merge-config.ts',
      // 生成物（生成スクリプトの --check と整形結果が食い違わないよう、整形の対象から外す）
      'packages/ui/registry.json',
      // Markdown は整形しない。oxfmt は表の列幅をそろえるため、ログやバックログに 1 行足すたびに表全体が書き換わり、
      // 生成スクリプト（DESIGN.md の表）の --check とも食い違う
      '**/*.md',
      'packages/tokens/src/primitive/color.tokens.json',
      'apps/storybook/public/r/**',
    ],
    singleQuote: true,
    semi: true,
    printWidth: 120,
    sortPackageJson: true,
  },

  check: { fmt: true, lint: true },

  staged: {
    '*': 'vp check --fix',
  },

  run: {
    cache: { scripts: false, tasks: true },
    tasks: {},
  },

  defaultPackage: { dev: './apps/storybook', pack: './packages/ui' },
});
