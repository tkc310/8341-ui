import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vite-plus/test';
import { expectNoA11yViolations } from '@/test/a11y';
import { Radio, RadioGroup } from './index';

describe('RadioGroup', () => {
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
