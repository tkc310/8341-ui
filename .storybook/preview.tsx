import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../src/styles/tokens.css';
import '../src/styles/typography.css';
import '../src/styles/base.css';

/** ツールバーで light / dark / 並べて表示 を切り替える */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark' | 'side-by-side';

  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
  }, [theme]);

  if (theme === 'side-by-side') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {(['light', 'dark'] as const).map((t) => (
          <div key={t} data-theme={t} style={{ padding: 24, background: 'var(--tkc-color-bg-canvas)', color: 'var(--tkc-color-text-default)' }}>
            <Story />
          </div>
        ))}
      </div>
    );
  }
  return <Story />;
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
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    a11y: {
      // 違反があればテスト（addon-vitest）を失敗させる
      test: 'error',
      options: {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
      },
    },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: ['はじめに', 'Foundations', 'Components', 'Patterns'],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
