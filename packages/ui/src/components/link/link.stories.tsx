import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '@/components/ui/text';
import { Link } from './link';

const meta = {
  title: 'Components/Link',
  component: Link,
  args: { href: '#', children: '利用規約' },
  parameters: {
    docs: {
      description: {
        component:
          'ページ遷移に使う。下線は常に表示し、5 状態（通常・訪問済み・ホバー・押下・フォーカス）を持つ。リンク文は「こちら」ではなく行き先が分かる文にする。',
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InSentence: Story = {
  render: (args) => (
    <Text>
      ご利用の前に <Link {...args} /> と <Link href="#privacy">個人情報の取り扱い</Link> をお読みください。
    </Text>
  ),
};

export const External: Story = {
  args: { href: 'https://www.w3.org/WAI/standards-guidelines/wcag/', target: '_blank', children: 'WCAG の概要（W3C）' },
};
