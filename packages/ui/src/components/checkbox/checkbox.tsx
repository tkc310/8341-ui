import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { ComponentProps, ReactNode } from 'react';
import { Icon } from '@/components/ui/icon';
import { focusRing } from '@/lib/focus';
import { type VariantProps, tv } from '@/lib/tv';

/** Checkbox と Radio に共通の、ラベル全体がタップ領域になる行 */
export const choiceVariants = tv({
  slots: {
    label: [
      'flex w-fit cursor-pointer items-start gap-gap-sm text-body-md text-fg',
      // 1 行の高さ（16px × 1.7）に上下の余白を足して 44px のタップ領域にする
      'min-h-target-min py-[calc((var(--8341-size-target-min)-var(--8341-text-body-md-font-size)*var(--8341-text-body-md-line-height))/2)]',
      'has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:text-fg-disabled',
    ],
    control: [
      'group/control mt-[calc((var(--8341-text-body-md-font-size)*var(--8341-text-body-md-line-height)-var(--choice-box))/2)] inline-grid size-(--choice-box) shrink-0 place-items-center',
      'border-2 border-border-input bg-surface hover:border-border-strong hover:bg-muted',
      'data-[invalid]:border-border-danger',
      'data-[disabled]:border-border-disabled data-[disabled]:bg-disabled',
      focusRing,
    ],
    text: 'flex flex-col',
    description: 'text-body-sm text-fg-subtle',
  },
  variants: {
    size: {
      md: { label: '[--choice-box:var(--8341-size-icon-lg)]' },
      lg: { label: '[--choice-box:calc(var(--8341-size-icon-lg)+var(--8341-space-gap-xs))]' },
    },
  },
  defaultVariants: { size: 'md' },
});

export interface CheckboxProps
  extends Omit<ComponentProps<typeof BaseCheckbox.Root>, 'className'>, VariantProps<typeof choiceVariants> {
  /** ラベルは必須。ラベル全体がクリック領域になる */
  label: ReactNode;
  /** ラベル下の補足 */
  description?: ReactNode;
  className?: string;
}

/** チェックボックス（Base UI の Checkbox）。ラベル全体がタップ領域になり、一部選択（indeterminate）も表せる。 */
export function Checkbox({ label, description, size, className, ...rest }: CheckboxProps) {
  const s = choiceVariants({ size });
  return (
    <label className={s.label({ className })}>
      <BaseCheckbox.Root
        className={s.control({
          className:
            'rounded-xs data-[checked]:border-key data-[checked]:bg-key data-[indeterminate]:border-key data-[indeterminate]:bg-key data-[disabled]:data-[checked]:bg-disabled forced-colors:data-[checked]:border-[Highlight]',
        })}
        {...rest}
      >
        <BaseCheckbox.Indicator className="text-fg-on-key group-data-[disabled]/control:text-fg-disabled forced-colors:text-[CanvasText]">
          <Icon name="check" size="sm" className="stroke-3 group-data-[indeterminate]/control:hidden" />
          <Icon name="minus" size="sm" className="hidden stroke-3 group-data-[indeterminate]/control:block" />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      <span className={s.text()}>
        <span>{label}</span>
        {description && <span className={s.description()}>{description}</span>}
      </span>
    </label>
  );
}
