import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type { ComponentProps, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon/index';
import { focusRing } from '@/lib/focus';
import { tv } from '@/lib/tv';

export const accordionVariants = tv({
  slots: {
    root: 'border-t border-border',
    item: 'border-b border-border',
    header: 'm-0 text-body-md font-bold',
    trigger: [
      'group/trigger flex min-h-target-min w-full cursor-pointer items-center rounded-xs border-0 bg-transparent px-inset-sm py-inset-md text-start font-bold text-fg hover:bg-muted',
      focusRing,
    ],
    icon: 'ms-gap-md shrink-0 text-icon-key transition-transform group-data-[panel-open]/trigger:rotate-180',
    panel:
      'h-(--accordion-panel-height) overflow-hidden transition-[height] ease-standard data-[ending-style]:h-0 data-[starting-style]:h-0',
    content: 'px-inset-sm pb-inset-xl [&>p]:m-0',
  },
});

export interface AccordionProps extends Omit<ComponentProps<typeof BaseAccordion.Root>, 'className'> {
  className?: string;
}

/**
 * 折りたたみの一覧。既定で 1 つだけ開く（multiple で複数）。
 * 閉じている中身もページ内検索で見つかるよう hiddenUntilFound を有効にしている。
 */
export function Accordion({ className, hiddenUntilFound = true, ...rest }: AccordionProps) {
  return (
    <BaseAccordion.Root
      className={accordionVariants().root({ className })}
      hiddenUntilFound={hiddenUntilFound}
      {...rest}
    />
  );
}

export interface AccordionItemProps extends Omit<ComponentProps<typeof BaseAccordion.Item>, 'className' | 'title'> {
  /** 開閉ボタンに表示する見出し文 */
  summary: ReactNode;
  /** 見出しのレベル。ページの文書構造に合わせる */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: ReactNode;
}

export function AccordionItem({ summary, headingLevel = 3, className, children, ...rest }: AccordionItemProps) {
  const s = accordionVariants();
  const H = `h${headingLevel}` as const;
  return (
    <BaseAccordion.Item className={s.item({ className })} {...rest}>
      <BaseAccordion.Header render={<H />} className={s.header()}>
        <BaseAccordion.Trigger className={s.trigger()}>
          <span className="flex-1">{summary}</span>
          <Icon name="chevron-down" className={s.icon()} />
        </BaseAccordion.Trigger>
      </BaseAccordion.Header>
      <BaseAccordion.Panel className={s.panel()}>
        <div className={s.content()}>{children}</div>
      </BaseAccordion.Panel>
    </BaseAccordion.Item>
  );
}
