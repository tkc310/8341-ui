import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '@/components/ui/divider';
import { Stack } from '@/components/ui/stack';
import { Text } from './text';

const meta = {
  title: 'Components/Text',
  component: Text,
  args: { children: 'すべての人に、やさしいデジタルを。' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <Stack gap="sm">
      <Text>default（本文）</Text>
      <Text tone="subtle">subtle（補足）</Text>
      <Text tone="key">key</Text>
      <Text tone="danger">danger</Text>
      <Text tone="success">success</Text>
      <Text tone="warning">warning</Text>
      <Divider />
      <Text variant="body-sm">body-sm（最小 14px）</Text>
      <Text variant="mono-md">mono-md 0123456789</Text>
    </Stack>
  ),
};
