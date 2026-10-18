'use client';

import { Field } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { type ControlSize, controlVariants, useFormField } from '@/components/ui/form-field';

export interface TextFieldProps extends Omit<ComponentProps<typeof Field.Control>, 'className' | 'size'> {
  size?: ControlSize;
  className?: string;
}

/**
 * 1 行のテキスト入力。FormField の中に置くと、ラベル・補足・エラーと自動で関連付く。
 * 入力の種類に合わせて type / inputMode / autoComplete を必ず指定する。
 */
export function TextField({ size, className, required, type = 'text', ...rest }: TextFieldProps) {
  const field = useFormField();
  return (
    <Field.Control
      type={type}
      required={required ?? field.required}
      className={controlVariants({ size, className })}
      {...rest}
    />
  );
}
