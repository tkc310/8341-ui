import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vite-plus/test';
import { Button, buttonVariants } from './index';

describe('Button', () => {
  it('ボタンの見た目をリンクに当てても、押した見た目が出る（:enabled は a に当たらない）', () => {
    render(
      <a href="/apply" className={buttonVariants({ variant: 'primary' }).root()}>
        申請を始める
      </a>,
    );
    const link = screen.getByRole('link', { name: '申請を始める' });
    expect(link).toHaveClass('not-disabled:active:bg-key-active');
    expect(link.className).not.toMatch(/(?<![\w-])enabled:/);
  });

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
