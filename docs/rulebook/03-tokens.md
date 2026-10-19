# 03 トークン

## 流れ

```
packages/tokens/src/palette.config.json ─(pnpm --filter 8341-ui-tokens palette)─▶ src/primitive/color.tokens.json
packages/tokens/src/8341-ui.resolver.json（DTCG Resolver: primitive → semantic → theme）
        │
        ├─(build: Style Dictionary v5)─▶ dist/css/tokens.css     … --8341-* の CSS 変数（light / dark / OS 追従）
        │                              ▶ dist/css/tailwind.css   … Tailwind v4 の @theme inline（bg-key・text-fg など）
        │                              ▶ dist/tokens.json        … テーマ別の解決済みトークン（Storybook・エージェント用）
        ├─(figma)──────────────────────▶ dist/figma/*.tokens.json … Figma Variables に取り込む DTCG JSON
        ├─(design-md)──────────────────▶ DESIGN.md の自動生成ブロック
        └─(tw-merge)───────────────────▶ packages/ui/src/lib/tw-merge-config.ts
```

| 層        | 例                                                                   | 誰が参照するか                                  |
| --------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| Primitive | `color.primitive.indigo.700`、`dimension.16`、`font.size.16`         | semantic トークンだけ                           |
| Semantic  | `color.text.subtle`、`space.stack-md`、`text.body-md.*`、`radius.md` | コンポーネント、アプリ（Tailwind のクラス経由） |
| Component | Tailwind のクラスと `tv()` のバリアント                              | そのコンポーネントだけ                          |

**必須**: コンポーネントとアプリは semantic トークンの Tailwind クラスだけを使う。任意値での色・3px を超える px の直書き、Tailwind 既定のパレット、primitive カラーの参照は `pnpm --filter 8341-ui check`（クラス監査）が error にする。

## 形式（W3C DTCG 2025.10）

- ファイルは `*.tokens.json`。`$schema` に `https://www.designtokens.org/schemas/2025.10/format.json` を書く
- 色は色オブジェクト: `{ "colorSpace": "oklch", "components": [L, C, H], "hex": "#..." }`。`hex` は sRGB の代替値で、コントラスト検査と Figma 書き出しに使う
- dimension は `{ "value": 16, "unit": "px" }`、duration は `{ "value": 120, "unit": "ms" }`
- 参照は `"{color.primitive.indigo.700}"`
- テーマは Resolver 文書（`8341-ui.resolver.json`）の modifier `theme` で表す。light と dark で semantic カラーのキーを完全に一致させる（CI で検証）

DTCG の仕様から外している点と理由は [ADR-0009](../decisions/0009-dtcg-representation.md) にまとめている。

- 字間は `number`（文字サイズに対する比率）で持つ。dimension は px と rem しか許さず、em を表せないため
- テキストスタイルは typography 複合型ではなく、`text.{スタイル}.font-size` などの個別トークンで持つ（同じ理由）
- Style Dictionary v5 は Resolver に未対応のため、`scripts/lib/tokens.ts` が Resolver 文書を読み、どのファイルをどの順に渡すかを決める

## 命名と Tailwind のクラス名

| トークン                         | Tailwind の変数                            | クラスの例                                            |
| -------------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| `color.bg.{name}`                | `--color-{name}`                           | `bg-canvas`、`bg-key`、`bg-danger-subtle`             |
| `color.text.default` / `.{name}` | `--color-fg` / `--color-fg-{name}`         | `text-fg`、`text-fg-subtle`、`text-fg-on-key`         |
| `color.icon.{name}`              | `--color-icon[-{name}]`                    | `text-icon`、`text-icon-danger`                       |
| `color.border.{name}`            | `--color-border[-{name}]`                  | `border-border`、`border-border-input`                |
| `color.focus.{name}`             | `--color-focus-{name}`                     | `outline-focus-outline`（通常は `focus-ring` を使う） |
| `space.{name}`                   | `--spacing-{name}`                         | `p-inset-md`、`gap-stack-md`                          |
| `size.control-*` など            | `--spacing-*`                              | `h-control-md`、`size-icon-md`、`min-h-target-min`    |
| `size.content-max` / `prose-max` | `--container-content` / `prose`            | `max-w-content`、`max-w-prose`                        |
| `radius.{name}`                  | `--radius-{name}`                          | `rounded-md`                                          |
| `shadow.{n}`                     | `--shadow-{n}`                             | `shadow-1`                                            |
| `text.{style}.*`                 | `--text-{style}`（行間・字間・太さを含む） | `text-body-md`、`text-heading-lg`                     |
| `breakpoint.md`                  | `--breakpoint-md`（値をそのまま）          | `md:`                                                 |

- CSS 変数そのものは `--8341-{パス}`（例: `--8341-color-text-default`）
- Tailwind 既定の色・文字サイズ・角丸・影・ブレークポイントは `@theme` で消している。数値の余白（`p-4`）は残している
- **任意値と手書き CSS では `var(--8341-*)` を参照する**。`@theme inline` は使われたテーマ変数しか出力しないため、`var(--color-*)` は未定義になりうる（クラス監査で error）

## カラー

全色相で **OKLCH の明度カーブを共有** している（`palette.config.json` の `lightness`）。段階番号がそのままコントラストの目安になる。

| 段階       | 白背景とのコントラスト | 主な用途                         |
| ---------- | ---------------------- | -------------------------------- |
| 50〜200    | 1.1〜1.4               | 薄い面（`bg-*-subtle`）          |
| 300〜400   | 1.8〜2.4               | ダークテーマの文字・キー         |
| 600        | 約 4.5                 | 境界（3:1 以上）                 |
| 700        | 約 6                   | ライトのキー背景・アイコン       |
| 800        | 約 8                   | ライトの文字色（リンク・エラー） |
| 1000〜1200 | 13〜17                 | 本文・ダークの面                 |

色相を変えるときは `palette.config.json` の `hue` を変え、`palette` → `build` → `check:contrast` の順に実行する。

### 新しい semantic カラーを足すとき

1. `semantic/light.tokens.json` と `semantic/dark.tokens.json` の **両方** に同じキーで追加する
2. `src/contrast.rules.json` に、そのトークンが置かれうる組み合わせを追加する
3. 用途を `$description` に書く（DESIGN.md・Storybook・Figma に反映される）
4. `pnpm --filter 8341-ui-tokens build && pnpm check`

## タイポグラフィ・余白・サイズ・角丸

| 種類             | クラス                                                                                                | ルール                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 文字             | `text-display-*` / `text-heading-*` / `text-body-*` / `text-dense-*` / `text-label-*` / `text-mono-*` | 最小 14px。太さは 400 / 700 のみ                            |
| レイアウト余白   | `gap-stack-sm / md / lg`（8 / 24 / 64）                                                               | 3 段階のみ。要素の関係の近さで選ぶ                          |
| 部品内の余白     | `p-inset-*`、`gap-gap-*`                                                                              | 4px 刻み                                                    |
| コントロール高さ | `h-control-sm / md / lg`（36 / 44 / 52）                                                              | md が既定。sm は `tap-target` でタップ領域 44px             |
| 角丸             | `rounded-xs`〜`rounded-xl`、`rounded-full`                                                            | 横長の要素ほど小さく。カード xl、バナー lg、ボタン・入力 md |
| 影               | `shadow-1〜3`                                                                                         | ボタンには使わない。浮いている物だけ                        |

## Figma

`pnpm --filter 8341-ui-tokens figma` で `dist/figma/` に書き出し、Figma の Variables 画面に取り込む。

- `primitives.tokens.json` → 「Primitives」コレクション（モード 1 つ）
- `light.tokens.json` と `dark.tokens.json` を同時にドラッグ＆ドロップ → 「Semantic」コレクション（Light / Dark の 2 モード）

Figma の制約に合わせて、色は srgb、寸法は px、フォントは単一の文字列で書き出す。複合型（影・字間・テキストスタイル）は取り込めないため書き出さない。semantic は別名ではなく解決済みの値で書き出す（コレクションをまたぐ別名には Figma 固有の ID が要るため）。
