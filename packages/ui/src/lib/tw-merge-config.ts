/* このファイルは packages/tokens/scripts/generate-tw-merge.ts が生成します。直接編集しないでください。 */
/**
 * tailwind-variants のクラス統合に登録する tkc310-ui 独自のテーマ名。
 * これが無いと `text-fg text-body-md` の文字色が消えるなど、クラスの競合判定を誤る。
 */
export const twMergeConfig = {
  extend: {
    theme: {
      text: ['display-lg', 'display-md', 'heading-xl', 'heading-lg', 'heading-md', 'heading-sm', 'heading-xs', 'heading-xxs', 'body-lg', 'body-md', 'body-sm', 'dense-md', 'dense-sm', 'label-md', 'label-sm', 'mono-md', 'mono-sm'],
      shadow: ['1', '2', '3'],
      spacing: ['inset-xs', 'inset-sm', 'inset-md', 'inset-lg', 'inset-xl', 'gap-xs', 'gap-sm', 'gap-md', 'stack-sm', 'stack-md', 'stack-lg', 'gutter', 'page-inline', 'control-sm', 'control-md', 'control-lg', 'target-min', 'icon-sm', 'icon-md', 'icon-lg'],
      container: ['content', 'prose'],
      radius: ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'full'],
    },
  },
} as const;
