/** このファイルは scripts/build-tokens.ts が生成します。直接編集しないでください。
 */

export const tokenPrefix = 'tkc' as const;

/** semantic トークン名 */
export type SemanticToken =
  | 'text.display-lg'
  | 'text.display-md'
  | 'text.heading-xl'
  | 'text.heading-lg'
  | 'text.heading-md'
  | 'text.heading-sm'
  | 'text.heading-xs'
  | 'text.heading-xxs'
  | 'text.body-lg'
  | 'text.body-md'
  | 'text.body-sm'
  | 'text.dense-md'
  | 'text.dense-sm'
  | 'text.label-md'
  | 'text.label-sm'
  | 'text.mono-md'
  | 'text.mono-sm'
  | 'space.inset-xs'
  | 'space.inset-sm'
  | 'space.inset-md'
  | 'space.inset-lg'
  | 'space.inset-xl'
  | 'space.gap-xs'
  | 'space.gap-sm'
  | 'space.gap-md'
  | 'space.stack-sm'
  | 'space.stack-md'
  | 'space.stack-lg'
  | 'space.gutter'
  | 'space.page-inline'
  | 'radius.none'
  | 'radius.xs'
  | 'radius.sm'
  | 'radius.md'
  | 'radius.lg'
  | 'radius.xl'
  | 'radius.full'
  | 'size.control-sm'
  | 'size.control-md'
  | 'size.control-lg'
  | 'size.target-min'
  | 'size.icon-sm'
  | 'size.icon-md'
  | 'size.icon-lg'
  | 'size.content-max'
  | 'size.prose-max'
  | 'border-width.default'
  | 'border-width.strong'
  | 'border-width.accent'
  | 'border-width.underline'
  | 'border-width.underline-hover'
  | 'focus.outline-width'
  | 'focus.ring-width'
  | 'focus.offset'
  | 'motion.duration-fast'
  | 'motion.duration-base'
  | 'motion.duration-slow'
  | 'motion.easing-standard'
  | 'motion.easing-enter'
  | 'motion.easing-exit'
  | 'z.dropdown'
  | 'z.sticky'
  | 'z.overlay'
  | 'z.modal'
  | 'z.toast'
  | 'color.bg.canvas'
  | 'color.bg.surface'
  | 'color.bg.subtle'
  | 'color.bg.muted'
  | 'color.bg.inverse'
  | 'color.bg.disabled'
  | 'color.bg.key'
  | 'color.bg.key-hover'
  | 'color.bg.key-active'
  | 'color.bg.key-subtle'
  | 'color.bg.key-subtle-hover'
  | 'color.bg.danger'
  | 'color.bg.danger-hover'
  | 'color.bg.danger-active'
  | 'color.bg.danger-subtle'
  | 'color.bg.success-subtle'
  | 'color.bg.warning-subtle'
  | 'color.bg.info-subtle'
  | 'color.bg.overlay'
  | 'color.text.default'
  | 'color.text.subtle'
  | 'color.text.disabled'
  | 'color.text.inverse'
  | 'color.text.key'
  | 'color.text.on-key'
  | 'color.text.danger'
  | 'color.text.success'
  | 'color.text.warning'
  | 'color.text.link'
  | 'color.text.link-hover'
  | 'color.text.link-visited'
  | 'color.text.link-active'
  | 'color.icon.default'
  | 'color.icon.subtle'
  | 'color.icon.key'
  | 'color.icon.danger'
  | 'color.icon.success'
  | 'color.icon.warning'
  | 'color.icon.info'
  | 'color.border.subtle'
  | 'color.border.default'
  | 'color.border.input'
  | 'color.border.strong'
  | 'color.border.key'
  | 'color.border.danger'
  | 'color.border.success'
  | 'color.border.warning'
  | 'color.border.disabled'
  | 'color.focus.ring'
  | 'color.focus.outline'
  | 'color.focus.text'
  | 'shadow.1'
  | 'shadow.2'
  | 'shadow.3';

/** トークン名から CSS 変数参照を返す。例: cssVar('color.text.default') → 'var(--tkc-color-text-default)' */
export const cssVar = (name: SemanticToken): string =>
  `var(--${tokenPrefix}-${name.replace(/\./g, '-')})`;

/** 解決済みの値（ライト / ダーク） */
export const tokens = {
  "light": {
    "text.display-lg": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "56px",
      "fontWeight": 700,
      "lineHeight": 1.4,
      "letterSpacing": "0em"
    },
    "text.display-md": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "44px",
      "fontWeight": 700,
      "lineHeight": 1.4,
      "letterSpacing": "0em"
    },
    "text.heading-xl": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "36px",
      "fontWeight": 700,
      "lineHeight": 1.4,
      "letterSpacing": "0.01em"
    },
    "text.heading-lg": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "32px",
      "fontWeight": 700,
      "lineHeight": 1.5,
      "letterSpacing": "0.01em"
    },
    "text.heading-md": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "28px",
      "fontWeight": 700,
      "lineHeight": 1.5,
      "letterSpacing": "0.01em"
    },
    "text.heading-sm": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "24px",
      "fontWeight": 700,
      "lineHeight": 1.5,
      "letterSpacing": "0.02em"
    },
    "text.heading-xs": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "20px",
      "fontWeight": 700,
      "lineHeight": 1.5,
      "letterSpacing": "0.02em"
    },
    "text.heading-xxs": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "18px",
      "fontWeight": 700,
      "lineHeight": 1.6,
      "letterSpacing": "0.02em"
    },
    "text.body-lg": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "18px",
      "fontWeight": 400,
      "lineHeight": 1.7,
      "letterSpacing": "0.02em"
    },
    "text.body-md": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "16px",
      "fontWeight": 400,
      "lineHeight": 1.7,
      "letterSpacing": "0.02em"
    },
    "text.body-sm": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "14px",
      "fontWeight": 400,
      "lineHeight": 1.7,
      "letterSpacing": "0.02em"
    },
    "text.dense-md": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "16px",
      "fontWeight": 400,
      "lineHeight": 1.3,
      "letterSpacing": "0.02em"
    },
    "text.dense-sm": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "14px",
      "fontWeight": 400,
      "lineHeight": 1.3,
      "letterSpacing": "0.02em"
    },
    "text.label-md": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "16px",
      "fontWeight": 700,
      "lineHeight": 1,
      "letterSpacing": "0.02em"
    },
    "text.label-sm": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "14px",
      "fontWeight": 700,
      "lineHeight": 1,
      "letterSpacing": "0.02em"
    },
    "text.mono-md": {
      "fontFamily": [
        "Noto Sans Mono",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "monospace"
      ],
      "fontSize": "16px",
      "fontWeight": 400,
      "lineHeight": 1.5,
      "letterSpacing": "0em"
    },
    "text.mono-sm": {
      "fontFamily": [
        "Noto Sans Mono",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "monospace"
      ],
      "fontSize": "14px",
      "fontWeight": 400,
      "lineHeight": 1.5,
      "letterSpacing": "0em"
    },
    "space.inset-xs": "4px",
    "space.inset-sm": "8px",
    "space.inset-md": "12px",
    "space.inset-lg": "16px",
    "space.inset-xl": "24px",
    "space.gap-xs": "4px",
    "space.gap-sm": "8px",
    "space.gap-md": "16px",
    "space.stack-sm": "8px",
    "space.stack-md": "24px",
    "space.stack-lg": "64px",
    "space.gutter": "32px",
    "space.page-inline": "16px",
    "radius.none": "0px",
    "radius.xs": "4px",
    "radius.sm": "6px",
    "radius.md": "8px",
    "radius.lg": "12px",
    "radius.xl": "16px",
    "radius.full": "9999px",
    "size.control-sm": "36px",
    "size.control-md": "44px",
    "size.control-lg": "52px",
    "size.target-min": "44px",
    "size.icon-sm": "16px",
    "size.icon-md": "20px",
    "size.icon-lg": "24px",
    "size.content-max": "1200px",
    "size.prose-max": "720px",
    "border-width.default": "1px",
    "border-width.strong": "2px",
    "border-width.accent": "4px",
    "border-width.underline": "1px",
    "border-width.underline-hover": "3px",
    "focus.outline-width": "2px",
    "focus.ring-width": "4px",
    "focus.offset": "2px",
    "motion.duration-fast": "120ms",
    "motion.duration-base": "200ms",
    "motion.duration-slow": "320ms",
    "motion.easing-standard": [
      0.2,
      0,
      0,
      1
    ],
    "motion.easing-enter": [
      0,
      0,
      0,
      1
    ],
    "motion.easing-exit": [
      0.3,
      0,
      1,
      1
    ],
    "z.dropdown": 100,
    "z.sticky": 200,
    "z.overlay": 300,
    "z.modal": 400,
    "z.toast": 500,
    "color.bg.canvas": "#ffffff",
    "color.bg.surface": "#ffffff",
    "color.bg.subtle": "#f6f7f7",
    "color.bg.muted": "#ecedee",
    "color.bg.inverse": "#252629",
    "color.bg.disabled": "#ecedee",
    "color.bg.key": "#385db8",
    "color.bg.key-hover": "#2d4c9c",
    "color.bg.key-active": "#223d81",
    "color.bg.key-subtle": "#e4edff",
    "color.bg.key-subtle-hover": "#cadbfe",
    "color.bg.danger": "#b61b25",
    "color.bg.danger-hover": "#9a101c",
    "color.bg.danger-active": "#800613",
    "color.bg.danger-subtle": "#fef4f3",
    "color.bg.success-subtle": "#edfbf1",
    "color.bg.warning-subtle": "#fffcf3",
    "color.bg.info-subtle": "#f3f7fe",
    "color.bg.overlay": "rgba(10, 12, 20, 0.48)",
    "color.text.default": "#252629",
    "color.text.subtle": "#616369",
    "color.text.disabled": "#8c8f95",
    "color.text.inverse": "#f6f7f7",
    "color.text.key": "#2d4c9c",
    "color.text.on-key": "#ffffff",
    "color.text.danger": "#9a101c",
    "color.text.success": "#016337",
    "color.text.warning": "#833b02",
    "color.text.link": "#2d4c9c",
    "color.text.link-hover": "#192f65",
    "color.text.link-visited": "#5f3c91",
    "color.text.link-active": "#833b02",
    "color.icon.default": "#313336",
    "color.icon.subtle": "#616369",
    "color.icon.key": "#385db8",
    "color.icon.danger": "#b61b25",
    "color.icon.success": "#037743",
    "color.icon.warning": "#7f6404",
    "color.icon.info": "#385db8",
    "color.border.subtle": "#d9dbdd",
    "color.border.default": "#8c8f95",
    "color.border.input": "#75777d",
    "color.border.strong": "#404246",
    "color.border.key": "#385db8",
    "color.border.danger": "#b61b25",
    "color.border.success": "#037743",
    "color.border.warning": "#977806",
    "color.border.disabled": "#c2c4c8",
    "color.focus.ring": "#e7c567",
    "color.focus.outline": "#1a1b1d",
    "color.focus.text": "#1a1b1d",
    "shadow.1": "0 1px 2px 0 rgba(16, 24, 48, 0.12), 0 1px 3px 1px rgba(16, 24, 48, 0.08)",
    "shadow.2": "0 2px 6px 0 rgba(16, 24, 48, 0.14), 0 4px 12px 2px rgba(16, 24, 48, 0.08)",
    "shadow.3": "0 6px 16px 0 rgba(16, 24, 48, 0.16), 0 12px 32px 4px rgba(16, 24, 48, 0.10)"
  },
  "dark": {
    "text.display-lg": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "56px",
      "fontWeight": 700,
      "lineHeight": 1.4,
      "letterSpacing": "0em"
    },
    "text.display-md": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "44px",
      "fontWeight": 700,
      "lineHeight": 1.4,
      "letterSpacing": "0em"
    },
    "text.heading-xl": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "36px",
      "fontWeight": 700,
      "lineHeight": 1.4,
      "letterSpacing": "0.01em"
    },
    "text.heading-lg": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "32px",
      "fontWeight": 700,
      "lineHeight": 1.5,
      "letterSpacing": "0.01em"
    },
    "text.heading-md": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "28px",
      "fontWeight": 700,
      "lineHeight": 1.5,
      "letterSpacing": "0.01em"
    },
    "text.heading-sm": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "24px",
      "fontWeight": 700,
      "lineHeight": 1.5,
      "letterSpacing": "0.02em"
    },
    "text.heading-xs": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "20px",
      "fontWeight": 700,
      "lineHeight": 1.5,
      "letterSpacing": "0.02em"
    },
    "text.heading-xxs": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "18px",
      "fontWeight": 700,
      "lineHeight": 1.6,
      "letterSpacing": "0.02em"
    },
    "text.body-lg": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "18px",
      "fontWeight": 400,
      "lineHeight": 1.7,
      "letterSpacing": "0.02em"
    },
    "text.body-md": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "16px",
      "fontWeight": 400,
      "lineHeight": 1.7,
      "letterSpacing": "0.02em"
    },
    "text.body-sm": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "14px",
      "fontWeight": 400,
      "lineHeight": 1.7,
      "letterSpacing": "0.02em"
    },
    "text.dense-md": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "16px",
      "fontWeight": 400,
      "lineHeight": 1.3,
      "letterSpacing": "0.02em"
    },
    "text.dense-sm": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "14px",
      "fontWeight": 400,
      "lineHeight": 1.3,
      "letterSpacing": "0.02em"
    },
    "text.label-md": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "16px",
      "fontWeight": 700,
      "lineHeight": 1,
      "letterSpacing": "0.02em"
    },
    "text.label-sm": {
      "fontFamily": [
        "Noto Sans JP",
        "-apple-system",
        "BlinkMacSystemFont",
        "Hiragino Sans",
        "sans-serif"
      ],
      "fontSize": "14px",
      "fontWeight": 700,
      "lineHeight": 1,
      "letterSpacing": "0.02em"
    },
    "text.mono-md": {
      "fontFamily": [
        "Noto Sans Mono",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "monospace"
      ],
      "fontSize": "16px",
      "fontWeight": 400,
      "lineHeight": 1.5,
      "letterSpacing": "0em"
    },
    "text.mono-sm": {
      "fontFamily": [
        "Noto Sans Mono",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "monospace"
      ],
      "fontSize": "14px",
      "fontWeight": 400,
      "lineHeight": 1.5,
      "letterSpacing": "0em"
    },
    "space.inset-xs": "4px",
    "space.inset-sm": "8px",
    "space.inset-md": "12px",
    "space.inset-lg": "16px",
    "space.inset-xl": "24px",
    "space.gap-xs": "4px",
    "space.gap-sm": "8px",
    "space.gap-md": "16px",
    "space.stack-sm": "8px",
    "space.stack-md": "24px",
    "space.stack-lg": "64px",
    "space.gutter": "32px",
    "space.page-inline": "16px",
    "radius.none": "0px",
    "radius.xs": "4px",
    "radius.sm": "6px",
    "radius.md": "8px",
    "radius.lg": "12px",
    "radius.xl": "16px",
    "radius.full": "9999px",
    "size.control-sm": "36px",
    "size.control-md": "44px",
    "size.control-lg": "52px",
    "size.target-min": "44px",
    "size.icon-sm": "16px",
    "size.icon-md": "20px",
    "size.icon-lg": "24px",
    "size.content-max": "1200px",
    "size.prose-max": "720px",
    "border-width.default": "1px",
    "border-width.strong": "2px",
    "border-width.accent": "4px",
    "border-width.underline": "1px",
    "border-width.underline-hover": "3px",
    "focus.outline-width": "2px",
    "focus.ring-width": "4px",
    "focus.offset": "2px",
    "motion.duration-fast": "120ms",
    "motion.duration-base": "200ms",
    "motion.duration-slow": "320ms",
    "motion.easing-standard": [
      0.2,
      0,
      0,
      1
    ],
    "motion.easing-enter": [
      0,
      0,
      0,
      1
    ],
    "motion.easing-exit": [
      0.3,
      0,
      1,
      1
    ],
    "z.dropdown": 100,
    "z.sticky": 200,
    "z.overlay": 300,
    "z.modal": 400,
    "z.toast": 500,
    "color.bg.canvas": "#1a1b1d",
    "color.bg.surface": "#252629",
    "color.bg.subtle": "#252629",
    "color.bg.muted": "#313336",
    "color.bg.inverse": "#f6f7f7",
    "color.bg.disabled": "#313336",
    "color.bg.key": "#a8c4fe",
    "color.bg.key-hover": "#cadbfe",
    "color.bg.key-active": "#e4edff",
    "color.bg.key-subtle": "#11234f",
    "color.bg.key-subtle-hover": "#192f65",
    "color.bg.danger": "#feaba4",
    "color.bg.danger-hover": "#ffcdc8",
    "color.bg.danger-active": "#fee7e4",
    "color.bg.danger-subtle": "#3a0104",
    "color.bg.success-subtle": "#00220f",
    "color.bg.warning-subtle": "#271d00",
    "color.bg.info-subtle": "#0a183b",
    "color.bg.overlay": "rgba(0, 0, 0, 0.64)",
    "color.text.default": "#f6f7f7",
    "color.text.subtle": "#c2c4c8",
    "color.text.disabled": "#75777d",
    "color.text.inverse": "#252629",
    "color.text.key": "#a8c4fe",
    "color.text.on-key": "#0a183b",
    "color.text.danger": "#feaba4",
    "color.text.success": "#91d7a9",
    "color.text.warning": "#e7c567",
    "color.text.link": "#a8c4fe",
    "color.text.link-hover": "#cadbfe",
    "color.text.link-visited": "#ceb6fc",
    "color.text.link-active": "#feaf82",
    "color.icon.default": "#ecedee",
    "color.icon.subtle": "#c2c4c8",
    "color.icon.key": "#a8c4fe",
    "color.icon.danger": "#feaba4",
    "color.icon.success": "#91d7a9",
    "color.icon.warning": "#e7c567",
    "color.icon.info": "#a8c4fe",
    "color.border.subtle": "#313336",
    "color.border.default": "#75777d",
    "color.border.input": "#8c8f95",
    "color.border.strong": "#d9dbdd",
    "color.border.key": "#a8c4fe",
    "color.border.danger": "#fe7f77",
    "color.border.success": "#64c288",
    "color.border.warning": "#d5aa02",
    "color.border.disabled": "#404246",
    "color.focus.ring": "#e7c567",
    "color.focus.outline": "#f6f7f7",
    "color.focus.text": "#1a1b1d",
    "shadow.1": "0 1px 2px 0 rgba(0, 0, 0, 0.48), 0 1px 3px 1px rgba(0, 0, 0, 0.32)",
    "shadow.2": "0 2px 6px 0 rgba(0, 0, 0, 0.52), 0 4px 12px 2px rgba(0, 0, 0, 0.36)",
    "shadow.3": "0 6px 16px 0 rgba(0, 0, 0, 0.56), 0 12px 32px 4px rgba(0, 0, 0, 0.40)"
  }
} as const;
