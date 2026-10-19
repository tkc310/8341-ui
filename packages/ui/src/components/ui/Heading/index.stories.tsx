import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@/components/ui/Stack/index';
import { Heading } from './index';

const meta = {
  title: 'Components/Heading',
  component: Heading,
  args: { level: 2, children: '申請の手順' },
  parameters: {
    docs: {
      description: {
        component:
          '文書構造（level）と見た目（size）を分けて指定できる。h1 はページに 1 つ、レベルは飛ばさない。大きい見出しほど字間を詰め、約物は palt で詰める。',
      },
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scale: Story = {
  render: () => (
    <Stack gap="sm">
      <Heading level={1} size="display-lg">
        Display L 56px
      </Heading>
      <Heading level={2} size="display-md">
        Display M 44px
      </Heading>
      <Heading level={2} size="xl">
        Heading XL 36px「見出し」
      </Heading>
      <Heading level={2} size="lg">
        Heading L 32px
      </Heading>
      <Heading level={3} size="md">
        Heading M 28px
      </Heading>
      <Heading level={4} size="sm">
        Heading S 24px
      </Heading>
      <Heading level={5} size="xs">
        Heading XS 20px
      </Heading>
      <Heading level={6} size="xxs">
        Heading XXS 18px
      </Heading>
    </Stack>
  ),
};

export const Decorations: Story = {
  render: () => (
    <Stack>
      <Heading level={2} decoration="bar">
        左に縦線（bar）
      </Heading>
      <Heading level={2} decoration="rule">
        下線で区切る（rule）
      </Heading>
      <Heading level={2} shoulder="ステップ 2">
        必要書類をアップロードする
      </Heading>
    </Stack>
  ),
};
