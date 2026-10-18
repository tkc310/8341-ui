import { type ElementType, type HTMLAttributes, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import './Text.css';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'small' | 'strong' | 'em' | 'code';
  variant?: 'body-lg' | 'body-md' | 'body-sm' | 'dense-md' | 'dense-sm' | 'mono-md' | 'mono-sm';
  tone?: 'default' | 'subtle' | 'key' | 'danger' | 'success' | 'warning';
  weight?: 'regular' | 'bold';
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as = 'p', variant = 'body-md', tone = 'default', weight, className, ...rest },
  ref,
) {
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={cx('dsm-text', `dsm-text-${variant}`, className)}
      data-tone={tone === 'default' ? undefined : tone}
      data-weight={weight}
      {...rest}
    />
  );
});
