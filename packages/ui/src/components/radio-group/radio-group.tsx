import { Field } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ComponentProps, ReactNode } from 'react';
import { choiceVariants } from '@/components/ui/checkbox';
import { ErrorIcon, RequiredBadge } from '@/components/ui/form-field';
import { tv } from '@/lib/tv';

const radioGroup = tv({
  slots: {
    root: 'm-0 flex min-w-0 flex-col gap-stack-sm border-0 p-0',
    legend: 'inline-flex flex-wrap items-center gap-gap-sm p-0 font-bold text-fg data-[disabled]:text-fg-disabled',
    description: 'm-0 text-body-sm text-fg-subtle',
    error: 'm-0 flex items-start gap-gap-xs text-body-sm font-bold text-fg-danger',
    options: 'flex flex-col',
  },
  variants: {
    orientation: {
      vertical: {},
      horizontal: { options: 'flex-row flex-wrap gap-x-stack-md' },
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

export interface RadioGroupProps extends Omit<ComponentProps<typeof BaseRadioGroup>, 'className'> {
  /** グループの問い（fieldset の legend になる） */
  legend: ReactNode;
  supportText?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** 選択肢が 2〜3 個で短い場合だけ横並びにする */
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  children: ReactNode;
}

/** 単一選択。fieldset と legend で問いと選択肢をまとめる */
export function RadioGroup({
  legend,
  supportText,
  error,
  required = false,
  orientation,
  name,
  disabled,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const s = radioGroup({ orientation });
  return (
    <Field.Root name={name} disabled={disabled} invalid={error ? true : undefined}>
      <Fieldset.Root
        render={<BaseRadioGroup name={name} required={required} disabled={disabled} {...rest} />}
        className={s.root({ className })}
      >
        <Fieldset.Legend className={s.legend()}>
          {legend}
          {required && <RequiredBadge required />}
        </Fieldset.Legend>
        {supportText && <Field.Description className={s.description()}>{supportText}</Field.Description>}
        {error && (
          <Field.Error match className={s.error()}>
            <ErrorIcon />
            {error}
          </Field.Error>
        )}
        <div className={s.options()}>{children}</div>
      </Fieldset.Root>
    </Field.Root>
  );
}

export interface RadioProps extends Omit<ComponentProps<typeof BaseRadio.Root>, 'className'> {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  className?: string;
}

/**
 * ラジオボタン（Base UI の Radio）。RadioGroup の中で使う。
 * 選択肢ごとに Field.Item で区切る。区切らないと、グループの Field.Root が持つ 1 つのラベル ID を
 * 全選択肢が共有し、どの選択肢も先頭のラベル名で読み上げられる。
 */
export function Radio({ label, description, className, ...rest }: RadioProps) {
  const s = choiceVariants();
  return (
    <Field.Item>
      <Field.Label className={s.label({ className })}>
        <BaseRadio.Root
          className={s.control({ className: 'rounded-full data-[checked]:border-key forced-colors:data-[checked]:border-[Highlight]' })}
          {...rest}
        >
          <BaseRadio.Indicator className="size-[calc(var(--choice-box)/2)] rounded-full bg-key group-data-[disabled]/control:bg-fg-disabled forced-colors:bg-[CanvasText]" />
        </BaseRadio.Root>
        <span className={s.text()}>
          <span>{label}</span>
          {description && <span className={s.description()}>{description}</span>}
        </span>
      </Field.Label>
    </Field.Item>
  );
}
