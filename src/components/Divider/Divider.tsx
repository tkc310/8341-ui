import { type HTMLAttributes, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import './Divider.css';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** subtle は装飾。意味のある区切り（内容の切れ目）には default を使う */
  tone?: 'subtle' | 'default';
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { tone = 'subtle', className, ...rest },
  ref,
) {
  return <hr ref={ref} className={cx('dsm-divider', className)} data-tone={tone} {...rest} />;
});
