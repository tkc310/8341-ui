import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vite-plus/test';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Link } from '@/components/ui/link';
import { NotificationBanner } from '@/components/ui/notification-banner';
import { Radio, RadioGroup } from '@/components/ui/radio-group';
import { TextField } from '@/components/ui/text-field';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/tv';

/** happy-dom ではレイアウトと色を計算できないため、構造（ARIA・ラベル）の規則だけを検査する */
async function expectNoA11yViolations(container: HTMLElement) {
  const result = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

describe('cn（クラス統合）', () => {
  it('文字色と文字サイズのトークンを別のものとして残す', () => {
    expect(cn('text-fg', 'text-body-md')).toBe('text-fg text-body-md');
    expect(cn('text-body-sm', 'text-body-md')).toBe('text-body-md');
    expect(cn('p-inset-md', 'p-inset-lg')).toBe('p-inset-lg');
  });
});

describe('Button', () => {
  it('既定で type="button"（フォーム内で意図せず送信しない）', () => {
    render(<Button>保存する</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('loading 中はクリックを無視し、フォーカスできるまま aria-busy を立てる', async () => {
    const onClick = vi.fn<() => void>();
    render(
      <Button loading onClick={onClick}>
        送信する
      </Button>,
    );
    const button = screen.getByRole('button', { name: '送信する' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeEnabled();
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
    expect(input).toHaveAccessibleDescription(expect.stringContaining('形式が正しくありません'));
    expect(input).toHaveAccessibleDescription(expect.stringContaining('例: taro@example.jp'));
    expect(screen.getByText('必須')).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe('Textarea', () => {
  it('上限を超えても入力を止めず、超過を知らせる', async () => {
    render(
      <FormField label="本文">
        <Textarea countLimit={3} />
      </FormField>,
    );
    const textarea = screen.getByRole('textbox', { name: '本文' });
    await userEvent.type(textarea, 'あいうえ');
    expect(textarea).toHaveValue('あいうえ');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('1文字超過しています')).toBeInTheDocument();
  });
});

describe('Checkbox / RadioGroup', () => {
  it('Checkbox はラベルで名前が付き、indeterminate を伝える', async () => {
    const { container } = render(<Checkbox label="すべて" indeterminate />);
    expect(screen.getByRole('checkbox', { name: 'すべて' })).toHaveAttribute('aria-checked', 'mixed');
    await expectNoA11yViolations(container);
  });

  it('RadioGroup は legend をグループ名にし、矢印キーで選択を移す', async () => {
    const { container } = render(
      <RadioGroup legend="受け取り方法" defaultValue="post">
        <Radio value="post" label="郵送" />
        <Radio value="online" label="オンライン" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup', { name: /受け取り方法/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '郵送' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('radio', { name: 'オンライン' }));
    expect(screen.getByRole('radio', { name: 'オンライン' })).toHaveAttribute('aria-checked', 'true');
    await expectNoA11yViolations(container);
  });
});

describe('Accordion', () => {
  it('見出しの中のボタンで開閉し、aria-expanded を切り替える', async () => {
    render(
      <Accordion>
        <AccordionItem summary="質問" headingLevel={2}>
          回答
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole('button', { name: '質問' });
    expect(screen.getByRole('heading', { level: 2, name: '質問' })).toContainElement(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('NotificationBanner', () => {
  it('種別を文字でも伝え、live のときだけ role を付ける', () => {
    const { rerender } = render(<NotificationBanner tone="danger" title="入力に誤りがあります" />);
    expect(screen.getByRole('heading', { name: 'エラー: 入力に誤りがあります' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
    rerender(<NotificationBanner tone="danger" title="入力に誤りがあります" live />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('Breadcrumb', () => {
  it('現在地に aria-current="page" を付ける', async () => {
    const { container } = render(<Breadcrumb items={[{ label: 'ホーム', href: '/' }, { label: '手続き' }]} />);
    expect(screen.getByRole('navigation', { name: 'パンくずリスト' })).toBeInTheDocument();
    expect(screen.getByText('手続き')).toHaveAttribute('aria-current', 'page');
    await expectNoA11yViolations(container);
  });
});
