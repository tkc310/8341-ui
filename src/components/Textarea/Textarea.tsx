import { type ChangeEvent, type TextareaHTMLAttributes, forwardRef, useId, useState } from 'react';
import { cx } from '../../utils/cx';
import { useFieldProps } from '../FormField/FormField';
import '../_shared/control.css';
import './Textarea.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /**
   * 文字数カウンターを表示する上限。maxLength とは別に指定でき、
   * 超過しても入力は止めず（貼り付けた文章が消えないように）、超過を知らせる。
   */
  countLimit?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, countLimit, className, rows = 4, onChange, ...rest },
  ref,
) {
  const { invalid: fieldInvalid, ...field } = useFieldProps(rest, invalid);
  const counterId = useId();
  const initial = String(rest.value ?? rest.defaultValue ?? '');
  const [length, setLength] = useState(initial.length);
  const count = rest.value !== undefined ? String(rest.value).length : length;
  const over = countLimit !== undefined && count > countLimit;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLength(e.target.value.length);
    onChange?.(e);
  };

  return (
    <div className="dsm-textarea">
      <textarea
        ref={ref}
        rows={rows}
        className={cx('dsm-control', 'dsm-focusable', 'dsm-textarea__input', className)}
        onChange={handleChange}
        {...rest}
        {...field}
        aria-invalid={fieldInvalid || over || undefined}
        aria-describedby={countLimit ? cx(field['aria-describedby'], counterId) : field['aria-describedby']}
      />
      {countLimit !== undefined && (
        <p className="dsm-textarea__counter" id={counterId} data-over={over || undefined} aria-live="polite">
          {over ? `${count - countLimit}文字超過しています` : `${count}/${countLimit}文字`}
        </p>
      )}
    </div>
  );
});
