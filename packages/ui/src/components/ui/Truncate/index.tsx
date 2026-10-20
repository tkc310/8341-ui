'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { useEffect, useState } from 'react';
import { focusRing } from '@/lib/focus';
import { tv } from '@/lib/tv';

export const truncateVariants = tv({
  slots: {
    text: ['block min-w-0 truncate', focusRing],
    positioner: 'z-(--8341-z-toast)',
    popup: [
      'max-w-[min(24rem,calc(100vw-var(--8341-space-page-inline)*2))] rounded-sm bg-inverse px-inset-sm py-inset-xs text-body-sm text-fg-inverse shadow-2',
      'origin-(--transform-origin) transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
      'forced-colors:border forced-colors:border-[CanvasText]',
    ],
  },
});

export interface TruncateProps {
  /** 表示する文字。省略されても読み上げでは全文が読まれる */
  children: string;
  className?: string;
}

/**
 * 1 行に収まらない文字を … で省略し、マウスを乗せるかフォーカスすると全文をツールチップで出す。
 * 省略されたときだけフォーカスできるようにし、キーボードでも全文を確かめられるようにする。
 * 本文や大事な情報には使わない（折り返して全文を見せる）。表の列や一覧の項目名など、幅が限られる場所に使う。
 */
export function Truncate({ children, className }: TruncateProps) {
  const [element, setElement] = useState<Element | null>(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    if (!element) return undefined;
    const update = () => setTruncated(element.scrollWidth > element.clientWidth);
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, children]);

  const s = truncateVariants();
  return (
    <BaseTooltip.Root disabled={!truncated}>
      <BaseTooltip.Trigger
        ref={setElement}
        render={<span />}
        delay={100}
        closeDelay={0}
        tabIndex={truncated ? 0 : undefined}
        className={s.text({ className })}
      >
        {children}
      </BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side="top" align="start" sideOffset={4} className={s.positioner()}>
          {/* 全文は省略された文字そのものが読み上げられるので、ツールチップは見た目だけの補助 */}
          <BaseTooltip.Popup className={s.popup()} aria-hidden="true">
            {children}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
