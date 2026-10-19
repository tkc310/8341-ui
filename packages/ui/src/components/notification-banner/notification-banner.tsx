import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '@/components/ui/icon';
import { focusRing } from '@/lib/focus';
import { type VariantProps, tv } from '@/lib/tv';

const toneLabel = { info: 'お知らせ', success: '完了', warning: '注意', danger: 'エラー' } as const;

export const notificationBannerVariants = tv({
  slots: {
    root: [
      'flex items-start gap-gap-md rounded-lg border p-inset-lg ps-[calc(var(--8341-space-inset-lg)+var(--8341-border-width-accent))] text-fg',
      // 左の太線は内側の影で描く（角丸と両立させるため）。強制カラーでは影が消えるので線で補う
      'shadow-[inset_var(--8341-border-width-accent)_0_0_0_var(--banner-accent)] forced-colors:border-s-4',
    ],
    icon: 'mt-[calc((var(--8341-text-heading-xxs-font-size)*var(--8341-text-heading-xxs-line-height)-var(--8341-size-icon-lg))/2)] text-(color:--banner-icon)',
    body: 'flex min-w-0 flex-1 flex-col gap-stack-sm',
    title: 'm-0 text-heading-xxs',
    content: '[&>p]:m-0',
    actions: 'flex flex-wrap gap-gap-sm',
    close: [
      'tap-target -m-inset-md inline-grid size-target-min shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 text-icon hover:bg-muted',
      focusRing,
    ],
  },
  variants: {
    tone: {
      info: {
        root: 'border-border-key bg-info-subtle [--banner-accent:var(--8341-color-border-key)] [--banner-icon:var(--8341-color-icon-info)]',
      },
      success: {
        root: 'border-border-success bg-success-subtle [--banner-accent:var(--8341-color-border-success)] [--banner-icon:var(--8341-color-icon-success)]',
      },
      warning: {
        root: 'border-border-warning bg-warning-subtle [--banner-accent:var(--8341-color-border-warning)] [--banner-icon:var(--8341-color-icon-warning)]',
      },
      danger: {
        root: 'border-border-danger bg-danger-subtle [--banner-accent:var(--8341-color-border-danger)] [--banner-icon:var(--8341-color-icon-danger)]',
      },
    },
  },
  defaultVariants: { tone: 'info' },
});

export interface NotificationBannerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof notificationBannerVariants> {
  title: ReactNode;
  /** 見出しレベル。ページの文書構造に合わせて指定する */
  headingLevel?: 2 | 3 | 4;
  /** 操作ボタン（Button の secondary / tertiary を推奨） */
  actions?: ReactNode;
  /** 指定すると閉じるボタンを表示する */
  onClose?: () => void;
  /**
   * 表示後に動的に挿入される場合だけ true。danger は role="alert"、それ以外は role="status" で読み上げる。
   * ページを開いた時点から表示されているなら false のまま（読み上げが重複するため）。
   */
  live?: boolean;
}

/** 状態を伝えるバナー。色・アイコン・文言（読み上げ用の種別名）を併用する。 */
export function NotificationBanner({
  tone = 'info',
  title,
  headingLevel = 2,
  actions,
  onClose,
  live = false,
  className,
  children,
  ...rest
}: NotificationBannerProps) {
  const H = `h${headingLevel}` as const;
  const s = notificationBannerVariants({ tone });
  return (
    <div className={s.root({ className })} role={live ? (tone === 'danger' ? 'alert' : 'status') : undefined} {...rest}>
      <Icon name={tone} size="lg" className={s.icon()} />
      <div className={s.body()}>
        <H className={s.title()}>
          {/* 色とアイコンだけに頼らず、種別を文字でも伝える */}
          <span className="sr-only">{toneLabel[tone]}: </span>
          {title}
        </H>
        {children && <div className={s.content()}>{children}</div>}
        {actions && <div className={s.actions()}>{actions}</div>}
      </div>
      {onClose && (
        <button type="button" className={s.close()} onClick={onClose} aria-label="閉じる">
          <Icon name="close" />
        </button>
      )}
    </div>
  );
}
