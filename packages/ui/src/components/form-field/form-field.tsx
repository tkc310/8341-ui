'use client';

import { Field } from '@base-ui/react/field';
import { type ReactNode, createContext, useContext } from 'react';
import { focusRing } from '@/lib/focus';
import { type VariantProps, tv } from '@/lib/tv';

/** 入力欄（TextField / Textarea / Select のトリガー）共通の見た目 */
export const controlVariants = tv({
  base: [
    'block w-full rounded-md border border-border-input bg-surface px-inset-md py-inset-sm',
    // 16px 未満だと iOS Safari がフォーカス時に拡大するため、文字サイズは固定
    'text-body-md leading-(--8341-text-dense-md-line-height) text-fg placeholder:text-fg-subtle',
    'transition-colors hover:border-border-strong focus-visible:border-border-strong',
    focusRing,
    // エラーは色に加えて線を太くし、形でも示す
    'data-[invalid]:border-border-danger data-[invalid]:shadow-[inset_0_0_0_1px_var(--8341-color-border-danger)] aria-invalid:border-border-danger aria-invalid:shadow-[inset_0_0_0_1px_var(--8341-color-border-danger)]',
    // :read-only は button や無効の input にも当たるため、編集できる欄の読み取り専用に限る
    '[&:read-only:not(:disabled,button)]:border-dashed [&:read-only:not(:disabled,button)]:bg-subtle',
    'disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled data-[disabled]:cursor-not-allowed data-[disabled]:border-border-disabled data-[disabled]:bg-disabled data-[disabled]:text-fg-disabled',
    'forced-colors:data-[invalid]:border-2',
  ],
  variants: {
    size: {
      sm: 'min-h-control-sm py-inset-xs',
      md: 'min-h-control-md',
      lg: 'min-h-control-lg py-inset-md',
    },
  },
  defaultVariants: { size: 'md' },
});
export type ControlSize = NonNullable<VariantProps<typeof controlVariants>['size']>;

const field = tv({
  slots: {
    root: 'flex min-w-0 flex-col gap-stack-sm',
    label:
      'inline-flex flex-wrap items-center gap-gap-sm text-body-md font-bold text-fg data-[disabled]:text-fg-disabled',
    badge: 'rounded-xs border px-inset-xs text-label-sm leading-(--8341-text-dense-sm-line-height)',
    description: 'm-0 text-body-sm text-fg-subtle',
    error: 'm-0 flex items-start gap-gap-xs text-body-sm font-bold text-fg-danger',
    errorIcon: 'size-icon-md shrink-0 text-icon-danger',
  },
});

/** 必須・任意のバッジ。「*」ではなく文字で示す */
export function RequiredBadge({ required }: { required: boolean }) {
  const s = field();
  return required ? (
    <span className={s.badge({ className: 'border-border-danger text-fg-danger' })}>必須</span>
  ) : (
    <span className={s.badge({ className: 'border-border text-fg-subtle' })}>任意</span>
  );
}

/** エラー文の先頭に付けるアイコン（色だけでエラーを伝えない） */
export function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={field().errorIcon()}>
      <path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3z" fill="currentColor" />
      <path d="M12 7.5v5.5M12 16v.5" stroke="var(--8341-color-bg-surface)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface FormFieldContextValue {
  required: boolean;
}
const FormFieldContext = createContext<FormFieldContextValue>({ required: false });

/** FormField 配下の入力部品が required を受け取るためのフック */
export const useFormField = () => useContext(FormFieldContext);

export interface FormFieldProps {
  label: ReactNode;
  /** 入力のヒント（形式・例など）。ラベルの直下に表示し、aria-describedby で関連付ける */
  supportText?: ReactNode;
  /**
   * エラー文。指定すると invalid になり、表示される。何が誤りでどう直すかを書く。
   * 指定しない場合は、入力欄のネイティブの検証（required / type / pattern など）の結果を Base UI が表示する。
   */
  error?: ReactNode;
  required?: boolean;
  /** 任意の項目に「任意」を表示する（必須項目が多いフォーム向け） */
  showOptional?: boolean;
  disabled?: boolean;
  /** フォーム送信時の名前（Base UI の Form と組み合わせると、サーバーのエラーをこの名前で表示できる） */
  name?: string;
  /** いつ検証するか。design-principlesの推奨は「欄を離れた時点」（onBlur） */
  validationMode?: 'onSubmit' | 'onBlur' | 'onChange';
  className?: string;
  children: ReactNode;
}

/**
 * ラベル・補足・エラーと入力部品を関連付けるラッパー（Base UI の Field）。
 * aria-describedby・aria-invalid は Base UI が付ける。必須は「必須」と文字で示す。
 */
export function FormField({
  label,
  supportText,
  error,
  required = false,
  showOptional = false,
  disabled,
  name,
  validationMode,
  className,
  children,
}: FormFieldProps) {
  const s = field();
  return (
    <FormFieldContext.Provider value={{ required }}>
      <Field.Root
        name={name}
        disabled={disabled}
        invalid={error ? true : undefined}
        validationMode={validationMode}
        className={s.root({ className })}
      >
        <Field.Label className={s.label()}>
          {label}
          {(required || showOptional) && <RequiredBadge required={required} />}
        </Field.Label>
        {supportText && <Field.Description className={s.description()}>{supportText}</Field.Description>}
        {error ? (
          <Field.Error match className={s.error()}>
            <ErrorIcon />
            {error}
          </Field.Error>
        ) : (
          // ネイティブ検証のメッセージ（valueMissing など）を表示する
          <Field.Error className={s.error()} />
        )}
        {children}
      </Field.Root>
    </FormFieldContext.Provider>
  );
}
