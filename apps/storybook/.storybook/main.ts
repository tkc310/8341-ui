import type { StorybookConfig } from '@storybook/react-vite';

/**
 * ストーリーはコンポーネントの隣（packages/ui/src/components/**）に置き、ここから読み込む。
 * Vite の設定（Tailwind・import パスの別名）は ../vite.config.ts を Storybook が自動で読む。
 */
const config: StorybookConfig = {
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)', '../../../packages/ui/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  // レジストリ（/r/*.json）を Storybook と同じ場所から配信する
  staticDirs: ['../public'],
  docs: { defaultName: 'ドキュメント' },
};

export default config;
