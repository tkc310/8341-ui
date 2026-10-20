import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vite-plus/test';
import { expectNoA11yViolations } from '@/test/a11y';
import { Switch } from './index';

describe('Switch', () => {
  it('ラベルで名前が付き、role="switch" で状態を伝える', async () => {
    const { container } = render(<Switch label="通知を受け取る" defaultChecked />);
    expect(screen.getByRole('switch', { name: '通知を受け取る' })).toHaveAttribute('aria-checked', 'true');
    await expectNoA11yViolations(container);
  });

  it('ラベルとスイッチのクリックで切り替わる', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="自動保存" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch', { name: '自動保存' });
    await user.click(screen.getByText('自動保存'));
    expect(control).toHaveAttribute('aria-checked', 'true');
    // キーボード（Space）での切り替えは、実ブラウザで動くストーリーの play 関数で検査する（happy-dom は非ネイティブのボタンの Space を再現しない）
    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'false');
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it('無効のときは切り替わらない', async () => {
    const user = userEvent.setup();
    render(<Switch label="自動保存" disabled />);
    await user.click(screen.getByText('自動保存'));
    expect(screen.getByRole('switch', { name: '自動保存' })).toHaveAttribute('aria-checked', 'false');
  });
});
