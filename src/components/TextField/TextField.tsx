import { type InputHTMLAttributes, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import { useFieldProps } from '../FormField/FormField';
import '../_shared/control.css';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  /** FormField の外で使う場合に invalid を直接指定する */
  invalid?: boolean;
}

/**
 * 1 行テキスト入力。FormField の中に置くとラベル・エラーと自動で関連付く。
 * 入力の種類に合わせて type / inputMode / autoComplete を必ず指定すること。
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { size = 'md', invalid, className, type = 'text', ...rest },
  ref,
) {
  const { invalid: _invalid, ...field } = useFieldProps(rest, invalid);
  return (
    <input
      ref={ref}
      type={type}
      className={cx('dsm-control', 'dsm-focusable', className)}
      data-size={size}
      {...rest}
      {...field}
    />
  );
});
