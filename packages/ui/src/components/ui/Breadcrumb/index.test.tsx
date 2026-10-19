import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { expectNoA11yViolations } from '@/test/a11y';
import { Breadcrumb } from './index';

describe('Breadcrumb', () => {
  it('現在地に aria-current="page" を付ける', async () => {
    const { container } = render(<Breadcrumb items={[{ label: 'ホーム', href: '/' }, { label: '手続き' }]} />);
    expect(screen.getByRole('navigation', { name: 'パンくずリスト' })).toBeInTheDocument();
    expect(screen.getByText('手続き')).toHaveAttribute('aria-current', 'page');
    await expectNoA11yViolations(container);
  });
});
