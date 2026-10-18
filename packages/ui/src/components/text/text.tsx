import type { ElementType, HTMLAttributes } from 'react';
import { type VariantProps, tv } from '@/lib/tv';

export const textVariants = tv({
  base: 'm-0',
  variants: {
    variant: {
      'body-lg': 'text-body-lg',
      'body-md': 'text-body-md',
      'body-sm': 'text-body-sm',
      'dense-md': 'text-dense-md',
      'dense-sm': 'text-dense-sm',
      'mono-md': 'font-mono text-mono-md',
      'mono-sm': 'font-mono text-mono-sm',
    },
    tone: {
      default: 'text-fg',
      subtle: 'text-fg-subtle',
      key: 'text-fg-key',
      danger: 'text-fg-danger',
      success: 'text-fg-success',
      warning: 'text-fg-warning',
    },
    weight: { regular: 'font-regular', bold: 'font-bold' },
  },
  defaultVariants: { variant: 'body-md', tone: 'default' },
});

export interface TextProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'small' | 'strong' | 'em' | 'code';
}

export function Text({ as = 'p', variant, tone, weight, className, ...rest }: TextProps) {
  const Tag = as as ElementType;
  return <Tag className={textVariants({ variant, tone, weight, className })} {...rest} />;
}
