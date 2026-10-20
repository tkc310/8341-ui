import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { Button } from '@/components/ui/Button/index';
import { type VariantProps, tv } from '@/lib/tv';

export const dialogVariants = tv({
  slots: {
    backdrop: [
      'fixed inset-0 z-(--8341-z-overlay) bg-overlay',
      'transition-opacity duration-(--8341-motion-duration-base) data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
    ],
    popup: [
      'fixed z-(--8341-z-modal) flex flex-col overflow-hidden bg-surface text-fg shadow-3',
      'transition-[opacity,scale,translate] duration-(--8341-motion-duration-base) ease-standard',
      'forced-colors:border forced-colors:border-[CanvasText]',
    ],
    header:
      'flex shrink-0 items-start justify-between gap-gap-md border-b border-border-subtle px-inset-xl py-inset-lg',
    heading: 'flex min-w-0 flex-col gap-gap-xs',
    title: 'm-0 text-heading-xs',
    description: 'm-0 text-body-sm text-fg-subtle',
    // 見出しが長くても閉じるボタンを潰さない
    close: 'shrink-0',
    body: 'flex min-h-0 flex-1 flex-col gap-stack-md overflow-y-auto p-inset-xl',
    footer: 'flex shrink-0 flex-wrap justify-end gap-gap-sm border-t border-border-subtle px-inset-xl py-inset-lg',
  },
  variants: {
    /**
     * - center: 画面の中央に重ね、裏の画面は操作できない（既定）
     * - side: 先頭側（左）からせり出し、裏の画面も操作できる。プレビューを見ながら入力する場合など
     */
    placement: {
      center: {
        popup: [
          'top-1/2 left-1/2 -translate-1/2 rounded-xl',
          'max-h-[calc(100dvh-var(--8341-space-page-inline)*2)] w-[calc(100vw-var(--8341-space-page-inline)*2)] max-w-prose',
          'data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
        ],
      },
      side: {
        popup: [
          'inset-y-0 start-0 h-dvh w-full border-e border-border md:w-1/2',
          'data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full',
          'rtl:data-[ending-style]:translate-x-full rtl:data-[starting-style]:translate-x-full',
        ],
      },
    },
  },
  defaultVariants: { placement: 'center' },
});

export interface DialogProps
  extends Omit<ComponentProps<typeof BaseDialog.Root>, 'children' | 'modal'>, VariantProps<typeof dialogVariants> {
  /** 見出し（必須）。ダイアログの名前として読み上げられる */
  title: ReactNode;
  /** 見出しの下の補足。ダイアログの説明として読み上げられる */
  description?: ReactNode;
  /** 下部の操作（Button を右寄せで並べる。主要な操作を末尾に置く） */
  footer?: ReactNode;
  /** 開くボタン（Button など）。open で開閉を管理する場合は省略できる */
  trigger?: ReactElement;
  /** 閉じるボタンの文言 */
  closeLabel?: string;
  className?: string;
  children: ReactNode;
}

/**
 * 画面の上に重ねて表示するダイアログ（Base UI の Dialog）。開くとフォーカスが中に移り、閉じると元のボタンに戻る。
 * Esc と「閉じる」ボタンで閉じられる。確認だけなら NotificationBanner など画面の中で済ませられないかを先に検討する。
 */
export function Dialog({
  title,
  description,
  footer,
  trigger,
  placement = 'center',
  closeLabel = '閉じる',
  className,
  children,
  ...rest
}: DialogProps) {
  const side = placement === 'side';
  const s = dialogVariants({ placement });
  return (
    // side は裏の画面を操作できるよう、フォーカスだけを閉じ込め、外側を押しても閉じない
    <BaseDialog.Root modal={side ? 'trap-focus' : true} disablePointerDismissal={side} {...rest}>
      {trigger && <BaseDialog.Trigger render={trigger} />}
      <BaseDialog.Portal>
        {!side && <BaseDialog.Backdrop className={s.backdrop()} />}
        <BaseDialog.Popup className={s.popup({ className })}>
          <div className={s.header()}>
            <div className={s.heading()}>
              <BaseDialog.Title className={s.title()}>{title}</BaseDialog.Title>
              {description && (
                <BaseDialog.Description className={s.description()}>{description}</BaseDialog.Description>
              )}
            </div>
            <BaseDialog.Close render={<Button variant="tertiary" size="sm" className={s.close()} />}>
              {closeLabel}
            </BaseDialog.Close>
          </div>
          <div className={s.body()}>{children}</div>
          {footer && <div className={s.footer()}>{footer}</div>}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
