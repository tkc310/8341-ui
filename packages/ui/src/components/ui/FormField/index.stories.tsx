import { Form } from '@base-ui/react/form';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '@/components/ui/Button/index';
import { Checkbox } from '@/components/ui/Checkbox/index';
import { NotificationBanner } from '@/components/ui/NotificationBanner/index';
import { Radio, RadioGroup } from '@/components/ui/RadioGroup/index';
import { Select } from '@/components/ui/Select/index';
import { Stack } from '@/components/ui/Stack/index';
import { TextField } from '@/components/ui/TextField/index';
import { Textarea } from '@/components/ui/Textarea/index';
import { FormField } from './index';

const meta = {
  title: 'Components/Form',
  component: FormField,
  parameters: {
    docs: {
      description: {
        component:
          '入力部品は FormField（Base UI の Field）で包むと、ラベル・補足・エラーが自動で関連付く。必須は「必須」と文字で示し、エラーは「何が誤りで、どう直すか」を書く。',
      },
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

const prefectures = ['北海道', '青森県', '岩手県', '宮城県', '東京都', '大阪府', '沖縄県'].map((p) => ({
  value: p,
  label: p,
}));

export const TextFieldStates: Story = {
  args: { label: '', children: null },
  render: () => (
    <Stack className="max-w-prose">
      <FormField label="氏名" required supportText="戸籍上の氏名を入力してください">
        <TextField autoComplete="name" />
      </FormField>
      <FormField label="メールアドレス" required error="メールアドレスに「@」が含まれていません。例: taro@example.jp">
        <TextField type="email" autoComplete="email" defaultValue="taro.example.jp" />
      </FormField>
      <FormField label="会員番号" supportText="変更できません">
        <TextField readOnly defaultValue="A-0012345" />
      </FormField>
      <FormField label="郵便番号" disabled>
        <TextField inputMode="numeric" autoComplete="postal-code" />
      </FormField>
    </Stack>
  ),
};

export const Sizes: Story = {
  args: { label: '', children: null },
  render: () => (
    <Stack className="max-w-prose">
      <FormField label="小（36px）">
        <TextField size="sm" />
      </FormField>
      <FormField label="標準（44px）">
        <TextField size="md" />
      </FormField>
      <FormField label="大（52px）">
        <TextField size="lg" />
      </FormField>
    </Stack>
  ),
};

export const TextareaWithCounter: Story = {
  args: { label: '', children: null },
  render: () => (
    <div className="max-w-prose">
      <FormField label="お問い合わせ内容" showOptional>
        <Textarea countLimit={200} placeholder="例: 申請状況を確認したい" />
      </FormField>
    </div>
  ),
};

export const SelectBox: Story = {
  args: { label: '', children: null },
  render: () => (
    <div className="max-w-prose">
      <FormField label="都道府県" required>
        <Select options={prefectures} placeholder="選択してください" name="prefecture" />
      </FormField>
    </div>
  ),
};

/** 親子のチェックボックス（「すべて」が中間状態を持つ）。フックを使うため名前付きのコンポーネントにする */
function NotificationChannels() {
  const [items, setItems] = useState({ mail: true, sms: false });
  const all = items.mail && items.sms;
  const some = items.mail || items.sms;
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="font-bold">通知の受け取り方法</legend>
      <Checkbox
        label="すべて"
        checked={all}
        indeterminate={some && !all}
        onCheckedChange={(checked) => setItems({ mail: checked, sms: checked })}
      />
      <div className="ps-stack-md">
        <Checkbox
          label="メール"
          description="登録済みのアドレスに送ります"
          checked={items.mail}
          onCheckedChange={(checked) => setItems({ ...items, mail: checked })}
        />
        <Checkbox label="SMS" checked={items.sms} onCheckedChange={(checked) => setItems({ ...items, sms: checked })} />
      </div>
      <Checkbox label="受け取らない（選択できません）" disabled />
    </fieldset>
  );
}

export const Checkboxes: Story = {
  args: { label: '', children: null },
  render: () => <NotificationChannels />,
};

export const Radios: Story = {
  args: { label: '', children: null },
  render: () => (
    <Stack>
      <RadioGroup legend="受け取り方法" required defaultValue="post" supportText="後から変更できます">
        <Radio value="post" label="郵送" description="5〜7 日でお届けします" />
        <Radio value="counter" label="窓口で受け取る" />
        <Radio value="online" label="オンライン（PDF）" />
      </RadioGroup>
      <RadioGroup legend="同意しますか" orientation="horizontal" error="いずれかを選択してください">
        <Radio value="yes" label="はい" />
        <Radio value="no" label="いいえ" />
      </RadioGroup>
    </Stack>
  ),
};

function ValidationForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <Form className="max-w-prose" onFormSubmit={() => setSubmitted(true)}>
      <Stack>
        {submitted && <NotificationBanner tone="success" title="送信しました" live />}
        <FormField label="氏名" required name="name">
          <TextField autoComplete="name" />
        </FormField>
        <Button type="submit">送信する</Button>
      </Stack>
    </Form>
  );
}

/**
 * 送信時の検証パターン。Base UI の Form が送信時に各 Field を検証し、
 * 誤りのある項目に aria-invalid とエラー文（Field.Error）を付けて、最初の誤りへフォーカスを移す（WCAG 3.3.1）。
 * 複数の誤りを上部に一覧で出す ErrorSummary はバックログにある。
 */
export const ValidationPattern: Story = {
  args: { label: '', children: null },
  render: () => <ValidationForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '送信する' }));
    const input = canvas.getByRole('textbox', { name: /氏名/ });
    await expect(input).toHaveFocus();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  },
};
