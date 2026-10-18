import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite-plus';
import { playwright } from 'vite-plus/test/browser-playwright';
import { alias } from '../../packages/ui/vite.config';

const dirname = import.meta.dirname;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      ...alias,
      // 開発中はビルドせずにソースのテーマを読む
      { find: 'tkc310-ui/theme.css', replacement: resolve(dirname, '../../packages/ui/src/styles/theme.css') },
    ],
  },
  test: {
    projects: [
      {
        // 全ストーリーを実ブラウザで描画し、play 関数と addon-a11y（axe）の検査を行う
        extends: true,
        plugins: [storybookTest({ configDir: resolve(dirname, '.storybook'), storybookScript: 'pnpm dev --no-open' })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
