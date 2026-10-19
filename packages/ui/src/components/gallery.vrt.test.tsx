/**
 * VRT（手動・都度実行）: pnpm test:vrt。基準画像の更新は pnpm test:vrt -u。
 * ライト / ダーク / 強制カラーを想定し、主要な状態を 1 枚に並べて撮る。
 */
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser/context';
import { Button } from '@/components/ui/Button/index';
import { Checkbox } from '@/components/ui/Checkbox/index';
import { FormField } from '@/components/ui/FormField/index';
import { Link } from '@/components/ui/Link/index';
import { NotificationBanner } from '@/components/ui/NotificationBanner/index';
import { Radio, RadioGroup } from '@/components/ui/RadioGroup/index';
import { Stack } from '@/components/ui/Stack/index';
import { Tag } from '@/components/ui/Tag/index';
import { TextField } from '@/components/ui/TextField/index';

function Gallery() {
  return (
    <Stack className="bg-canvas p-inset-xl text-fg" data-testid="gallery">
      <Stack direction="horizontal" wrap>
        <Button>保存する</Button>
        <Button variant="secondary">下書きに戻す</Button>
        <Button variant="tertiary">キャンセル</Button>
        <Button variant="danger">削除する</Button>
        <Button disabled>無効</Button>
        <Button size="sm">小</Button>
      </Stack>
      <p className="m-0">
        本文中の <Link href="#">リンク</Link> と{' '}
        <Link href="https://example.com" target="_blank">
          外部リンク
        </Link>
      </p>
      <Stack direction="horizontal" wrap>
        <Tag>下書き</Tag>
        <Tag tone="success">承認済み</Tag>
        <Tag tone="danger">差し戻し</Tag>
      </Stack>
      <FormField label="氏名" required supportText="戸籍上の氏名">
        <TextField defaultValue="山田 太郎" />
      </FormField>
      <FormField label="メールアドレス" error="「@」が含まれていません">
        <TextField defaultValue="taro.example.jp" />
      </FormField>
      <Checkbox label="メールで受け取る" defaultChecked />
      <RadioGroup legend="受け取り方法" defaultValue="post" orientation="horizontal">
        <Radio value="post" label="郵送" />
        <Radio value="online" label="オンライン" />
      </RadioGroup>
      <NotificationBanner tone="warning" title="提出期限が近づいています" />
    </Stack>
  );
}

describe.each(['light', 'dark'] as const)('%s テーマ', (theme) => {
  it('主要コンポーネントの見た目が変わっていない', async () => {
    document.documentElement.dataset.theme = theme;
    render(<Gallery />);
    await expect.element(page.getByTestId('gallery')).toMatchScreenshot(`gallery-${theme}`);
  });

  it('フォーカス表示が見える', async () => {
    document.documentElement.dataset.theme = theme;
    render(<Gallery />);
    // キーボード操作で :focus-visible にする（最初のボタンへ移動）
    await userEvent.keyboard('{Tab}');
    await expect.element(page.getByRole('button', { name: '保存する' })).toHaveFocus();
    await expect.element(page.getByTestId('gallery')).toMatchScreenshot(`gallery-${theme}-focus`);
  });
});
