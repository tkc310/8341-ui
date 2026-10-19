import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

/**
 * ストーリーはコンポーネントの隣（packages/ui/src/components/**）に置き、ここから読み込む。
 * Vite の設定（Tailwind・import パスの別名）は ../vite.config.ts を Storybook が自動で読む。
 */
const config: StorybookConfig = {
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)', '../../../packages/ui/src/**/*.stories.@(ts|tsx)'],
  addons: [
    // MDX の表・取り消し線など GitHub 形式の Markdown（GFM）を有効にする。Storybook の MDX は標準では表を描画しない
    {
      name: '@storybook/addon-docs',
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  // レジストリ（/r/*.json）を Storybook と同じ場所から配信する
  staticDirs: ['../public'],
  docs: { defaultName: 'ドキュメント' },
};

export default config;
