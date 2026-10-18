import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  createContext,
  forwardRef,
  useContext,
  useId,
} from 'react';
import { cx } from '../../utils/cx';
import '../Checkbox/Checkbox.css';
import '../FormField/FormField.css';
import './RadioGroup.css';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  describedBy?: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  /** グループの問い（fieldset の legend になる） */
  legend: ReactNode;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  supportText?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** 選択肢が 2〜3 個で短い場合のみ横並びにする */
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  children: ReactNode;
}

/** 単一選択。fieldset + legend で問いと選択肢をまとめる */
export function RadioGroup({
  legend,
  name,
  value,
  defaultValue,
  onChange,
  supportText,
  error,
  required = false,
  disabled = false,
  orientation = 'vertical',
  className,
  children,
}: RadioGroupProps) {
  const autoId = useId();
  const groupName = name ?? `tkc-radio-${autoId}`;
  const supportId = supportText ? `${groupName}-support` : undefined;
  const errorId = error ? `${groupName}-error` : undefined;
  const describedBy = [errorId, supportId].filter(Boolean).join(' ') || undefined;

  return (
    <RadioGroupContext.Provider
      value={{ name: groupName, value, defaultValue, onChange, invalid: Boolean(error), required, disabled, describedBy }}
    >
      <fieldset
        className={cx('tkc-radio-group', className)}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-required={required || undefined}
      >
        <legend className="tkc-radio-group__legend">
          {legend}
          {required && <span className="tkc-form-field__badge" data-kind="required">必須</span>}
        </legend>
        {supportText && (
          <p className="tkc-form-field__support" id={supportId}>
            {supportText}
          </p>
        )}
        {error && (
          <p className="tkc-form-field__error" id={errorId}>
            {error}
          </p>
        )}
        <div className="tkc-radio-group__options" data-orientation={orientation}>
          {children}
        </div>
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name'> {
  value: string;
  label: ReactNode;
  description?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, description, className, ...rest },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const controlled = group?.value !== undefined;
  return (
    <label className={cx('tkc-choice', className)}>
      <input
        ref={ref}
        type="radio"
        name={group?.name}
        value={value}
        className="tkc-choice__input tkc-focusable"
        data-kind="radio"
        required={group?.required}
        aria-invalid={group?.invalid || undefined}
        {...(controlled
          ? { checked: group?.value === value, onChange: group?.onChange }
          : { defaultChecked: group?.defaultValue === value, onChange: group?.onChange })}
        {...rest}
      />
      <span className="tkc-choice__text">
        <span className="tkc-choice__label">{label}</span>
        {description && <span className="tkc-choice__description">{description}</span>}
      </span>
    </label>
  );
});
