import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ComponentProps, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon/index';
import { focusRing } from '@/lib/focus';
import { type VariantProps, tv } from '@/lib/tv';

/**
 * トラックの寸法はつまみの大きさ（--switch-thumb）と余白（--switch-pad）から決める。
 * 幅 = つまみ 2 個分 + 余白 + 枠線。オンでつまみ 1 個分だけ動く。
 */
export const switchVariants = tv({
  slots: {
    label: [
      'grid w-fit cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-x-gap-sm text-fg',
      // ラベル全体がタップ領域になる。トラックの見た目は 44px 未満でも行の高さで 44px を確保する
      'min-h-target-min',
      'has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:text-fg-disabled',
    ],
    track: [
      'group/switch relative inline-flex shrink-0 items-center rounded-full border-2 p-(--switch-pad)',
      'w-[calc(var(--switch-thumb)*2+var(--switch-pad)*2+var(--8341-border-width-strong)*2)]',
      'border-border-input bg-surface transition-colors',
      'hover:not-data-[disabled]:border-border-strong hover:not-data-[disabled]:bg-muted',
      'data-[checked]:border-key data-[checked]:bg-key',
      'data-[checked]:hover:not-data-[disabled]:border-key-hover data-[checked]:hover:not-data-[disabled]:bg-key-hover',
      'data-[invalid]:border-border-danger',
      'data-[disabled]:border-border-disabled data-[disabled]:bg-disabled',
      'data-[disabled]:data-[checked]:border-border-disabled data-[disabled]:data-[checked]:bg-disabled',
      focusRing,
      'forced-colors:border-[ButtonText] forced-colors:data-[checked]:border-[Highlight] forced-colors:data-[disabled]:border-[GrayText]',
    ],
    thumb: [
      'grid size-(--switch-thumb) place-items-center rounded-full transition-[translate,background-color]',
      'bg-(--8341-color-border-input) group-hover/switch:not-data-[disabled]:bg-(--8341-color-border-strong)',
      // オンでは白抜きのつまみにチェックを出す（色だけで状態を伝えない）
      'data-[checked]:translate-x-(--switch-thumb) rtl:data-[checked]:-translate-x-(--switch-thumb)',
      'data-[checked]:bg-surface group-hover/switch:data-[checked]:not-data-[disabled]:bg-surface',
      'data-[disabled]:bg-(--8341-color-text-disabled) data-[disabled]:data-[checked]:bg-(--8341-color-text-disabled)',
      'forced-colors:bg-[ButtonText] forced-colors:data-[checked]:bg-[Highlight] forced-colors:data-[disabled]:bg-[GrayText]',
    ],
    icon: [
      'hidden size-[75%] stroke-3 text-icon-key group-data-[checked]/switch:block',
      'group-data-[disabled]/switch:text-(--8341-color-bg-disabled) forced-colors:text-[Canvas]',
    ],
    text: 'col-start-2',
    description: 'col-start-2 text-body-sm text-fg-subtle',
  },
  variants: {
    size: {
      md: {
        label: 'text-body-md [--switch-pad:var(--8341-space-inset-xs)] [--switch-thumb:var(--8341-size-icon-lg)]',
      },
      sm: {
        label: 'text-body-sm [--switch-pad:var(--8341-border-width-strong)] [--switch-thumb:var(--8341-size-icon-sm)]',
      },
    },
  },
  defaultVariants: { size: 'md' },
});

export interface SwitchProps
  extends
    Omit<ComponentProps<typeof BaseSwitch.Root>, 'className' | 'children' | 'render'>,
    VariantProps<typeof switchVariants> {
  /** ラベルは必須。ラベル全体がクリック領域になる */
  label: ReactNode;
  /** ラベル下の補足 */
  description?: ReactNode;
  className?: string;
}

/**
 * オン / オフを切り替えるスイッチ（Base UI の Switch）。押した瞬間に設定が反映されるものに使う。
 * 送信して初めて反映される選択（同意など）は Checkbox を使う。
 */
export function Switch({ label, description, size, className, ...rest }: SwitchProps) {
  const s = switchVariants({ size });
  return (
    <label className={s.label({ className })}>
      <BaseSwitch.Root className={s.track()} {...rest}>
        <BaseSwitch.Thumb className={s.thumb()}>
          <Icon name="check" size="inherit" className={s.icon()} />
        </BaseSwitch.Thumb>
      </BaseSwitch.Root>
      <span className={s.text()}>{label}</span>
      {description && <span className={s.description()}>{description}</span>}
    </label>
  );
}
