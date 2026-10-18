import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button/Button';
import { Icon } from './Icon/Icon';
import { Link } from './Link/Link';
import { NotificationBanner } from './NotificationBanner/NotificationBanner';
import { Stack } from './Stack/Stack';
import { Tag } from './Tag/Tag';

const meta = {
  title: 'Components/Feedback',
  parameters: {
    docs: {
      description: {
        component: '状態を伝える部品。色だけで意味を伝えず、アイコンと文言を必ず併用する。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Banners: Story = {
  render: () => (
    <Stack>
      <NotificationBanner tone="info" title="システムメンテナンスのお知らせ">
        <p>
          10 月 25 日（日）2:00〜6:00 はご利用いただけません。<Link href="#">詳細を見る</Link>
        </p>
      </NotificationBanner>
      <NotificationBanner tone="success" title="申請を受け付けました" onClose={() => {}}>
        <p>受付番号: 2026-001234</p>
      </NotificationBanner>
      <NotificationBanner
        tone="warning"
        title="提出期限が近づいています"
        actions={
          <Button size="sm" variant="secondary">
            今すぐ提出する
          </Button>
        }
      >
        <p>あと 3 日で期限です。</p>
      </NotificationBanner>
      <NotificationBanner tone="danger" title="2 件の入力内容に誤りがあります">
        <ul style={{ margin: 0, paddingInlineStart: '1.25em' }}>
          <li>
            <Link href="#email">メールアドレス</Link>
          </li>
          <li>
            <Link href="#tel">電話番号</Link>
          </li>
        </ul>
      </NotificationBanner>
    </Stack>
  ),
};

export const Tags: Story = {
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
