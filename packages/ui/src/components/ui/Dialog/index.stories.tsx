import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '@/components/ui/Button/index';
import { FormField } from '@/components/ui/FormField/index';
import { TextField } from '@/components/ui/TextField/index';
import { Dialog } from './index';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: {
    title: '経歴を追加',
    description: '保存するまで一覧には反映されません',
    trigger: <Button variant="secondary">経歴を追加する</Button>,
    children: null,
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['center', 'side'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          '画面の上に重ねて表示するダイアログ（Base UI の Dialog）。開くとフォーカスが中に移り、Esc か「閉じる」で閉じると開いたボタンに戻る。見出し（title）は必須。placement="side" は先頭側からせり出し、裏の画面も操作できる。',
      },
    },
  },
  render: (args) => (
    <Dialog
      {...args}
      footer={
        <>
          <Button variant="tertiary">下書きに保存する</Button>
          <Button>追加する</Button>
        </>
      }
    >
      <FormField label="会社名" required>
        <TextField autoComplete="organization" />
      </FormField>
      <FormField label="期間" supportText="例: 2020年4月〜2024年3月">
        <TextField />
      </FormField>
    </Dialog>
  ),
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: '経歴を追加する' });
    await userEvent.click(trigger);
    const dialog = await body.findByRole('dialog', { name: '経歴を追加' });
    await expect(dialog).toBeVisible();
    // Esc で閉じ、フォーカスは開いたボタンに戻る
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const Side: Story = {
  args: { placement: 'side', title: '経歴を編集', trigger: <Button variant="secondary">経歴を編集する</Button> },
};

function Controlled() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        利用規約を読む
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="利用規約"
        footer={<Button onClick={() => setOpen(false)}>同意する</Button>}
      >
        <p className="m-0">本文が長い場合は、ダイアログの中だけがスクロールします。</p>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} className="m-0">
            第 {i + 1} 条　サービスの利用にあたっては、この規約のすべての条項に同意したものとみなします。
          </p>
        ))}
      </Dialog>
    </>
  );
}

/** open / onOpenChange で開閉を管理する例。本文が長いときは本文だけがスクロールする */
export const ControlledLongContent: Story = {
  args: { title: '利用規約', trigger: undefined },
  render: () => <Controlled />,
};
