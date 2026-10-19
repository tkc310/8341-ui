import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Icon } from '@/components/ui/icon';
import { Stack } from '@/components/ui/stack';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: '申請する', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          '操作を実行するボタン（Base UI の Button）。画面遷移だけなら Link を使う。primary は 1 画面に 1 つが目安で、ラベルは「〜する」と動詞で書く。',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack direction="horizontal" wrap>
      <Button {...args} variant="primary">
        保存する
      </Button>
      <Button {...args} variant="secondary">
        下書きに戻す
      </Button>
      <Button {...args} variant="tertiary">
        キャンセル
      </Button>
      <Button {...args} variant="danger">
        削除する
      </Button>
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="horizontal" wrap>
      <Button {...args} size="sm">
        小（見た目 36px / タップ 44px）
      </Button>
      <Button {...args} size="md">
        標準 44px
      </Button>
      <Button {...args} size="lg">
        大 52px
      </Button>
    </Stack>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Stack direction="horizontal" wrap>
      <Button {...args} iconStart={<Icon name="search" />}>
        検索する
      </Button>
      <Button {...args} variant="secondary" iconEnd={<Icon name="arrow-right" />}>
        次へ進む
      </Button>
    </Stack>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          '無効化は理由が伝わらないため最小限に。入力の不足は、ボタンを押せる状態のまま、押したときにエラーで示す（design-principles「誤りと撤回」）。',
      },
    },
  },
};

export const Loading: Story = {
  args: { loading: true, children: '送信しています' },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toHaveAttribute('aria-busy', 'true');
    // 文字を見えなくしても、ボタンの名前は残す
    await expect(button).toHaveAccessibleName('送信しています');
    await expect(button).toBeEnabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Keyboard: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.tab();
    const button = within(canvasElement).getByRole('button');
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalled();
  },
};
