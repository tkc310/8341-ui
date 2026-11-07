import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vite-plus/test';
import { Button } from '@/components/ui/Button/index';
import { expectNoA11yViolations } from '@/test/a11y';
import { AlertDialog } from './index';

const renderDelete = (onConfirm: () => void | Promise<void>) =>
  render(
    <AlertDialog
      title="「週次レポート」を削除しますか"
      description="元に戻せません。"
      confirmLabel="削除する"
      onConfirm={onConfirm}
      trigger={<Button variant="tertiary">削除</Button>}
    />,
  );

describe('AlertDialog', () => {
  it('問いかけと説明で alertdialog に名前と説明が付き、フォーカスはキャンセルに置く', async () => {
    const user = userEvent.setup();
    renderDelete(() => {});
    await user.click(screen.getByRole('button', { name: '削除' }));
    const dialog = await screen.findByRole('alertdialog', { name: '「週次レポート」を削除しますか' });
    expect(dialog).toHaveAccessibleDescription('元に戻せません。');
    await waitFor(() => expect(screen.getByRole('button', { name: 'キャンセル' })).toHaveFocus());
    await expectNoA11yViolations(dialog);
  });

  it('キャンセルで閉じ、実行せずにフォーカスを開くボタンに戻す', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderDelete(onConfirm);
    const trigger = screen.getByRole('button', { name: '削除' });
    await user.click(trigger);
    await user.click(await screen.findByRole('button', { name: 'キャンセル' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    expect(onConfirm).not.toHaveBeenCalled();
    expect(trigger).toHaveFocus();
  });

  it('実行すると onConfirm を呼び、終わるまで処理中にしてから閉じる', async () => {
    const user = userEvent.setup();
    let finish = () => {};
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    renderDelete(onConfirm);
    await user.click(screen.getByRole('button', { name: '削除' }));
    const confirm = await screen.findByRole('button', { name: '削除する' });
    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(confirm).toHaveAttribute('aria-busy', 'true');
    // 処理中は Esc でも閉じない
    await user.keyboard('{Escape}');
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    finish();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  });

  it('onConfirm が失敗したら開いたままにする', async () => {
    const user = userEvent.setup();
    renderDelete(() => Promise.reject(new Error('通信に失敗しました')));
    await user.click(screen.getByRole('button', { name: '削除' }));
    await user.click(await screen.findByRole('button', { name: '削除する' }));
    await waitFor(() => expect(screen.getByRole('button', { name: '削除する' })).not.toHaveAttribute('aria-busy'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('外側を押しても閉じない', async () => {
    const user = userEvent.setup();
    renderDelete(() => {});
    await user.click(screen.getByRole('button', { name: '削除' }));
    await screen.findByRole('alertdialog');
    await user.click(document.body);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
});
