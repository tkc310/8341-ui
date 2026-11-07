import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '@/components/ui/Button/index';
import { NotificationBanner } from '@/components/ui/NotificationBanner/index';
import { AlertDialog } from './index';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  args: {
    title: '「週次レポート」を削除しますか',
    description: '元に戻せません。',
    confirmLabel: '削除する',
    trigger: <Button variant="tertiary">削除</Button>,
    onConfirm: () => wait(600),
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['danger', 'primary'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          '取り消せない操作の前に、実行してよいかを確かめるダイアログ（Base UI の AlertDialog）。見出しは対象を入れた問いかけ、説明は結果（元に戻せないこと）、ボタンは「キャンセル」と動詞の「削除する」。開くとフォーカスはキャンセルに置き、外側を押しても閉じない。onConfirm が Promise を返すと、終わるまで実行ボタンを処理中にする。',
      },
    },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: '削除' });
    await userEvent.click(trigger);
    const dialog = await body.findByRole('alertdialog', { name: '「週次レポート」を削除しますか' });
    await waitFor(() => expect(dialog).toBeVisible());
    // Enter の押し間違いで実行しないよう、フォーカスはキャンセルにある
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'キャンセル' })).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('alertdialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

/** 失うものが無い確認（送信・公開など）は primary にする */
export const Primary: Story = {
  args: {
    tone: 'primary',
    title: '申請を送信しますか',
    description: '送信すると、承認されるまで内容を変えられません。',
    confirmLabel: '送信する',
    trigger: <Button>申請を送信する</Button>,
  },
};

function FailOnce() {
  const [error, setError] = useState(false);
  return (
    <AlertDialog
      title="「週次レポート」を削除しますか"
      description="元に戻せません。"
      confirmLabel="削除する"
      trigger={<Button variant="tertiary">削除</Button>}
      onOpenChange={() => setError(false)}
      onConfirm={async () => {
        await wait(400);
        if (!error) {
          setError(true);
          throw new Error('通信に失敗しました');
        }
      }}
    >
      {error && (
        <NotificationBanner tone="danger" title="削除できませんでした" live>
          通信が切れました。もう一度「削除する」を押してください。
        </NotificationBanner>
      )}
    </AlertDialog>
  );
}

/** onConfirm が例外を投げると開いたままになる。失敗は children で知らせる（1 回目は失敗し、2 回目で閉じる） */
export const Failure: Story = {
  render: () => <FailOnce />,
};
