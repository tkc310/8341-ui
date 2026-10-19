import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { NotificationBanner } from './index';

describe('NotificationBanner', () => {
  it('種別を文字でも伝え、live のときだけ role を付ける', () => {
    const { rerender } = render(<NotificationBanner tone="danger" title="入力に誤りがあります" />);
    expect(screen.getByRole('heading', { name: 'エラー: 入力に誤りがあります' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
    rerender(<NotificationBanner tone="danger" title="入力に誤りがあります" live />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
