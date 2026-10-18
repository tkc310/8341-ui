import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import './Tag.css';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'key' | 'success' | 'warning' | 'danger';
  /** 先頭アイコン。色だけで意味を伝えないよう、状態を表すタグには付けることを推奨 */
  icon?: ReactNode;
}

/** 状態やカテゴリを示すラベル。操作はできない（操作できるなら Button を使う） */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { tone = 'neutral', icon, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx('dsm-tag', className)} data-tone={tone} {...rest}>
      {icon}
      {children}
    </span>
  );
});
