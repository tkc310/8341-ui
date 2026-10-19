import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon/index';
import { focusRingWithin } from '@/lib/focus';
import { type VariantProps, tv } from '@/lib/tv';

export const cardVariants = tv({
  slots: {
    root: 'group/card relative flex list-none flex-col overflow-hidden rounded-xl border text-fg',
    media:
      '[&>img,&>picture,&>video]:block [&>img,&>picture,&>video]:aspect-video [&>img,&>picture,&>video]:w-full [&>img,&>picture,&>video]:object-cover',
    body: 'flex flex-1 flex-col gap-stack-sm p-inset-xl',
    eyebrow: 'm-0 text-body-sm text-fg-subtle',
    title: 'm-0 text-heading-xs',
    link: 'text-fg-link underline decoration-1 underline-offset-[0.2em] outline-none after:absolute after:inset-0 after:content-[""] group-hover/card:decoration-(length:--8341-border-width-underline-hover)', // allow-outline-none: フォーカスはカード全体に focus-ring-within で描く
    content: '[&>p]:m-0',
    footer: 'flex items-center justify-between gap-gap-sm px-inset-xl pb-inset-xl text-fg-subtle',
    arrow: 'ms-auto text-icon-key transition-transform group-hover/card:translate-x-gap-xs',
  },
  variants: {
    variant: {
      outlined: { root: 'border-border bg-surface' },
      filled: { root: 'border-transparent bg-subtle' },
    },
    interactive: {
      true: { root: [focusRingWithin, 'hover:border-border-key hover:shadow-1'] },
    },
  },
  defaultVariants: { variant: 'outlined' },
});

export interface CardProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'>, Pick<VariantProps<typeof cardVariants>, 'variant'> {
  as?: 'article' | 'section' | 'div' | 'li';
  title?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  /** タイトル上の小さな補足（カテゴリ・日付など） */
  eyebrow?: ReactNode;
  /** 画像などのメディア。装飾なら alt="" にする */
  media?: ReactNode;
  footer?: ReactNode;
  /**
   * カード全体をリンクにする場合の遷移先。
   * a 要素はタイトルにだけ置き、::after でカード全体に広げる（読み上げが冗長にならない）。
   */
  href?: string;
}

/**
 * 情報のまとまりを示すカード。表の行の代わりに並べない（design-principles: 同じ角丸と影のカードを敷き詰めない）。
 */
export function Card({
  as: Tag = 'article',
  title,
  headingLevel = 3,
  eyebrow,
  media,
  footer,
  href,
  variant,
  className,
  children,
  ...rest
}: CardProps) {
  const H = `h${headingLevel}` as const;
  const s = cardVariants({ variant, interactive: Boolean(href) });
  return (
    <Tag className={s.root({ className })} {...rest}>
      {media && <div className={s.media()}>{media}</div>}
      <div className={s.body()}>
        {eyebrow && <p className={s.eyebrow()}>{eyebrow}</p>}
        {title && (
          <H className={s.title()}>
            {href ? (
              <a href={href} className={s.link()}>
                {title}
              </a>
            ) : (
              title
            )}
          </H>
        )}
        {children && <div className={s.content()}>{children}</div>}
      </div>
      {(footer || href) && (
        <div className={s.footer()}>
          {footer}
          {href && <Icon name="arrow-right" className={s.arrow()} />}
        </div>
      )}
    </Tag>
  );
}
