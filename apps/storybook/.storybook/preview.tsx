/// <reference path="../src/env.d.ts" />
import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../src/storybook.css';

/** ツールバーで light / dark / 並べて表示 を切り替える（.dark と data-theme の両方を付ける） */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark' | 'side-by-side';

  useEffect(() => {
    const dark = theme === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', dark);
  }, [theme]);

  if (theme === 'side-by-side') {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
        {(['light', 'dark'] as const).map((t) => (
          <div key={t} data-theme={t} className={`${t} bg-canvas p-inset-xl text-fg`}>
            <Story />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div data-8341-root>
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'カラーテーマ',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'side-by-side', title: '並べて表示' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    a11y: {
      // 違反があればストーリーテスト（addon-vitest）を失敗させる
      test: 'error',
      options: { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    },
    backgrounds: { disable: true },
    options: { storySort: { order: ['はじめに', 'Foundations', 'Components', 'Patterns'] } },
  },
  tags: ['autodocs'],
};

export default preview;
