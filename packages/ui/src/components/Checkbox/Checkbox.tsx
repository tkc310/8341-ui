import { type InputHTMLAttributes, type ReactNode, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { cx } from '../../utils/cx';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** ラベルは必須。ラベル全体がクリック領域になる */
  label: ReactNode;
  /** ラベル下の補足 */
  description?: ReactNode;
  /** 一部選択（親チェックボックス用） */
  indeterminate?: boolean;
  invalid?: boolean;
  size?: 'md' | 'lg';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, invalid, size = 'md', className, id, ...rest },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={cx('tkc-choice', className)} data-size={size}>
      <input
        ref={inner}
        type="checkbox"
        id={id}
        className="tkc-choice__input tkc-focusable"
        data-kind="checkbox"
        aria-invalid={invalid || undefined}
        {...rest}
      />
      <span className="tkc-choice__text">
        <span className="tkc-choice__label">{label}</span>
        {description && <span className="tkc-choice__description">{description}</span>}
      </span>
    </label>
  );
});
