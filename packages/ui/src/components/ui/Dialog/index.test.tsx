import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vite-plus/test';
import { Button } from '@/components/ui/Button/index';
import { expectNoA11yViolations } from '@/test/a11y';
import { Dialog } from './index';

describe('Dialog', () => {
  it('見出しと補足でダイアログに名前と説明が付く', async () => {
    render(
      <Dialog open title="経歴を編集" description="変更は保存するまで反映されません" onOpenChange={() => {}}>
        <p>本文</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { name: '経歴を編集' });
    expect(dialog).toHaveAccessibleDescription('変更は保存するまで反映されません');
    await expectNoA11yViolations(dialog);
  });

  it('開くボタンで開き、閉じるボタンで閉じてフォーカスを開くボタンに戻す', async () => {
    const user = userEvent.setup();
    render(
      <Dialog title="経歴を追加" trigger={<Button>経歴を追加する</Button>} footer={<Button>保存する</Button>}>
        <p>本文</p>
      </Dialog>,
    );
    const trigger = screen.getByRole('button', { name: '経歴を追加する' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: '経歴を追加' });
    expect(dialog).toContainElement(screen.getByRole('button', { name: '保存する' }));
    await user.click(screen.getByRole('button', { name: '閉じる' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('Esc で閉じる', async () => {
    const user = userEvent.setup();
    render(
      <Dialog title="経歴を追加" trigger={<Button>経歴を追加する</Button>}>
        <p>本文</p>
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: '経歴を追加する' }));
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('閉じるボタンの文言を変えられる', () => {
    render(
      <Dialog open title="Edit" closeLabel="Close" onOpenChange={() => {}}>
        <p>body</p>
      </Dialog>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
