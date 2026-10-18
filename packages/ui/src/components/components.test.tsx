import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from './Breadcrumb/Breadcrumb';
import { Button } from './Button/Button';
import { Checkbox } from './Checkbox/Checkbox';
import { FormField } from './FormField/FormField';
import { Link } from './Link/Link';
import { NotificationBanner } from './NotificationBanner/NotificationBanner';
import { Radio, RadioGroup } from './Radio/RadioGroup';
import { Select } from './Select/Select';
import { TextField } from './TextField/TextField';
import { Textarea } from './Textarea/Textarea';

/** jsdom ではレイアウト・色を計算できないため、構造（ARIA・ラベル）のルールに限定して検査する */
async function expectNoA11yViolations(container: HTMLElement) {
  const result = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

describe('Button', () => {
  it('既定で type="button"（フォーム内で意図せず送信しない）', () => {
    render(<Button>保存する</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('loading 中はクリックを無視し、フォーカス可能なまま aria-busy を立てる', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        送信する
      </Button>,
    );
    const button = screen.getByRole('button', { name: '送信する' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).not.toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Link', () => {
  it('新しいタブで開く場合は rel と読み上げ用の補足を付ける', () => {
    render(
      <Link href="https://example.com" target="_blank">
        外部サイト
      </Link>,
    );
    const link = screen.getByRole('link', { name: /外部サイト\s?（新しいタブで開きます）/ });
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
});

describe('FormField', () => {
  it('ラベル・補足・エラーを入力欄に関連付ける', async () => {
    const { container } = render(
      <FormField label="メールアドレス" required supportText="例: taro@example.jp" error="形式が正しくありません">
        <TextField type="email" />
      </FormField>,
    );
    const input = screen.getByRole('textbox', { name: /メールアドレス/ });
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('形式が正しくありません 例: taro@example.jp');
    await expectNoA11yViolations(container);
  });

  it('Select / Textarea もコンテキストを受け取る', () => {
    render(
      <>
        <FormField label="都道府県">
          <Select placeholder="選択してください">
            <option>東京都</option>
          </Select>
        </FormField>
        <FormField label="内容" error="入力してください">
          <Textarea />
        </FormField>
      </>,
    );
    expect(screen.getByRole('combobox', { name: '都道府県' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '内容' })).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Textarea', () => {
  it('上限を超えても入力を止めず、超過を知らせる', async () => {
    render(<Textarea aria-label="本文" countLimit={3} />);
    const textarea = screen.getByRole('textbox', { name: '本文' });
    await userEvent.type(textarea, 'あいうえ');
    expect(textarea).toHaveValue('あいうえ');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('1文字超過しています')).toBeInTheDocument();
  });
});

describe('Choice', () => {
  it('Checkbox の indeterminate を DOM に反映する', () => {
    render(<Checkbox label="すべて" indeterminate />);
    expect(screen.getByRole('checkbox', { name: 'すべて' })).toBePartiallyChecked();
  });

  it('RadioGroup は fieldset と legend でグループ化する', async () => {
    const { container } = render(
      <RadioGroup legend="受け取り方法" defaultValue="post">
        <Radio value="post" label="郵送" />
        <Radio value="online" label="オンライン" />
      </RadioGroup>,
    );
    expect(screen.getByRole('group', { name: '受け取り方法' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '郵送' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'オンライン' }));
    expect(screen.getByRole('radio', { name: 'オンライン' })).toBeChecked();
    await expectNoA11yViolations(container);
  });
});

describe('NotificationBanner', () => {
  it('種別を文字でも伝える', () => {
    render(<NotificationBanner tone="danger" title="入力に誤りがあります" />);
    expect(screen.getByRole('heading', { name: 'エラー: 入力に誤りがあります' })).toBeInTheDocument();
  });

  it('live のときだけ role を付ける', () => {
    const { rerender } = render(<NotificationBanner tone="success" title="完了" />);
    expect(screen.queryByRole('status')).toBeNull();
    rerender(<NotificationBanner tone="success" title="完了" live />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('Breadcrumb', () => {
  it('現在地に aria-current="page" を付ける', async () => {
    const { container } = render(
      <Breadcrumb items={[{ label: 'ホーム', href: '/' }, { label: '手続き' }]} />,
    );
    expect(screen.getByRole('navigation', { name: 'パンくずリスト' })).toBeInTheDocument();
    expect(screen.getByText('手続き')).toHaveAttribute('aria-current', 'page');
    await expectNoA11yViolations(container);
  });
});
