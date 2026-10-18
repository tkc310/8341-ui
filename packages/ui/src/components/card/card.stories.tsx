import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '@/components/ui/text';
import { Card } from './card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: '情報のまとまり。表の行の代わりに敷き詰めない。href を渡すとタイトルのリンクがカード全体に広がる。',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = {
  render: () => (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-gutter p-0">
      <Card as="li" eyebrow="手続き" title="引っ越しの手続き" href="#moving">
        <Text tone="subtle">転入・転出の届出、必要な書類をまとめています。</Text>
      </Card>
      <Card as="li" eyebrow="手続き" title="子育て支援の申請" href="#child">
        <Text tone="subtle">児童手当や保育園の申し込み方法。</Text>
      </Card>
      <Card
        as="li"
        variant="filled"
        title="リンクしないカード"
        footer={<Text variant="body-sm">2026年10月1日更新</Text>}
      >
        <Text tone="subtle">情報をまとめて見せるだけのカード。</Text>
      </Card>
    </ul>
  ),
};
