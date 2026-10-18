import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/icon';
import { linkVariants } from '@/components/ui/link';
import { cn } from '@/lib/tv';

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

/** パンくずリスト。現在地に aria-current="page" を付ける。 */
export function Breadcrumb({ items, label = 'パンくずリスト', className }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-gap-sm gap-y-gap-xs p-0 text-body-sm">
        {items.map((item, i) => {
          const current = i === items.length - 1;
          return (
            // oxlint-disable-next-line react/no-array-index-key -- 順序が意味を持つ静的なリスト
            <li key={i} className="inline-flex items-center gap-gap-sm">
              {current || !item.href ? (
                <span aria-current={current ? 'page' : undefined} className={cn(current && 'text-fg')}>
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className={linkVariants()}>
                  {item.label}
                </a>
              )}
              {!current && <Icon name="chevron-right" size="sm" className="text-icon-subtle" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
