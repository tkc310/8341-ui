import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vite-plus/test';
import { Button } from './index';

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
