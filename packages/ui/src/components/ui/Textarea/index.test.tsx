import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vite-plus/test';
import { FormField } from '@/components/ui/FormField/index';
import { Textarea } from './index';

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
