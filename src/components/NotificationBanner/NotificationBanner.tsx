import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon/Icon';
import './NotificationBanner.css';

type Tone = 'info' | 'success' | 'warning' | 'danger';

const toneLabel: Record<Tone, string> = {
  info: 'お知らせ',
  success: '完了',
  warning: '注意',
  danger: 'エラー',
};

export interface NotificationBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: Tone;
  title: ReactNode;
  /** 見出しレベル。ページの文書構造に合わせて指定する */
  headingLevel?: 2 | 3 | 4;
  /** 操作ボタン（Button の tertiary / secondary を推奨） */
  actions?: ReactNode;
  /** 指定すると閉じるボタンを表示する */
  onClose?: () => void;
  /**
   * 表示後に動的に挿入される場合のみ true。
   * danger は role="alert"、それ以外は role="status" で読み上げる。
   * ページ読み込み時から表示されているなら false のまま（読み上げが重複するため）。
   */
  live?: boolean;
}

export const NotificationBanner = forwardRef<HTMLDivElement, NotificationBannerProps>(function NotificationBanner(
  { tone = 'info', title, headingLevel = 2, actions, onClose, live = false, className, children, ...rest },
  ref,
) {
  const H = `h${headingLevel}` as const;
  return (
    <div
      ref={ref}
      className={cx('tkc-banner', className)}
      data-tone={tone}
      role={live ? (tone === 'danger' ? 'alert' : 'status') : undefined}
      {...rest}
    >
      <Icon name={tone} size="lg" className="tkc-banner__icon" />
      <div className="tkc-banner__body">
        <H className="tkc-banner__title">
          {/* 色とアイコンだけに頼らず、種別を文字でも伝える */}
          <span className="tkc-visually-hidden">{toneLabel[tone]}: </span>
          {title}
        </H>
        {children && <div className="tkc-banner__content">{children}</div>}
        {actions && <div className="tkc-banner__actions">{actions}</div>}
      </div>
      {onClose && (
        <button type="button" className="tkc-banner__close tkc-focusable" onClick={onClose} aria-label="閉じる">
          <Icon name="close" />
        </button>
      )}
    </div>
  );
});
