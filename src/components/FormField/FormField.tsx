import { type ReactNode, createContext, useContext, useId } from 'react';
import { cx } from '../../utils/cx';
import './FormField.css';

interface FormFieldContextValue {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/** FormField 配下の入力部品が、id・aria-describedby・aria-invalid を受け取るためのフック */
export function useFormField() {
  return useContext(FormFieldContext);
}

export interface FormFieldProps {
  label: ReactNode;
  /** 入力のヒント（形式・例など）。ラベルの直下に表示し、aria-describedby で関連付ける */
  supportText?: ReactNode;
  /** エラーメッセージ。指定すると invalid 扱いになる。何が誤りでどう直すかを書く */
  error?: ReactNode;
  required?: boolean;
  /** 必須でない項目を明示する場合（必須項目が多いフォーム向け） */
  showOptional?: boolean;
  disabled?: boolean;
  /** 明示的に id を与える場合 */
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * ラベル・補足・エラーと入力部品を正しく関連付けるラッパー。
 * 必須表示は「*」ではなく「必須」と文字で示す（色や記号だけに頼らない）。
 */
export function FormField({
  label,
  supportText,
  error,
  required = false,
  showOptional = false,
  disabled = false,
  id: idProp,
  className,
  children,
}: FormFieldProps) {
  const autoId = useId();
  const id = idProp ?? `dsm-field-${autoId}`;
  const supportId = supportText ? `${id}-support` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, supportId].filter(Boolean).join(' ') || undefined;

  return (
    <FormFieldContext.Provider value={{ id, describedBy, invalid: Boolean(error), required, disabled }}>
      <div className={cx('dsm-form-field', className)} data-disabled={disabled || undefined}>
        <label className="dsm-form-field__label" htmlFor={id}>
          {label}
          {required && <span className="dsm-form-field__badge" data-kind="required">必須</span>}
          {!required && showOptional && <span className="dsm-form-field__badge">任意</span>}
        </label>
        {supportText && (
          <p className="dsm-form-field__support" id={supportId}>
            {supportText}
          </p>
        )}
        {error && (
          <p className="dsm-form-field__error" id={errorId}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="dsm-form-field__error-icon">
              <path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3z" fill="currentColor" />
              <path d="M12 7.5v5.5M12 16v.5" stroke="var(--dsm-color-bg-surface)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {error}
          </p>
        )}
        {children}
      </div>
    </FormFieldContext.Provider>
  );
}

/** 入力部品の共通 props を FormField のコンテキストとマージする */
export function useFieldProps<T extends { id?: string; 'aria-describedby'?: string; required?: boolean; disabled?: boolean }>(
  props: T,
  invalidProp?: boolean,
) {
  const field = useFormField();
  const invalid = invalidProp ?? field?.invalid ?? false;
  const describedBy = [field?.describedBy, props['aria-describedby']].filter(Boolean).join(' ') || undefined;
  return {
    id: props.id ?? field?.id,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || undefined,
    required: props.required ?? field?.required,
    disabled: props.disabled ?? field?.disabled,
    invalid,
  };
}
