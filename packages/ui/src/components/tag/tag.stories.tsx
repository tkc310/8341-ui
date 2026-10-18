import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@/components/ui/icon';
import { Stack } from '@/components/ui/stack';
import { Tag } from './tag';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  args: { children: '下書き' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <Stack direction="horizontal" wrap>
      <Tag>下書き</Tag>
      <Tag tone="key">新着</Tag>
      <Tag tone="success" icon={<Icon name="check" />}>
        承認済み
      </Tag>
      <Tag tone="warning" icon={<Icon name="warning" />}>
        要確認
      </Tag>
      <Tag tone="danger" icon={<Icon name="close" />}>
        差し戻し
      </Tag>
    </Stack>
  ),
};
