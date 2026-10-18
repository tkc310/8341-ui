import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from './Button/Button';
import { Checkbox } from './Checkbox/Checkbox';
import { FormField } from './FormField/FormField';
import { Radio, RadioGroup } from './Radio/RadioGroup';
import { Select } from './Select/Select';
import { Stack } from './Stack/Stack';
import { TextField } from './TextField/TextField';
import { Textarea } from './Textarea/Textarea';

const meta = {
  title: 'Components/Form',
  parameters: {
    docs: {
      description: {
        component:
          '入力部品は FormField で包むと、ラベル・補足・エラーが id で自動的に関連付く。必須は「必須」と文字で示し、エラーは「何が誤りで、どう直すか」を書く。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextFieldStates: Story = {
  render: () => (
    <Stack style={{ maxWidth: 480 }}>
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
  render: () => (
    <Stack style={{ maxWidth: 480 }}>
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
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <FormField label="お問い合わせ内容" showOptional>
        <Textarea countLimit={200} placeholder="例: 申請状況を確認したい" />
      </FormField>
    </div>
  ),
};

export const SelectBox: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <FormField label="都道府県" required>
        <Select placeholder="選択してください" autoComplete="address-level1">
          <option>北海道</option>
          <option>東京都</option>
          <option>大阪府</option>
          <option>沖縄県</option>
        </Select>
      </FormField>
    </div>
  ),
};

export const Checkboxes: Story = {
  render: () => {
    const [items, setItems] = useState({ mail: true, sms: false });
    const all = items.mail && items.sms;
    const some = items.mail || items.sms;
    return (
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ fontWeight: 700 }}>通知の受け取り方法</legend>
        <Checkbox
          label="すべて"
          checked={all}
          indeterminate={some && !all}
          onChange={(e) => setItems({ mail: e.target.checked, sms: e.target.checked })}
        />
        <div style={{ paddingInlineStart: 32 }}>
          <Checkbox
            label="メール"
            description="登録済みのアドレスに送ります"
            checked={items.mail}
            onChange={(e) => setItems({ ...items, mail: e.target.checked })}
          />
          <Checkbox label="SMS" checked={items.sms} onChange={(e) => setItems({ ...items, sms: e.target.checked })} />
        </div>
        <Checkbox label="受け取らない（選択できません）" disabled />
      </fieldset>
    );
  },
};

export const Radios: Story = {
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

/** 送信時にエラーを出し、最初のエラー項目へフォーカスを移すパターン */
export const ValidationPattern: Story = {
  render: () => {
    const [error, setError] = useState<string>();
    return (
      <form
        noValidate
        style={{ maxWidth: 480 }}
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem('name') as HTMLInputElement;
          if (!input.value) {
            setError('氏名を入力してください');
            input.focus();
          } else setError(undefined);
        }}
      >
        <Stack>
          <FormField label="氏名" required error={error}>
            <TextField name="name" autoComplete="name" />
          </FormField>
          <Button type="submit">送信する</Button>
        </Stack>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '送信する' }));
    const input = canvas.getByRole('textbox', { name: /氏名/ });
    await expect(input).toHaveFocus();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('氏名を入力してください');
  },
};
