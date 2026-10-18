import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@/components/ui/stack';
import { Text } from '@/components/ui/text';
import { Icon, iconNames } from './icon';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  args: { name: 'info' },
  parameters: {
    docs: { description: { component: 'アイコンはテキストと併用する。単独で意味を伝える場合だけ label を付ける。' } },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <Stack direction="horizontal" wrap>
      {iconNames.map((name) => (
        <Stack key={name} gap="sm" align="center" className="w-24">
          <Icon name={name} size="lg" />
          <Text as="span" variant="mono-sm">
            {name}
          </Text>
        </Stack>
      ))}
    </Stack>
  ),
};
