import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import './Heading.css';

type Level = 1 | 2 | 3 | 4 | 5 | 6;
type Size = 'display-lg' | 'display-md' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs';

/** 見た目の既定サイズ。文書構造（level）と見た目（size）は分離できる */
const defaultSize: Record<Level, Size> = { 1: 'xl', 2: 'lg', 3: 'md', 4: 'sm', 5: 'xs', 6: 'xxs' };

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** 文書構造上のレベル。見出しレベルを飛ばさないこと */
  level: Level;
  /** 見た目のサイズ。未指定なら level から決まる */
  size?: Size;
  /**
   * - bar: 左にキーカラーの縦線
   * - rule: 下線で区切る
   */
  decoration?: 'none' | 'bar' | 'rule';
  /** 見出しの前置き（セクション番号など）。見出しの一部として読み上げられる */
  shoulder?: ReactNode;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level, size, decoration = 'none', shoulder, className, children, ...rest },
  ref,
) {
  const Tag = `h${level}` as const;
  const s = size ?? defaultSize[level];
  return (
    <Tag
      ref={ref}
      className={cx('dsm-heading', `dsm-text-${s.startsWith('display') ? s : `heading-${s}`}`, className)}
      data-decoration={decoration === 'none' ? undefined : decoration}
      {...rest}
    >
      {shoulder && <span className="dsm-heading__shoulder">{shoulder}</span>}
      <span className="dsm-heading__text">{children}</span>
    </Tag>
  );
});
