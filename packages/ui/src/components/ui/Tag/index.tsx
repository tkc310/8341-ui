import type { HTMLAttributes, ReactNode } from 'react';
import { type VariantProps, tv } from '@/lib/tv';

export const tagVariants = tv({
  base: 'inline-flex items-center gap-gap-xs whitespace-nowrap rounded-xs border px-inset-sm py-inset-xs text-label-sm [&_svg]:size-icon-sm',
  variants: {
    tone: {
      neutral: 'border-border bg-subtle text-fg',
      key: 'border-border-key bg-info-subtle text-fg-key',
      success: 'border-border-success bg-success-subtle text-fg-success',
      warning: 'border-border-warning bg-warning-subtle text-fg-warning',
      danger: 'border-border-danger bg-danger-subtle text-fg-danger',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export interface TagProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  /** 先頭アイコン。状態を表すタグには、色だけで意味を伝えないよう付けることを推奨 */
  icon?: ReactNode;
}

/** 状態やカテゴリを示すラベル。操作はできない（操作できるなら Button を使う） */
export function Tag({ tone, icon, className, children, ...rest }: TagProps) {
  return (
    <span className={tagVariants({ tone, className })} {...rest}>
      {icon}
      {children}
    </span>
  );
}
