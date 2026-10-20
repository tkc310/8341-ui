import type { CSSProperties, HTMLAttributes } from 'react';
import { type VariantProps, tv } from '@/lib/tv';

export const skeletonVariants = tv({
  base: [
    'block max-w-full animate-pulse bg-muted motion-reduce:animate-none',
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
  /** 幅。既定は親の幅いっぱい */
  width?: CSSProperties['width'];
  /** 高さ。既定は 1 文字分（1em） */
  height?: CSSProperties['height'];
}

/**
 * 読み込み中に、中身の形だけを先に見せる箱。読み上げには出さない（aria-hidden）ので、
 * 読み込み中であることは Spinner や、待っている領域の aria-busy で別に伝える。
 */
export function Skeleton({ width = '100%', height = '1em', radius, className, style, ...rest }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={skeletonVariants({ radius, className })}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}
