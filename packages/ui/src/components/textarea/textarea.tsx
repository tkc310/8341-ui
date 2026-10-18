'use client';

import { Field } from '@base-ui/react/field';
import { type ChangeEvent, type ComponentProps, useId, useState } from 'react';
import { controlVariants, useFormField } from '@/components/ui/form-field';
import { cn } from '@/lib/tv';

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'className'> {
  className?: string;
  /**
   * 文字数カウンターの上限。超過しても入力は止めず（貼り付けた文章が消えないように）、超過を知らせる。
   */
  countLimit?: number;
}

/** 複数行のテキスト入力。文字数カウンターを付けられ、上限を超えても入力は止めない。 */
export function Textarea({ className, countLimit, rows = 4, required, onChange, ...rest }: TextareaProps) {
  const field = useFormField();
  const counterId = useId();
  const [length, setLength] = useState(String(rest.value ?? rest.defaultValue ?? '').length);
  const count = rest.value !== undefined ? String(rest.value).length : length;
  const over = countLimit !== undefined && count > countLimit;

  return (
    <div className="flex flex-col gap-gap-xs">
      <Field.Control
        render={
          <textarea
            rows={rows}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setLength(e.target.value.length);
              onChange?.(e);
            }}
            {...rest}
          />
        }
        required={required ?? field.required}
        aria-invalid={over || undefined}
        aria-describedby={countLimit !== undefined ? counterId : undefined}
        className={cn(controlVariants(), 'min-h-[calc(var(--tkc-size-control-md)*2)] resize-y leading-(--tkc-text-body-md-line-height)', className)}
      />
      {countLimit !== undefined && (
        <p
          id={counterId}
          aria-live="polite"
          className={cn('m-0 self-end text-body-sm tabular-nums', over ? 'font-bold text-fg-danger' : 'text-fg-subtle')}
        >
          {over ? `${count - countLimit}文字超過しています` : `${count}/${countLimit}文字`}
        </p>
      )}
    </div>
  );
}
