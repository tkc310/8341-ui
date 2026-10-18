import { resolve } from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * 2 つのテストプロジェクト
 * - unit: jsdom 上のコンポーネント・スクリプトのテスト（axe による a11y チェックを含む）
 * - storybook: 全ストーリーを実ブラウザで描画し、addon-a11y で WCAG 違反を検出する
 */
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
          css: true,
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: resolve(import.meta.dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
