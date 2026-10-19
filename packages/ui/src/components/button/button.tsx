'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { focusRing } from '@/lib/focus';
import { type VariantProps, tv } from '@/lib/tv';

export const buttonVariants = tv({
  slots: {
    root: [
      'relative inline-flex min-w-[calc(var(--8341-size-control-md)*2)] items-center justify-center',
      'rounded-md border px-inset-lg text-label-md select-none',
      'transition-colors',
      focusRing,
      'disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled',
      'forced-colors:border-[ButtonText] forced-colors:disabled:border-[GrayText] forced-colors:disabled:text-[GrayText]',
    ],
    content: 'inline-flex items-center gap-gap-sm',
    spinner:
      'absolute size-icon-md animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none',
  },
  variants: {
    /**
     * - primary: 画面で最も重要な 1 つの操作（1 画面 1 つが目安）
     * - secondary: primary と並ぶ代替操作
     * - tertiary: 補助的な操作（文字だけのボタン）
     * - danger: 取り消せない破壊的操作
     */
    variant: {
      primary: {
        root: 'border-key bg-key text-fg-on-key enabled:hover:border-key-hover enabled:hover:bg-key-hover enabled:active:border-key-active enabled:active:bg-key-active',
      },
      secondary: {
        root: 'border-border-key bg-surface text-fg-key enabled:hover:bg-key-subtle enabled:active:bg-key-subtle-hover',
      },
      tertiary: {
        root: 'border-transparent bg-transparent text-fg-key underline underline-offset-[0.2em] enabled:hover:bg-key-subtle enabled:active:bg-key-subtle-hover disabled:border-transparent disabled:bg-transparent',
      },
      danger: {
        root: 'border-danger bg-danger text-fg-on-key enabled:hover:border-danger-hover enabled:hover:bg-danger-hover enabled:active:border-danger-active enabled:active:bg-danger-active',
      },
    },
    /** sm は見た目 36px だが、タップ領域は 44px を確保する */
    size: {
      sm: { root: 'tap-target min-h-control-sm min-w-[calc(var(--8341-size-control-sm)*2)] rounded-sm px-inset-md' },
      md: { root: 'min-h-control-md' },
      lg: { root: 'min-h-control-lg px-inset-xl' },
    },
    fullWidth: { true: { root: 'w-full' } },
    // 文字は opacity で隠す（invisible = visibility:hidden だとアクセシビリティツリーからも消え、ボタンの名前が無くなる）
    loading: { true: { root: 'cursor-progress', content: 'opacity-0' } },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

type BaseProps = Omit<ComponentProps<typeof BaseButton>, 'className'>;

export interface ButtonProps extends BaseProps, Omit<VariantProps<typeof buttonVariants>, 'loading'> {
  className?: string;
  /** 先頭アイコン（Lead icon） */
  iconStart?: ReactNode;
  /** 末尾アイコン（Tail icon） */
  iconEnd?: ReactNode;
  /** 処理中。幅を保ったまま aria-busy を立て、フォーカスを失わせずに二重送信を防ぐ */
  loading?: boolean;
}

/**
 * 操作を実行するボタン。画面遷移だけなら Link を使う。
 * 既定は type="button"（フォーム内で意図せず送信しない）。送信ボタンは type="submit" を明示する。
 */
export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  iconStart,
  iconEnd,
  type = 'button',
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const s = buttonVariants({ variant, size, fullWidth, loading });
  return (
    <BaseButton
      type={type}
      className={s.root({ className })}
      aria-busy={loading || undefined}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        // loading 中は disabled にせず（フォーカスが失われるため）、クリックだけを無効にする
        if (loading) {
          e.preventDefault();
          return;
        }
        onClick?.(e as Parameters<NonNullable<typeof onClick>>[0]);
      }}
      {...rest}
    >
      {loading && <span className={s.spinner()} aria-hidden="true" />}
      <span className={s.content()}>
        {iconStart}
        {children}
        {iconEnd}
      </span>
    </BaseButton>
  );
}
