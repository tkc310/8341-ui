'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { type ReactElement, type ReactNode, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button/index';
import { tv } from '@/lib/tv';

export const alertDialogVariants = tv({
  slots: {
    backdrop: [
      'fixed inset-0 z-(--8341-z-overlay) bg-overlay',
      'transition-opacity duration-(--8341-motion-duration-base) data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
    ],
    popup: [
      'fixed top-1/2 left-1/2 z-(--8341-z-modal) flex -translate-1/2 flex-col gap-stack-sm rounded-xl bg-surface p-inset-xl text-fg shadow-3',
      'max-h-[calc(100dvh-var(--8341-space-page-inline)*2)] w-[calc(100vw-var(--8341-space-page-inline)*2)] max-w-prose overflow-y-auto',
      'transition-[opacity,scale] duration-(--8341-motion-duration-base) ease-standard',
      'data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
      'forced-colors:border forced-colors:border-[CanvasText]',
    ],
    title: 'm-0 text-heading-xs',
    description: 'm-0 text-body-md text-fg-subtle',
    footer: 'mt-stack-sm flex flex-wrap justify-end gap-gap-sm',
  },
});

export interface AlertDialogProps {
  /** 問いかけの見出し（必須）。対象を書く: 「『週次レポート』を削除しますか」 */
  title: ReactNode;
  /** 結果の説明。取り消せないなら書く: 「元に戻せません。」 */
  description?: ReactNode;
  /** 実行するボタンの文言（必須）。動詞で書く: 「削除する」 */
  confirmLabel: string;
  /** やめるボタンの文言 */
  cancelLabel?: string;
  /** 実行するボタンの色。取り消せない・失う操作は danger（既定）、それ以外は primary */
  tone?: 'danger' | 'primary';
  /**
   * 実行したときの処理。Promise を返すと、終わるまで実行ボタンを処理中にして閉じない。
   * 失敗したときは例外を投げると開いたままになる（誤りは children で知らせる）
   */
  onConfirm: () => void | Promise<void>;
  /** 開くボタン（Button など）。open で開閉を管理する場合は省略できる */
  trigger?: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  /** 説明に収まらない補足（失敗の知らせなど） */
  children?: ReactNode;
}

/**
 * 取り消せない操作の前に、実行してよいかを確かめるダイアログ（Base UI の AlertDialog。role="alertdialog"）。
 * 開くとフォーカスは「キャンセル」に置き、Enter の押し間違いで実行しない。外側を押しても閉じない（Esc とキャンセルで閉じる）。
 */
export function AlertDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = 'キャンセル',
  tone = 'danger',
  onConfirm,
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
}: AlertDialogProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const [pending, setPending] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const open = openProp ?? uncontrolled;
  const setOpen = (next: boolean) => {
    // 実行中は閉じない（結果が分からないまま画面が戻るのを防ぐ）
    if (pending && !next) return;
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };
  const confirm = async () => {
    setPending(true);
    try {
      await onConfirm();
      setPending(false);
      if (openProp === undefined) setUncontrolled(false);
      onOpenChange?.(false);
    } catch {
      // 失敗は呼び出し側が children で知らせる。開いたままにして、もう一度試せるようにする
      setPending(false);
    }
  };
  const s = alertDialogVariants();
  return (
    <BaseAlertDialog.Root open={open} onOpenChange={setOpen}>
      {trigger && <BaseAlertDialog.Trigger render={trigger} />}
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className={s.backdrop()} />
        <BaseAlertDialog.Popup className={s.popup({ className })} initialFocus={cancelRef}>
          <BaseAlertDialog.Title className={s.title()}>{title}</BaseAlertDialog.Title>
          {description && (
            <BaseAlertDialog.Description className={s.description()}>{description}</BaseAlertDialog.Description>
          )}
          {children}
          <div className={s.footer()}>
            <BaseAlertDialog.Close render={<Button ref={cancelRef} variant="secondary" />}>
              {cancelLabel}
            </BaseAlertDialog.Close>
            <Button variant={tone} loading={pending} onClick={() => void confirm()}>
              {confirmLabel}
            </Button>
          </div>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}
