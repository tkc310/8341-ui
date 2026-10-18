import { type AnchorHTMLAttributes, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon/Icon';
import './Link.css';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * 外部サイトへのリンク。末尾にアイコンを付け、新しいタブで開く場合は読み上げ用の補足を加える。
   * 未指定時は target="_blank" なら自動で true。
   */
  external?: boolean;
  /** 新しいタブで開くときに読み上げる補足 */
  newTabLabel?: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { external, newTabLabel = '（新しいタブで開きます）', target, rel, className, children, ...rest },
  ref,
) {
  const opensNewTab = target === '_blank';
  const isExternal = external ?? opensNewTab;
  return (
    <a
      ref={ref}
      className={cx('tkc-link', 'tkc-focusable', className)}
      target={target}
      rel={opensNewTab ? cx(rel, 'noopener', 'noreferrer') : rel}
      {...rest}
    >
      {children}
      {isExternal && <Icon name="external" size="sm" className="tkc-link__icon" />}
      {opensNewTab && <span className="tkc-visually-hidden">{newTabLabel}</span>}
    </a>
  );
});
