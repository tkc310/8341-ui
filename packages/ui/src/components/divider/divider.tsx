import { Separator } from '@base-ui/react/separator';
import type { ComponentProps } from 'react';
import { type VariantProps, tv } from '@/lib/tv';

export const dividerVariants = tv({
  base: 'm-0 shrink-0 border-0',
  variants: {
    /** subtle は装飾。意味のある区切り（内容の切れ目）には default を使う */
    tone: { subtle: 'bg-border-subtle', default: 'bg-border' },
    orientation: { horizontal: 'h-px w-full', vertical: 'w-px self-stretch' },
  },
  defaultVariants: { tone: 'subtle', orientation: 'horizontal' },
});

export interface DividerProps
  extends Omit<ComponentProps<typeof Separator>, 'className'>,
    VariantProps<typeof dividerVariants> {
  className?: string;
}

export function Divider({ tone, orientation = 'horizontal', className, ...rest }: DividerProps) {
  return <Separator orientation={orientation} className={dividerVariants({ tone, orientation, className })} {...rest} />;
}
