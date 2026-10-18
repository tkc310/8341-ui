import { type SelectHTMLAttributes, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import { useFieldProps } from '../FormField/FormField';
import { Icon } from '../Icon/Icon';
import '../_shared/control.css';
import './Select.css';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  /** 未選択状態の表示（例: 「選択してください」）。value="" の option として先頭に入る */
  placeholder?: string;
}

/** ネイティブの select を使う。選択肢が 7 個以上あるならこれ、少ないなら RadioGroup を検討する */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size = 'md', invalid, placeholder, className, children, ...rest },
  ref,
) {
  const { invalid: _invalid, ...field } = useFieldProps(rest, invalid);
  return (
    <div className="tkc-select" data-size={size}>
      <select
        ref={ref}
        className={cx('tkc-control', 'tkc-focusable', 'tkc-select__input', className)}
        data-size={size}
        {...rest}
        {...field}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {children}
      </select>
      <Icon name="chevron-down" className="tkc-select__icon" />
    </div>
  );
});
