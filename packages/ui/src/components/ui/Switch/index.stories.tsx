import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Stack } from '@/components/ui/Stack/index';
import { Switch } from './index';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { label: '新着の通知を受け取る', onCheckedChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'オン / オフを切り替えるスイッチ（Base UI の Switch）。押した瞬間に反映される設定に使い、送信して反映される選択（同意など）は Checkbox を使う。オンでは色に加えてつまみにチェックを出す。',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: '新着の通知を受け取る' });
    await expect(control).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(canvas.getByText('新着の通知を受け取る'));
    await expect(control).toHaveAttribute('aria-checked', 'true');
    // キーボードでも切り替えられる
    control.focus();
    await userEvent.keyboard(' ');
    await expect(control).toHaveAttribute('aria-checked', 'false');
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
  },
};

export const States: Story = {
  render: (args) => (
    <Stack gap="sm">
      <Switch {...args} label="オフ" />
      <Switch {...args} label="オン" defaultChecked />
      <Switch {...args} label="オフ（無効）" disabled />
      <Switch {...args} label="オン（無効）" defaultChecked disabled />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="sm">
      <Switch {...args} label="標準（md）" defaultChecked />
      <Switch {...args} label="小（sm）。項目名の横に並べる" size="sm" defaultChecked />
    </Stack>
  ),
};

export const WithDescription: Story = {
  args: {
    label: '自動保存',
    description: '入力内容を 30 秒ごとに下書きとして保存します',
    defaultChecked: true,
  },
};
