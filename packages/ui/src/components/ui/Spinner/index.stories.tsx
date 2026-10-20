import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stack } from '@/components/ui/Stack/index';
import { Spinner } from './index';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  args: { label: '読み込んでいます' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          '読み込みや保存の最中であることを示す。role="status" の中に文言（label）を持つので、表示しない場合も読み上げには伝わる。ボタンの処理中は Button の loading を使う。',
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('読み込んでいます');
  },
};

export const WithLabel: Story = {
  args: { label: '保存しています', showLabel: true, size: 'sm' },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="horizontal" wrap>
      <Spinner {...args} size="sm" showLabel label="小（16px）" />
      <Spinner {...args} size="md" showLabel label="標準（20px）" />
      <Spinner {...args} size="lg" showLabel label="大（24px）" />
    </Stack>
  ),
};

/** 待ち時間が短いときにちらつかないよう、300ms 遅れて表示する */
export const Delayed: Story = {
  args: { delay: true, showLabel: true },
};
