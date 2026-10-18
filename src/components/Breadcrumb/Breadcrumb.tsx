import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon/Icon';
import '../Link/Link.css';
import './Breadcrumb.css';

export interface BreadcrumbItem {
  label: ReactNode;
  /** 現在のページ（最後の項目）は href を省略する */
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** 同じページに複数の nav がある場合に区別するためのラベル */
  label?: string;
  className?: string;
}

export function Breadcrumb({ items, label = 'パンくずリスト', className }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={cx('dsm-breadcrumb', className)}>
      <ol className="dsm-breadcrumb__list">
        {items.map((item, i) => {
          const current = i === items.length - 1;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: 順序が意味を持つ静的リスト
            <li key={i} className="dsm-breadcrumb__item">
              {current || !item.href ? (
                <span aria-current={current ? 'page' : undefined}>{item.label}</span>
              ) : (
                <a href={item.href} className="dsm-link dsm-focusable">
                  {item.label}
                </a>
              )}
              {!current && <Icon name="chevron-right" size="sm" className="dsm-breadcrumb__separator" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
