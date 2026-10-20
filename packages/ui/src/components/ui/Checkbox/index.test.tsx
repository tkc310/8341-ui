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

  it('チェックのアイコンを行ボックスに乗せず、枠の中心に置く', () => {
    const { container } = render(<Checkbox label="同意する" defaultChecked />);
    const icon = container.querySelector('svg');
    // インライン要素の中に置くと本文の行の高さを引き継ぎ、アイコンが中心から下にずれる（happy-dom では位置を測れないのでクラスで確かめる）
    expect(icon).toHaveClass('block');
    expect(icon?.parentElement).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
