import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { Link } from './index';

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

  it('押している間は、タッチでも見える色と下線の太さに変わる', () => {
    render(<Link href="/words">単語帳</Link>);
    const link = screen.getByRole('link', { name: '単語帳' });
    expect(link).toHaveClass(
      'active:text-fg-link-active',
      'active:decoration-(length:--8341-border-width-underline-hover)',
    );
  });
});
