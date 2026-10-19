'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { type ControlSize, controlVariants, useFormField } from '@/components/ui/form-field';
import { Icon } from '@/components/ui/icon';
import { focusRing } from '@/lib/focus';
import { tv } from '@/lib/tv';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const select = tv({
  slots: {
    trigger: 'flex cursor-pointer items-center justify-between gap-gap-sm text-start data-[placeholder]:text-fg-subtle',
    icon: 'shrink-0 text-icon',
    positioner: 'z-(--8341-z-dropdown)',
    popup: [
      'max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto rounded-md border border-border bg-surface p-inset-xs shadow-2',
      'origin-(--transform-origin) transition-[opacity,scale] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
    ],
    item: [
      'flex min-h-target-min cursor-default items-center gap-gap-sm rounded-sm px-inset-sm text-body-md text-fg select-none',
      'data-[highlighted]:bg-key-subtle data-[disabled]:text-fg-disabled',
      'forced-colors:data-[highlighted]:bg-[Highlight] forced-colors:data-[highlighted]:text-[HighlightText]',
    ],
    indicator: 'size-icon-md text-icon-key',
    indicatorSlot: 'inline-flex size-icon-md shrink-0',
  },
});

/** 単一選択・値は文字列（未選択は null）に固定した Base UI の Select.Root の props */
type BaseRootProps = BaseSelect.Root.Props<string | null, false>;

export interface SelectProps extends Omit<
  BaseRootProps,
  'items' | 'children' | 'value' | 'defaultValue' | 'onValueChange' | 'multiple'
> {
  options: SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** 未選択のときの表示（例: 「選択してください」） */
  placeholder?: string;
  size?: ControlSize;
  className?: string;
}

/**
 * 1 つを選ぶ。選択肢が 7 個以上ならこれ、2〜6 個なら RadioGroup を使う（一覧で見せた方が選びやすい）。
 * FormField の中に置くとラベル・エラーと関連付く。
 */
export function Select({ options, placeholder, size, className, required, ...rest }: SelectProps) {
  const field = useFormField();
  const s = select();
  // Base UI の Select は value が null の item を未選択の表示に使う
  const items = [...(placeholder !== undefined ? [{ value: null, label: placeholder }] : []), ...options];
  return (
    <BaseSelect.Root<string | null, false> items={items} required={required ?? field.required} {...rest}>
      <BaseSelect.Trigger className={controlVariants({ size, className: s.trigger({ className }) })}>
        <BaseSelect.Value />
        <BaseSelect.Icon className={s.icon()}>
          <Icon name="chevron-down" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className={s.positioner()} sideOffset={4} alignItemWithTrigger={false}>
          <BaseSelect.Popup className={s.popup()}>
            <BaseSelect.List>
              {options.map((o) => (
                <BaseSelect.Item
                  key={o.value}
                  value={o.value}
                  disabled={o.disabled}
                  className={s.item({ className: focusRing })}
                >
                  <span className={s.indicatorSlot()}>
                    <BaseSelect.ItemIndicator>
                      <Icon name="check" className={s.indicator()} />
                    </BaseSelect.ItemIndicator>
                  </span>
                  <BaseSelect.ItemText>{o.label}</BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
