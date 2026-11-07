import type { CSSProperties, HTMLAttributes } from 'react';
import { type VariantProps, tv } from '@/lib/tv';

export const skeletonVariants = tv({
  base: [
    // 既定の大きさ（親の幅いっぱい・1 文字分）はクラスで持つ。style 属性は CSP で止まることがあるため
    'block h-[1em] w-full max-w-full animate-pulse bg-muted motion-reduce:animate-none',
    // 強制カラーでは背景が消えるので、枠線で形を残す
    'forced-colors:border forced-colors:border-[GrayText]',
  ],
  variants: {
    /** 置き換える中身の角丸に合わせる（文字は xs、ボタン・入力欄は md、カードは xl、アイコン・顔写真は full） */
    radius: {
      none: 'rounded-none',
      xs: 'rounded-xs',
      md: 'rounded-md',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
  },
  defaultVariants: { radius: 'xs' },
});

export interface SkeletonProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, VariantProps<typeof skeletonVariants> {
  /** 幅。既定は親の幅いっぱい。指定すると style 属性になるので、CSP で style 属性を止めるなら className（`w-*`）で指定する */
  width?: CSSProperties['width'];
  /** 高さ。既定は 1 文字分（1em）。CSP で style 属性を止めるなら className（`h-*`）で指定する */
  height?: CSSProperties['height'];
}

/**
 * 読み込み中に、中身の形だけを先に見せる箱。読み上げには出さない（aria-hidden）ので、
 * 読み込み中であることは Spinner や、待っている領域の aria-busy で別に伝える。
 */
export function Skeleton({ width, height, radius, className, style, ...rest }: SkeletonProps) {
  // 大きさを指定しないときは style 属性を出さない（CSP の style-src で止まらない）
  const sized = width === undefined && height === undefined ? style : { width, height, ...style };
  return <span aria-hidden="true" className={skeletonVariants({ radius, className })} style={sized} {...rest} />;
}
