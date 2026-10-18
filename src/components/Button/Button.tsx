import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * - primary: 画面で最も重要な 1 つの操作（1 画面 1 つが目安）
   * - secondary: primary と並ぶ代替操作
   * - tertiary: 補助的な操作（文字だけのボタン）
   * - danger: 取り消せない破壊的操作
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  /** sm は見た目 36px だがタップ領域は 44px を確保する */
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /** 先頭アイコン（Lead icon） */
  iconStart?: ReactNode;
  /** 末尾アイコン（Tail icon） */
  iconEnd?: ReactNode;
  /** 処理中。ボタン幅を保ったまま aria-busy を立て、二重送信を防ぐ */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    iconStart,
    iconEnd,
    loading = false,
    type = 'button',
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('dsm-button', 'dsm-focusable', className)}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth || undefined}
      aria-busy={loading || undefined}
      // loading 中はフォーカスを失わせないよう disabled ではなくクリックを無効化する
      onClick={loading ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {loading && <span className="dsm-button__spinner" aria-hidden="true" />}
      <span className="dsm-button__content">
        {iconStart && <span className="dsm-button__icon">{iconStart}</span>}
        <span className="dsm-button__label">{children}</span>
        {iconEnd && <span className="dsm-button__icon">{iconEnd}</span>}
      </span>
    </button>
  );
});
