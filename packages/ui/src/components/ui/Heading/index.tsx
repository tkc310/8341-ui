import type { HTMLAttributes, ReactNode } from 'react';
import { type VariantProps, tv } from '@/lib/tv';

type Level = 1 | 2 | 3 | 4 | 5 | 6;

export const headingVariants = tv({
  slots: {
    root: 'm-0 text-fg [font-feature-settings:"palt"] text-balance',
    shoulder: 'mb-gap-xs block text-body-md font-bold text-fg-subtle [font-feature-settings:normal]',
    text: 'block',
  },
  variants: {
    size: {
      'display-lg': { root: 'text-display-lg' },
      'display-md': { root: 'text-display-md' },
      xl: { root: 'text-heading-xl' },
      lg: { root: 'text-heading-lg' },
      md: { root: 'text-heading-md' },
      sm: { root: 'text-heading-sm' },
      xs: { root: 'text-heading-xs' },
      xxs: { root: 'text-heading-xxs' },
    },
    /**
     * - bar: 左にキーカラーの縦線
     * - rule: 下線で区切る
     */
    decoration: {
      none: {},
      bar: { root: 'border-s-4 border-border-key ps-inset-md forced-colors:border-[CanvasText]' },
      rule: { root: 'border-b-2 border-border-key pb-inset-sm forced-colors:border-[CanvasText]' },
    },
  },
  defaultVariants: { decoration: 'none' },
});

/** 見た目の既定サイズ。文書構造（level）と見た目（size）は分けて指定できる */
const defaultSize: Record<Level, NonNullable<VariantProps<typeof headingVariants>['size']>> = {
  1: 'xl',
  2: 'lg',
  3: 'md',
  4: 'sm',
  5: 'xs',
  6: 'xxs',
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  /** 文書構造上のレベル。見出しレベルを飛ばさないこと */
  level: Level;
  /** 見出しの前置き（セクション番号など）。見出しの一部として読み上げられる */
  shoulder?: ReactNode;
}

/** 見出し。文書構造（level）と見た目（size）を分けて指定でき、レベルは飛ばさない。 */
export function Heading({ level, size, decoration, shoulder, className, children, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  const s = headingVariants({ size: size ?? defaultSize[level], decoration });
  return (
    <Tag className={s.root({ className })} {...rest}>
      {shoulder && <span className={s.shoulder()}>{shoulder}</span>}
      <span className={s.text()}>{children}</span>
    </Tag>
  );
}
