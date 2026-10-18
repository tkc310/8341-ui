import type { ElementType, HTMLAttributes } from 'react';
import { type VariantProps, tv } from '@/lib/tv';

/**
 * 子要素の間隔だけを管理するレイアウト部品。余白は 3 段階のみ（space.stack-*）。
 * - sm 8px: 密接に関係する要素 / md 24px: 同じグループの要素 / lg 64px: セクション間
 */
export const stackVariants = tv({
  base: 'm-0 flex min-w-0 list-none border-0 p-0',
  variants: {
    direction: { vertical: 'flex-col', horizontal: 'flex-row items-center' },
    gap: { sm: 'gap-stack-sm', md: 'gap-stack-md', lg: 'gap-stack-lg' },
    align: { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' },
    wrap: { true: 'flex-wrap' },
  },
  compoundVariants: [{ direction: 'horizontal', gap: 'md', class: 'gap-gap-md' }],
  defaultVariants: { direction: 'vertical', gap: 'md' },
});

export interface StackProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof stackVariants> {
  as?: 'div' | 'section' | 'ul' | 'ol' | 'form' | 'fieldset';
}

export function Stack({ as = 'div', direction, gap, align, wrap, className, ...rest }: StackProps) {
  const Tag = as as ElementType;
  return <Tag className={stackVariants({ direction, gap, align, wrap, className })} {...rest} />;
}
