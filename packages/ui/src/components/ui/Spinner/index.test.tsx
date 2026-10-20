import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { expectNoA11yViolations } from '@/test/a11y';
import { Spinner } from './index';

describe('Spinner', () => {
  it('role="status" の中に文言を持ち、既定では視覚的に隠す', async () => {
    const { container } = render(<Spinner label="読み込んでいます" />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('読み込んでいます');
    expect(screen.getByText('読み込んでいます')).toHaveClass('sr-only');
    await expectNoA11yViolations(container);
  });

  it('showLabel で文言を画面にも表示する', () => {
    render(<Spinner label="保存しています" showLabel />);
    expect(screen.getByText('保存しています')).not.toHaveClass('sr-only');
  });
});
