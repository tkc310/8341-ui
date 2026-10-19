import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import { playwright } from 'vite-plus/test/browser-playwright';
import { alias } from './alias';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias },

  pack: {
    entry: ['src/index.ts', 'src/components/*/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    // ファイル単位で出力し、各ファイルの 'use client' を残す（RSC で必要な部品だけをクライアントにするため）
    unbundle: true,
    platform: 'neutral',
    // Tailwind のテーマは別エントリで配る（ビルド済み styles.css は package.json の build で作る）
    copy: [{ from: 'src/styles/theme.css', to: 'dist' }],
    deps: {
      neverBundle: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^@base-ui\/react/,
        'tailwind-variants',
        /^8341-ui-tokens/,
      ],
    },
  },

  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'happy-dom',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.vrt.test.tsx'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        // VRT: 手動・都度実行（pnpm test:vrt）。基準画像は __screenshots__ にコミットする
        extends: true,
        test: {
          name: 'vrt',
          include: ['src/**/*.vrt.test.tsx'],
          setupFiles: ['./vitest.browser.setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium', viewport: { width: 1024, height: 768 } }],
            expect: {
              toMatchScreenshot: {
                comparatorName: 'pixelmatch',
                comparatorOptions: { allowedMismatchedPixelRatio: 0.002 },
              },
            },
          },
        },
      },
    ],
  },
});
