import { cnMerge, createTV } from 'tailwind-variants';
import { twMergeConfig } from '@/lib/tw-merge-config';

/**
 * tkc310-ui のテーマ名を登録した tv。コンポーネントは必ずこちらを使う。
 * （tailwind-variants の tv をそのまま使うと `text-fg text-body-md` の文字色が消える）
 */
export const tv = createTV({ twMerge: true, twMergeConfig });

/** クラス名を結合し、競合するユーティリティは後勝ちで 1 つにする */
export const cn = (...classes: Parameters<typeof cnMerge>) => cnMerge(...classes)({ twMerge: true, twMergeConfig });

export type { VariantProps } from 'tailwind-variants';
