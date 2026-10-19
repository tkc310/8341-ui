import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { TextField } from '@/components/ui/TextField/index';
import { expectNoA11yViolations } from '@/test/a11y';
import { FormField } from './index';

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
