import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion/Accordion';
import { Breadcrumb } from './Breadcrumb/Breadcrumb';
import { Card } from './Card/Card';
import { Divider } from './Divider/Divider';
import { Icon, iconNames } from './Icon/Icon';
import { Stack } from './Stack/Stack';
import { Text } from './Text/Text';

const meta = {
  title: 'Components/Content',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = {
  render: () => (
    <ul
      style={{
        display: 'grid',
        gap: 'var(--dsm-space-gutter)',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        padding: 0,
        margin: 0,
      }}
    >
      <Card as="li" eyebrow="手続き" title="引っ越しの手続き" href="#moving">
        <Text tone="subtle">転入・転出の届出、必要な書類をまとめています。</Text>
      </Card>
      <Card as="li" eyebrow="手続き" title="子育て支援の申請" href="#child">
        <Text tone="subtle">児童手当や保育園の申し込み方法。</Text>
      </Card>
      <Card as="li" variant="filled" title="リンクしないカード" footer={<Text variant="body-sm">2026 年 10 月 1 日更新</Text>}>
        <Text tone="subtle">情報をまとめて見せるだけのカード。</Text>
      </Card>
    </ul>
  ),
};

export const BreadcrumbNav: Story = {
  render: () => (
    <Breadcrumb
      items={[{ label: 'ホーム', href: '#' }, { label: '手続き', href: '#' }, { label: '引っ越しの手続き' }]}
    />
  ),
};

export const Accordions: Story = {
  render: () => (
    <div>
      <Accordion summary="申請に必要なものは何ですか？" name="faq" headingLevel={3}>
        <Text>本人確認書類と、印鑑（署名の場合は不要）が必要です。</Text>
      </Accordion>
      <Accordion summary="代理人でも申請できますか？" name="faq" headingLevel={3}>
        <Text>委任状があれば可能です。</Text>
      </Accordion>
      <Accordion summary="手数料はかかりますか？" name="faq" headingLevel={3}>
        <Text>かかりません。</Text>
      </Accordion>
    </div>
  ),
};

export const Dividers: Story = {
  render: () => (
    <Stack>
      <Text>装飾の区切り（subtle）</Text>
      <Divider />
      <Text>意味のある区切り（default）</Text>
      <Divider tone="default" />
    </Stack>
  ),
};

export const Icons: Story = {
  render: () => (
    <Stack direction="horizontal" wrap>
      {iconNames.map((name) => (
        <Stack key={name} gap="sm" align="center" style={{ width: 96 }}>
          <Icon name={name} size="lg" />
          <Text as="span" variant="mono-sm">
            {name}
          </Text>
        </Stack>
      ))}
    </Stack>
  ),
};
