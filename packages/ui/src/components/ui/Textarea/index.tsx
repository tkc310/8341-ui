'use client';

import { Field } from '@base-ui/react/field';
import { type ChangeEvent, type ComponentProps, useState } from 'react';
import { controlVariants, useFormField } from '@/components/ui/FormField/index';
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
        // 超過時だけ上書きする。それ以外は Field の検証結果（aria-invalid）と補足の関連付け（aria-describedby）に任せる
        {...(over ? { 'aria-invalid': true } : {})}
        className={cn(
          controlVariants(),
          'min-h-[calc(var(--8341-size-control-md)*2)] resize-y leading-(--8341-text-body-md-line-height)',
          className,
        )}
      />
      {countLimit !== undefined && (
        // Field.Description にすると、Field が入力欄の aria-describedby に自動で足す（既存の補足と並ぶ）
        <Field.Description
          aria-live="polite"
          className={cn('m-0 self-end text-body-sm tabular-nums', over ? 'font-bold text-fg-danger' : 'text-fg-subtle')}
        >
          {over ? `${count - countLimit}文字超過しています` : `${count}/${countLimit}文字`}
        </Field.Description>
      )}
    </div>
  );
}
