import { type DetailsHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon/Icon';
import './Accordion.css';

export interface AccordionProps extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, 'title'> {
  /** 開閉ボタンに表示する見出し文 */
  summary: ReactNode;
  /** 見出しとして文書構造に含める場合のレベル */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** 同じ name の Accordion は 1 つだけ開く（排他的） */
  name?: string;
  children: ReactNode;
}

/**
 * ネイティブの details / summary を使う。JS 不要で、ページ内検索でも中身が見つかる。
 */
export const Accordion = forwardRef<HTMLDetailsElement, AccordionProps>(function Accordion(
  { summary, headingLevel, className, children, ...rest },
  ref,
) {
  const label = (
    <>
      <span className="dsm-accordion__summary-text">{summary}</span>
      <Icon name="chevron-down" className="dsm-accordion__icon" />
    </>
  );
  const H = headingLevel ? (`h${headingLevel}` as const) : null;
  return (
    <details ref={ref} className={cx('dsm-accordion', className)} {...rest}>
      <summary className="dsm-accordion__summary dsm-focusable">
        {H ? <H className="dsm-accordion__heading">{label}</H> : label}
      </summary>
      <div className="dsm-accordion__content">{children}</div>
    </details>
  );
});
