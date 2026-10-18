import { type ElementType, type HTMLAttributes, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import './Stack.css';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'ul' | 'ol' | 'form' | 'fieldset';
  /**
   * 余白は 3 段階のみ（space.stack-*）。
   * - sm 8px: 密接に関係する要素
   * - md 24px: 同じグループの要素
   * - lg 64px: セクション間
   */
  gap?: 'sm' | 'md' | 'lg';
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
}

/** 子要素の間隔だけを管理するレイアウト部品。マージンの相殺や付け忘れを防ぐ */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { as = 'div', gap = 'md', direction = 'vertical', align, wrap, className, ...rest },
  ref,
) {
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={cx('dsm-stack', className)}
      data-gap={gap}
      data-direction={direction}
      data-align={align}
      data-wrap={wrap || undefined}
      {...rest}
    />
  );
});
