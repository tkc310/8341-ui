import { defineConfig, devices } from '@playwright/test';

/**
 * e2e（手動・都度実行）: pnpm test:e2e
 * Storybook を起動し、コンポーネントを組み合わせたフローをキーボードで通す。
 */
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:6007' },
  webServer: {
    command: 'pnpm exec storybook dev --ci --no-open -p 6007',
    url: 'http://localhost:6007',
    reuseExistingServer: true,
    timeout: 300_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 15'] } },
    { name: 'forced-colors', use: { ...devices['Desktop Chrome'], forcedColors: 'active' } },
  ],
});
