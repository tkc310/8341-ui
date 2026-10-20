import type { HTMLAttributes } from 'react';
import { type VariantProps, tv } from '@/lib/tv';

export const spinnerVariants = tv({
  slots: {
    root: 'inline-flex items-center gap-gap-sm text-body-sm text-fg-subtle',
    // 強制カラーでは枠線の色が上書きされ、透明の欠けが消えてしまうので、色の調整を止める
    ring: 'inline-block shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none forced-colors:forced-color-adjust-none',
  },
  variants: {
    size: {
      sm: { ring: 'size-icon-sm' },
      md: { ring: 'size-icon-md' },
      lg: { ring: 'size-icon-lg' },
    },
    /** 待ち時間が短いときにちらつかないよう、少し遅れて表示する */
    delay: { true: { root: 'transition-opacity delay-300 starting:opacity-0' } },
  },
  defaultVariants: { size: 'md' },
});

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'role'>, VariantProps<typeof spinnerVariants> {
  /** 何を待っているか（必須）。「保存しています」のように書く */
  label: string;
  /** label を画面にも表示する。表示しない場合も読み上げには伝わる */
  showLabel?: boolean;
}

/**
 * 読み込みや保存の最中であることを示すスピナー。role="status" で読み上げにも伝える。
 * ボタンの処理中は Button の loading を使う。中身の形が分かる読み込みは Skeleton を検討する。
 */
export function Spinner({ label, showLabel = false, size, delay, className, ...rest }: SpinnerProps) {
  const s = spinnerVariants({ size, delay });
  return (
    <span role="status" className={s.root({ className })} {...rest}>
      <span className={s.ring()} aria-hidden="true" />
      {/* ライブリージョンは中身の文字を読み上げるため、aria-label ではなく文字で持つ */}
      <span className={showLabel ? undefined : 'sr-only'}>{label}</span>
    </span>
  );
}
