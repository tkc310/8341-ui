import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

/**
 * サイドバーのロゴ。テーマを指定すると OS のライト / ダークに追従しなくなるため、OS の設定から土台を選ぶ。
 * ロゴ（public/logo.svg・favicon.svg）は SVG 内のメディアクエリで自らライト / ダークを切り替える。
 */
const dark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

addons.setConfig({
  theme: create({
    base: dark ? 'dark' : 'light',
    brandTitle: '8341-ui',
    brandUrl: 'https://github.com/tkc310/8341-ui',
    brandImage: './logo.svg',
    brandTarget: '_self',
  }),
});
