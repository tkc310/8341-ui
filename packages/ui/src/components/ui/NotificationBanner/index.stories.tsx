import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/Button/index';
import { Link } from '@/components/ui/Link/index';
import { Stack } from '@/components/ui/Stack/index';
import { NotificationBanner } from './index';

const meta = {
  title: 'Components/NotificationBanner',
  component: NotificationBanner,
  args: { title: 'システムメンテナンスのお知らせ' },
  parameters: {
    docs: {
      description: {
        component:
          '状態を伝えるバナー。色だけで意味を伝えず、アイコンと文言（読み上げ用の種別名を含む）を必ず併用する。',
      },
    },
  },
} satisfies Meta<typeof NotificationBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <Stack>
      <NotificationBanner tone="info" title="システムメンテナンスのお知らせ">
        <p>
          10 月 25 日（日）2:00〜6:00 はご利用いただけません。<Link href="#">メンテナンスの詳細を見る</Link>
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
        <ul className="m-0 ps-stack-md">
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
