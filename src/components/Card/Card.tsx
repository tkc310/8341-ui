import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon/Icon';
import './Card.css';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: 'article' | 'section' | 'div' | 'li';
  title?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  /** タイトル上の小さな補足（カテゴリ・日付など） */
  eyebrow?: ReactNode;
  /** 画像などのメディア。装飾なら alt="" にすること */
  media?: ReactNode;
  footer?: ReactNode;
  /**
   * カード全体をリンクにする場合の遷移先。
   * a 要素はタイトルにだけ置き、::after でカード全体に広げる（読み上げが冗長にならない）。
   */
  href?: string;
  variant?: 'outlined' | 'filled';
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as: Tag = 'article', title, headingLevel = 3, eyebrow, media, footer, href, variant = 'outlined', className, children, ...rest },
  ref,
) {
  const H = `h${headingLevel}` as const;
  return (
    <Tag
      // biome-ignore lint/suspicious/noExplicitAny: 要素の種類が可変のため
      ref={ref as any}
      className={cx('tkc-card', className)}
      data-variant={variant}
      data-interactive={href ? '' : undefined}
      {...rest}
    >
      {media && <div className="tkc-card__media">{media}</div>}
      <div className="tkc-card__body">
        {eyebrow && <p className="tkc-card__eyebrow">{eyebrow}</p>}
        {title && (
          <H className="tkc-card__title">
            {href ? (
              <a href={href} className="tkc-card__link tkc-focusable">
                {title}
              </a>
            ) : (
              title
            )}
          </H>
        )}
        {children && <div className="tkc-card__content">{children}</div>}
      </div>
      {(footer || href) && (
        <div className="tkc-card__footer">
          {footer}
          {href && <Icon name="arrow-right" className="tkc-card__arrow" />}
        </div>
      )}
    </Tag>
  );
});
