import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { expectNoA11yViolations } from '@/test/a11y';
import { Checkbox } from './index';

describe('Checkbox', () => {
  it('Checkbox はラベルで名前が付き、indeterminate を伝える', async () => {
    const { container } = render(<Checkbox label="すべて" indeterminate />);
    expect(screen.getByRole('checkbox', { name: 'すべて' })).toHaveAttribute('aria-checked', 'mixed');
    await expectNoA11yViolations(container);
  });
});
