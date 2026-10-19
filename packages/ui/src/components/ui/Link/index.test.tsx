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
});
