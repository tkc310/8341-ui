import type { AnchorHTMLAttributes } from 'react';
import { Icon } from '@/components/ui/icon';
import { tv } from '@/lib/tv';

/**
 * リンクの 5 状態: default / visited / hover / active / focus
 * - 下線は常に表示する（色だけで判別させない）
 * - hover では下線を太くするだけで、文字の太さ・大きさは変えない（レイアウトがずれないように）
 * - focus では背景も黄色にして、文中のリンクでも見失わないようにする
 */
export const linkVariants = tv({
  base: [
    'rounded-xs text-fg-link underline decoration-1 underline-offset-[0.2em]',
    'visited:text-fg-link-visited hover:text-fg-link-hover hover:decoration-(length:--tkc-border-width-underline-hover) active:text-fg-link-active',
    // Tailwind v4 の outline-none は線種を none にするため使わず、:focus-visible で線種から指定する
    'focus-visible:bg-focus-ring focus-visible:text-focus-text focus-visible:decoration-1 focus-visible:outline-solid',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
    'forced-colors:focus-visible:bg-transparent forced-colors:focus-visible:outline-[Highlight]',
  ],
});

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 外部サイトへのリンク。末尾にアイコンを付ける。未指定なら target="_blank" のとき true */
  external?: boolean;
  /** 新しいタブで開くときに読み上げる補足 */
  newTabLabel?: string;
}

/** ページ遷移のリンク。下線は常に表示し、新しいタブで開く場合は読み上げ用の補足を付ける。 */
export function Link({
  external,
  newTabLabel = '（新しいタブで開きます）',
  target,
  rel,
  className,
  children,
  ...rest
}: LinkProps) {
  const opensNewTab = target === '_blank';
  const isExternal = external ?? opensNewTab;
  return (
    <a
      className={linkVariants({ className })}
      target={target}
      rel={opensNewTab ? [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ') : rel}
      {...rest}
    >
      {children}
      {isExternal && <Icon name="external" size="inherit" className="ms-[0.2em] align-[-0.125em]" />}
      {opensNewTab && <span className="sr-only">{newTabLabel}</span>}
    </a>
  );
}
