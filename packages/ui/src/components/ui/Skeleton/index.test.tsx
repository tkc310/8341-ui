import { render } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { Skeleton } from './index';

describe('Skeleton', () => {
  it('読み上げには出さず、指定した寸法で描く', () => {
    const { container } = render(<Skeleton width="40%" height="2em" radius="full" />);
    const box = container.firstElementChild as HTMLElement;
    expect(box).toHaveAttribute('aria-hidden', 'true');
    expect(box.style.width).toBe('40%');
    expect(box.style.height).toBe('2em');
    expect(box).toHaveClass('rounded-full');
  });
});
