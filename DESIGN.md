# DESIGN.md — 8341-ui

> AI エージェントがこのデザインシステムに沿った日本語 UI を生成・修正するための仕様書です。
> `<!-- auto:* -->` で囲まれた表は `make design-md` がトークンとコンポーネントから自動生成します（手で編集しない）。
> 詳しいルールと理由は `docs/rulebook/`、設計判断は `docs/decisions/` を参照してください。

| 項目 | 内容 |
| --- | --- |
| パッケージ | `8341-ui`（コンポーネント）、`8341-ui-tokens`（トークン） |
| ヘッドレス UI | Base UI v1（`@base-ui/react`） |
| スタイリング | Tailwind CSS v4 + CSS 変数（`--8341-*`）。バリアントは tailwind-variants v3 |
| 配布 | shadcn 方式（レジストリ `@8341`、`registry:base` で Base UI を固定）と npm パッケージ |
| トークン | W3C DTCG 2025.10 → Style Dictionary v5 |
| 準拠 | WCAG 2.2 AA / JIS X 8341-3:2016 |

---

## 0. 位置づけと採用したルール

- **基盤のデザインシステム**: 特定のプロダクトに属さず、複数のプロダクトで使い回す
- **画面設計のルール**: [design-principles](./docs/design-principles/README.md) を採用する。適用順は UI の方向性 → サービス別の特化ルール → 原則 → WCAG 2.2
- **UI の方向性とサービス種別**: 基盤では決めない。各プロダクトの DESIGN.md で決める（`npx shadcn@latest add @8341/design-md` で置く。雛形は `templates/PRODUCT-DESIGN.md`）
- **原則とトークン・コンポーネントの対応**: `docs/rulebook/01-principles.md`
- **必須ルールを外した項目**: なし。タップ領域 44px、文字のコントラストを一律 4.5:1、リンクの下線必須、二重のフォーカス線は、design-principles の必須より厳しくしている

## 1. Visual Theme & Atmosphere

- **キーワード**: 静か・明快・誠実。装飾を控え、文字と情報を主役にする
- **キーカラー**: 藍（OKLCH hue 265）。落ち着いた青紫
- **密度**: 本文 16px・行間 1.7。コントロールの標準高さ 44px（= 最小タップ領域）
- **テーマ**: ライト / ダーク。`<html class="dark">` または `<html data-theme="dark">`。どちらも無ければ OS の設定に従う
- **奥行き**: 面の差は背景色と罫線で表す。影は浮いている物（メニュー・ポップアップ）にだけ使う

## 2. Color Palette & Roles

### 使い方の原則

- **semantic トークンの Tailwind クラスだけを使う**: 面は `bg-*`、文字は `text-fg-*`、アイコンは `text-icon-*`、線は `border-border-*`
- Tailwind 既定のパレット（`text-gray-500`、`bg-blue-600` など）はテーマで消してあり、**効かない**
- 任意値（`bg-[...]`）で色を書かない。手書きの CSS や任意値でトークンが必要なら `var(--8341-*)` を参照する（`--color-*` などの Tailwind のテーマ変数は、使われたものしか出力されないため参照しない）
- すべての組み合わせは `packages/tokens/src/contrast.rules.json` で両テーマ検証済み: 文字 4.5:1 以上、UI 境界 3:1 以上
- `border-border-subtle` は装飾専用（3:1 未満）。入力欄やカードの境界には `border-border-input` / `border-border`

### Semantic colors

<!-- auto:semantic-colors -->
| token | Tailwind | CSS 変数 | light | dark | 用途 |
| --- | --- | --- | --- | --- | --- |
| `color.bg.canvas` | `bg-canvas` | `--8341-color-bg-canvas` | `#ffffff` white | `#1a1b1d` gray.1200 | ページ全体の背景 |
| `color.bg.surface` | `bg-surface` | `--8341-color-bg-surface` | `#ffffff` white | `#252629` gray.1100 | カード・入力欄など面の背景 |
| `color.bg.subtle` | `bg-subtle` | `--8341-color-bg-subtle` | `#f6f7f7` gray.50 | `#252629` gray.1100 | 区切りたい帯・コードブロック |
| `color.bg.muted` | `bg-muted` | `--8341-color-bg-muted` | `#ecedee` gray.100 | `#313336` gray.1000 | ホバー時の面・テーブル見出し |
| `color.bg.inverse` | `bg-inverse` | `--8341-color-bg-inverse` | `#252629` gray.1100 | `#f6f7f7` gray.50 |  |
| `color.bg.disabled` | `bg-disabled` | `--8341-color-bg-disabled` | `#ecedee` gray.100 | `#313336` gray.1000 |  |
| `color.bg.key` | `bg-key` | `--8341-color-bg-key` | `#385db8` indigo.700 | `#a8c4fe` indigo.300 | 主要アクション（Primary ボタン） |
| `color.bg.key-hover` | `bg-key-hover` | `--8341-color-bg-key-hover` | `#2d4c9c` indigo.800 | `#cadbfe` indigo.200 |  |
| `color.bg.key-active` | `bg-key-active` | `--8341-color-bg-key-active` | `#223d81` indigo.900 | `#e4edff` indigo.100 |  |
| `color.bg.key-subtle` | `bg-key-subtle` | `--8341-color-bg-key-subtle` | `#e4edff` indigo.100 | `#11234f` indigo.1100 | 選択中の項目・Secondary ボタンの hover |
| `color.bg.key-subtle-hover` | `bg-key-subtle-hover` | `--8341-color-bg-key-subtle-hover` | `#cadbfe` indigo.200 | `#192f65` indigo.1000 |  |
| `color.bg.danger` | `bg-danger` | `--8341-color-bg-danger` | `#b61b25` red.700 | `#feaba4` red.300 |  |
| `color.bg.danger-hover` | `bg-danger-hover` | `--8341-color-bg-danger-hover` | `#9a101c` red.800 | `#ffcdc8` red.200 |  |
| `color.bg.danger-active` | `bg-danger-active` | `--8341-color-bg-danger-active` | `#800613` red.900 | `#fee7e4` red.100 |  |
| `color.bg.danger-subtle` | `bg-danger-subtle` | `--8341-color-bg-danger-subtle` | `#fef4f3` red.50 | `#3a0104` red.1200 |  |
| `color.bg.success-subtle` | `bg-success-subtle` | `--8341-color-bg-success-subtle` | `#edfbf1` green.50 | `#00220f` green.1200 |  |
| `color.bg.warning-subtle` | `bg-warning-subtle` | `--8341-color-bg-warning-subtle` | `#fffcf3` yellow.50 | `#271d00` yellow.1200 |  |
| `color.bg.info-subtle` | `bg-info-subtle` | `--8341-color-bg-info-subtle` | `#f3f7fe` indigo.50 | `#0a183b` indigo.1200 |  |
| `color.bg.overlay` | `bg-overlay` | `--8341-color-bg-overlay` | `#0a0c14 / 0.48`  | `#000000 / 0.64`  | モーダル背面 |
| `color.text.default` | `text-fg` | `--8341-color-text-default` | `#252629` gray.1100 | `#f6f7f7` gray.50 | 本文。純黒は使わない |
| `color.text.subtle` | `text-fg-subtle` | `--8341-color-text-subtle` | `#616369` gray.700 | `#c2c4c8` gray.300 | 補足・説明文（4.5:1 以上） |
| `color.text.disabled` | `text-fg-disabled` | `--8341-color-text-disabled` | `#8c8f95` gray.500 | `#75777d` gray.600 | 無効状態（WCAG のコントラスト要件対象外だが 3:1 を目安） |
| `color.text.inverse` | `text-fg-inverse` | `--8341-color-text-inverse` | `#f6f7f7` gray.50 | `#252629` gray.1100 |  |
| `color.text.key` | `text-fg-key` | `--8341-color-text-key` | `#2d4c9c` indigo.800 | `#a8c4fe` indigo.300 | キーカラーの文字（Secondary ボタン等） |
| `color.text.on-key` | `text-fg-on-key` | `--8341-color-text-on-key` | `#ffffff` white | `#0a183b` indigo.1200 | bg.key / bg.danger の上の文字 |
| `color.text.danger` | `text-fg-danger` | `--8341-color-text-danger` | `#9a101c` red.800 | `#feaba4` red.300 |  |
| `color.text.success` | `text-fg-success` | `--8341-color-text-success` | `#016337` green.800 | `#91d7a9` green.300 |  |
| `color.text.warning` | `text-fg-warning` | `--8341-color-text-warning` | `#833b02` orange.800 | `#e7c567` yellow.300 |  |
| `color.text.link` | `text-fg-link` | `--8341-color-text-link` | `#2d4c9c` indigo.800 | `#a8c4fe` indigo.300 |  |
| `color.text.link-hover` | `text-fg-link-hover` | `--8341-color-text-link-hover` | `#192f65` indigo.1000 | `#cadbfe` indigo.200 |  |
| `color.text.link-visited` | `text-fg-link-visited` | `--8341-color-text-link-visited` | `#5f3c91` purple.800 | `#ceb6fc` purple.300 |  |
| `color.text.link-active` | `text-fg-link-active` | `--8341-color-text-link-active` | `#833b02` orange.800 | `#feaf82` orange.300 |  |
| `color.icon.default` | `text-icon` | `--8341-color-icon-default` | `#313336` gray.1000 | `#ecedee` gray.100 |  |
| `color.icon.subtle` | `text-icon-subtle` | `--8341-color-icon-subtle` | `#616369` gray.700 | `#c2c4c8` gray.300 |  |
| `color.icon.key` | `text-icon-key` | `--8341-color-icon-key` | `#385db8` indigo.700 | `#a8c4fe` indigo.300 |  |
| `color.icon.danger` | `text-icon-danger` | `--8341-color-icon-danger` | `#b61b25` red.700 | `#feaba4` red.300 |  |
| `color.icon.success` | `text-icon-success` | `--8341-color-icon-success` | `#037743` green.700 | `#91d7a9` green.300 |  |
| `color.icon.warning` | `text-icon-warning` | `--8341-color-icon-warning` | `#7f6404` yellow.700 | `#e7c567` yellow.300 |  |
| `color.icon.info` | `text-icon-info` | `--8341-color-icon-info` | `#385db8` indigo.700 | `#a8c4fe` indigo.300 |  |
| `color.border.subtle` | `border-border-subtle` | `--8341-color-border-subtle` | `#d9dbdd` gray.200 | `#313336` gray.1000 | 装飾的な区切り線（情報を担わないもの限定） |
| `color.border.default` | `border-border` | `--8341-color-border-default` | `#8c8f95` gray.500 | `#75777d` gray.600 | カードなど意味のある境界（3:1 以上） |
| `color.border.input` | `border-border-input` | `--8341-color-border-input` | `#75777d` gray.600 | `#8c8f95` gray.500 | 入力欄・チェックボックスの枠 |
| `color.border.strong` | `border-border-strong` | `--8341-color-border-strong` | `#404246` gray.900 | `#d9dbdd` gray.200 | 入力欄 hover |
| `color.border.key` | `border-border-key` | `--8341-color-border-key` | `#385db8` indigo.700 | `#a8c4fe` indigo.300 |  |
| `color.border.danger` | `border-border-danger` | `--8341-color-border-danger` | `#b61b25` red.700 | `#fe7f77` red.400 |  |
| `color.border.success` | `border-border-success` | `--8341-color-border-success` | `#037743` green.700 | `#64c288` green.400 |  |
| `color.border.warning` | `border-border-warning` | `--8341-color-border-warning` | `#977806` yellow.600 | `#d5aa02` yellow.400 |  |
| `color.border.disabled` | `border-border-disabled` | `--8341-color-border-disabled` | `#c2c4c8` gray.300 | `#404246` gray.900 |  |
| `color.focus.ring` | `outline-focus-ring` | `--8341-color-focus-ring` | `#e7c567` yellow.300 | `#e7c567` yellow.300 | フォーカスの内側リング |
| `color.focus.outline` | `outline-focus-outline` | `--8341-color-focus-outline` | `#1a1b1d` gray.1200 | `#f6f7f7` gray.50 | フォーカスの外側アウトライン |
| `color.focus.text` | `outline-focus-text` | `--8341-color-focus-text` | `#1a1b1d` gray.1200 | `#1a1b1d` gray.1200 | フォーカスリング色の背景に乗る文字（リンクのフォーカス時） |
<!-- /auto:semantic-colors -->

### Primitive colors（参照用）

全色相で OKLCH の明度カーブを共有。段階番号がコントラストの目安になる（600 ≒ 白背景 4.5:1、800 ≒ 8:1）。
DTCG では `{"colorSpace": "oklch", "components": [L, C, H], "hex": "#..."}` の形で持ち、CSS には `oklch()` で出力する。

<!-- auto:primitive-colors -->
| family | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100 | 1200 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| indigo | `#f3f7fe` | `#e4edff` | `#cadbfe` | `#a8c4fe` | `#82a8fd` | `#628bea` | `#4971d2` | `#385db8` | `#2d4c9c` | `#223d81` | `#192f65` | `#11234f` | `#0a183b` |
| teal | `#eafbfa` | `#d4f4f4` | `#ade8e7` | `#7ed6d5` | `#3ec0c0` | `#0ba3a4` | `#098989` | `#087272` | `#015f5f` | `#024d4d` | `#033b3b` | `#002d2d` | `#002020` |
| purple | `#f8f5fe` | `#f0e9ff` | `#e1d2fe` | `#ceb6fc` | `#b897f0` | `#9e77dc` | `#875ec4` | `#724aab` | `#5f3c91` | `#4d2f77` | `#3b235d` | `#2d1a49` | `#201136` |
| red | `#fef4f3` | `#fee7e4` | `#ffcdc8` | `#feaba4` | `#fe7f77` | `#eb5451` | `#d13437` | `#b61b25` | `#9a101c` | `#800613` | `#64050d` | `#4e0208` | `#3a0104` |
| orange | `#fff4ef` | `#fee8db` | `#ffcfb5` | `#feaf82` | `#f48c4c` | `#de6905` | `#ba5601` | `#9c4804` | `#833b02` | `#6b2f01` | `#532301` | `#411900` | `#2f1000` |
| yellow | `#fffcf3` | `#fef1ce` | `#f5de9f` | `#e7c567` | `#d5aa02` | `#b48f0a` | `#977806` | `#7f6404` | `#6b5402` | `#574401` | `#443401` | `#352800` | `#271d00` |
| green | `#edfbf1` | `#daf5e2` | `#b9e8c8` | `#91d7a9` | `#64c288` | `#30a867` | `#078e51` | `#037743` | `#016337` | `#00502b` | `#003e20` | `#003017` | `#00220f` |
| gray | `#f6f7f7` | `#ecedee` | `#d9dbdd` | `#c2c4c8` | `#a8abb0` | `#8c8f95` | `#75777d` | `#616369` | `#505257` | `#404246` | `#313336` | `#252629` | `#1a1b1d` |
<!-- /auto:primitive-colors -->

## 3. Typography Rules

- フォント: `font-sans`（Noto Sans JP → OS の和文ゴシック）、`font-mono`（Noto Sans Mono）
- **太さは `font-regular`（400）と `font-bold`（700）の 2 種類のみ**
- **最小 14px**（`text-body-sm`）。Tailwind 既定の `text-xs` などは消してあり使えない
- 文字サイズは `text-{スタイル名}` で指定し、行間・字間・太さも一緒に決まる
- 字間はサイズに反比例: 44px 以上 `0` / 28〜36px `0.01em` / それ以下 `0.02em`
- 見出し（Heading）のみ `palt`。本文はベタ組み
- 本文の 1 行は最大 `max-w-prose`（720px ≒ 40〜45 字）
- 和文の改行: `line-break: strict; overflow-wrap: anywhere;`（テーマの base 層で設定済み）

<!-- auto:typography -->
| style | Tailwind | size | line-height | weight | letter-spacing | 用途 |
| --- | --- | --- | --- | --- | --- | --- |
| display-lg | `text-display-lg` | 56px | 1.4 | 700 | 0em |  |
| display-md | `text-display-md` | 44px | 1.4 | 700 | 0em |  |
| heading-xl | `text-heading-xl` | 36px | 1.4 | 700 | 0.01em |  |
| heading-lg | `text-heading-lg` | 32px | 1.5 | 700 | 0.01em |  |
| heading-md | `text-heading-md` | 28px | 1.5 | 700 | 0.01em |  |
| heading-sm | `text-heading-sm` | 24px | 1.5 | 700 | 0.02em |  |
| heading-xs | `text-heading-xs` | 20px | 1.5 | 700 | 0.02em |  |
| heading-xxs | `text-heading-xxs` | 18px | 1.6 | 700 | 0.02em |  |
| body-lg | `text-body-lg` | 18px | 1.7 | 400 | 0.02em |  |
| body-md | `text-body-md` | 16px | 1.7 | 400 | 0.02em |  |
| body-sm | `text-body-sm` | 14px | 1.7 | 400 | 0.02em |  |
| dense-md | `text-dense-md` | 16px | 1.3 | 400 | 0.02em |  |
| dense-sm | `text-dense-sm` | 14px | 1.3 | 400 | 0.02em |  |
| label-md | `text-label-md` | 16px | 1 | 700 | 0.02em |  |
| label-sm | `text-label-sm` | 14px | 1 | 700 | 0.02em |  |
| mono-md | `text-mono-md` `font-mono` | 16px | 1.5 | 400 | 0em |  |
| mono-sm | `text-mono-sm` `font-mono` | 14px | 1.5 | 400 | 0em |  |
<!-- /auto:typography -->

## 4. Component Stylings

### 一覧

<!-- auto:components -->
- `Accordion`（`@8341/accordion`）— `packages/ui/src/components/ui/Accordion/`
- `Breadcrumb`（`@8341/breadcrumb`）— `packages/ui/src/components/ui/Breadcrumb/`
- `Button`（`@8341/button`）— `packages/ui/src/components/ui/Button/`
- `Card`（`@8341/card`）— `packages/ui/src/components/ui/Card/`
- `Checkbox`（`@8341/checkbox`）— `packages/ui/src/components/ui/Checkbox/`
- `Dialog`（`@8341/dialog`）— `packages/ui/src/components/ui/Dialog/`
- `Divider`（`@8341/divider`）— `packages/ui/src/components/ui/Divider/`
- `FormField`（`@8341/form-field`）— `packages/ui/src/components/ui/FormField/`
- `Heading`（`@8341/heading`）— `packages/ui/src/components/ui/Heading/`
- `Icon`（`@8341/icon`）— `packages/ui/src/components/ui/Icon/`
- `Link`（`@8341/link`）— `packages/ui/src/components/ui/Link/`
- `NotificationBanner`（`@8341/notification-banner`）— `packages/ui/src/components/ui/NotificationBanner/`
- `RadioGroup`（`@8341/radio-group`）— `packages/ui/src/components/ui/RadioGroup/`
- `Select`（`@8341/select`）— `packages/ui/src/components/ui/Select/`
- `Skeleton`（`@8341/skeleton`）— `packages/ui/src/components/ui/Skeleton/`
- `Spinner`（`@8341/spinner`）— `packages/ui/src/components/ui/Spinner/`
- `Stack`（`@8341/stack`）— `packages/ui/src/components/ui/Stack/`
- `Switch`（`@8341/switch`）— `packages/ui/src/components/ui/Switch/`
- `Tag`（`@8341/tag`）— `packages/ui/src/components/ui/Tag/`
- `Text`（`@8341/text`）— `packages/ui/src/components/ui/Text/`
- `TextField`（`@8341/text-field`）— `packages/ui/src/components/ui/TextField/`
- `Textarea`（`@8341/textarea`）— `packages/ui/src/components/ui/Textarea/`
- `Truncate`（`@8341/truncate`）— `packages/ui/src/components/ui/Truncate/`
<!-- /auto:components -->

### 共通規約

- コンポーネントは Base UI の部品を `tv()`（`@/lib/tv`）のスタイルで包む。`tailwind-variants` の `tv` を直接使わない（独自のテーマ名を登録した `tv` でないと `text-fg text-body-md` の文字色が消える）
- import パスは shadcn 方式: `@/components/ui/{Name}/index`（ディレクトリ名は PascalCase）、`@/lib/{name}`
- 状態は Base UI の data 属性で装飾する: `data-[checked]:`、`data-[invalid]:`、`data-[disabled]:`、`data-[highlighted]:`、`data-[panel-open]:`、`data-[starting-style]:`
- **フォーカスは `focus-ring` クラス**（Base UI は `data-focus-visible` を付けないため `:focus-visible` で描く）。`outline-none` だけで消さない
- 見た目が 44px 未満の操作対象には `tap-target` クラスでタップ領域を足す
- `hover:` は Tailwind v4 では自動で `@media (hover: hover)` に入る。無効状態に効かせないよう `enabled:hover:` を使う
- 強制カラーモードは `forced-colors:` で補う
- `'use client'` はフック・コンテキスト・イベントハンドラを作るエントリだけに付ける（button / form-field / text-field / textarea / select / truncate）

### Button

| prop | 値 | 備考 |
| --- | --- | --- |
| `variant` | `primary`（既定）/ `secondary` / `tertiary` / `danger` | primary は 1 画面 1 つが目安 |
| `size` | `sm` 36px / `md` 44px（既定）/ `lg` 52px | sm は `tap-target` でタップ領域 44px |
| `loading` | boolean | `aria-busy`。disabled にせずクリックだけ無効化 |
| `iconStart` / `iconEnd` | ReactNode | アイコンは文字と併用 |

- 既定 `type="button"`。Base UI の `render` prop で別要素にもできる（`nativeButton={false}` を併用）
- primary: `bg-key text-fg-on-key`、hover `bg-key-hover`、active `bg-key-active`
- secondary: `bg-surface border-border-key text-fg-key`、hover `bg-key-subtle`

### Link（5 状態）

| 状態 | 表現 |
| --- | --- |
| default | `text-fg-link` + 下線 1px（offset 0.2em） |
| visited | `text-fg-link-visited`（藤） |
| hover | `text-fg-link-hover` + 下線 3px（太さだけ変える） |
| active | `text-fg-link-active`（橙） |
| focus | 背景 `bg-focus-ring` + 文字 `text-focus-text` + 外側アウトライン |

- `target="_blank"` で外部アイコンと「（新しいタブで開きます）」の読み上げ補足が自動で付く

### Form（FormField + TextField / Textarea / Select / Checkbox / RadioGroup）

```tsx
<FormField label="メールアドレス" required supportText="例: taro@example.jp" error={error}>
  <TextField type="email" autoComplete="email" />
</FormField>
```

- FormField は Base UI の `Field`。`aria-describedby`（補足とエラー）と `aria-invalid` は Base UI が付ける
- `error` を渡すとその文を表示する。渡さなければ、ネイティブ検証（`required` など）の結果を Base UI が表示する
- 送信時の検証は Base UI の `Form` に任せる（最初の誤りにフォーカスが移る）。検証の時点は `validationMode`（design-principles の推奨は `onBlur`）
- 必須は「必須」バッジ（文字）。`*` だけにしない
- 入力欄: `border-border-input`、`rounded-md`、高さ 36/44/52、文字は `text-body-md` 固定（iOS の拡大防止）
- エラー: `border-border-danger` を 2px 相当に＋エラーアイコン＋太字の文言（`text-fg-danger`）
- 読み取り専用: 破線の枠 + `bg-subtle`
- **Select** は Base UI の Select。`options={[{ value, label }]}` と `placeholder` を渡す。選択肢が 2〜6 個なら RadioGroup
- **Checkbox** は `onCheckedChange(checked)`、`indeterminate`。**RadioGroup** は `onValueChange(value)`

### Accordion

```tsx
<Accordion>
  <AccordionItem summary="申請に必要なものは？" headingLevel={3}>…</AccordionItem>
</Accordion>
```

- Base UI の Accordion。見出しの中のボタンで開閉し、閉じた中身もページ内検索で見つかる（`hiddenUntilFound`）

### NotificationBanner

- `tone`: `info` / `success` / `warning` / `danger`。左に 4px の色帯、背景 `bg-{tone}-subtle`、`rounded-lg`
- 見出しの先頭に種別（「エラー: 」など）を視覚的に隠して読ませる
- 動的に挿入するときだけ `live`（danger は `role="alert"`、他は `role="status"`）

### Switch

- Base UI の Switch（`role="switch"`）。`label` 必須、`description` で補足。`size`: `md`（トラック 60×36px）/ `sm`（40×24px）。ラベル全体がタップ領域で行の高さ 44px を確保
- 押した瞬間に反映する設定に使う。送信して反映する選択（同意など）は Checkbox
- オフ: `border-border-input` の枠と同色のつまみ / オン: `bg-key` のトラックに `bg-surface` のつまみとチェック（色だけで伝えない）

### Dialog

```tsx
<Dialog title="経歴を追加" description="保存するまで反映されません" trigger={<Button>経歴を追加する</Button>}
  footer={<><Button variant="tertiary">下書きに保存する</Button><Button>追加する</Button></>}>
  …
</Dialog>
```

- Base UI の Dialog。`title` 必須（名前）、`description`（説明）。開くとフォーカスが中に移り、Esc か「閉じる」（`closeLabel`）で閉じて開いたボタンに戻る
- `open` / `onOpenChange` で開閉を管理するときは `trigger` を省く
- `placement`: `center`（既定。`bg-overlay` の背面、`rounded-xl`、最大幅 `max-w-prose`、本文だけスクロール）/ `side`（先頭側からせり出す。裏の画面も操作でき、フォーカスだけ閉じ込める）
- 取り消せない操作の確認には使わない（AlertDialog はバックログ）

### Spinner / Skeleton

- **Spinner**: `role="status"` の中に `label`（必須）を文字で持つ。既定は視覚的に隠し、`showLabel` で表示。`size`: `sm` / `md` / `lg`（アイコンの寸法）。`delay` で 300ms 遅れて表示。ボタンの中は Button の `loading`
- **Skeleton**: `aria-hidden` の `bg-muted` の箱（`animate-pulse`、動きを減らす設定では止まる）。`width` / `height`（既定 100% / 1em）、`radius`: `none` / `xs`（既定）/ `md` / `xl` / `full`。待っている領域に `aria-busy` を立て、状態は Spinner で伝える

### Truncate

- 1 行に収まらない文字を … で省略する（`children` は文字列）。省略されたときだけ Tab で止まり、ホバーかフォーカスで全文を Base UI の Tooltip（`bg-inverse`）で出す
- 読み上げは常に全文。本文には使わず、表の列や一覧の項目名など幅が限られる場所に使う

### Card

- `border-border`、`rounded-xl`、内側余白 `p-inset-xl`
- `href` を渡すとタイトルのリンクを `::after` でカード全体に広げる（読み上げはタイトルだけ）。フォーカスはカード全体に描く（`focus-ring-within`）
- 表の行の代わりに敷き詰めない

## 5. Layout Principles

- **ブレークポイントは 1 点**: `md:`（768px）。Tailwind 既定の `sm:` / `lg:` などは消してある
- **レイアウト余白は 3 段階**: `gap-stack-sm` 8px（密接）/ `gap-stack-md` 24px（同じグループ）/ `gap-stack-lg` 64px（セクション間）
- 部品内の余白は `p-inset-*` / `gap-gap-*`（4px 刻み）。数値の `p-4` も使えるが、semantic な名前を優先する
- グリッド: 12 カラム、ガター `gap-gutter`（32px = 本文 × 2）、最大幅 `max-w-content`（1200px）
- 左右の余白: モバイル `px-page-inline`（16px）、768px 以上 32px
- 要素の間隔は Stack コンポーネント（`gap="sm|md|lg"`）で管理し、個別の margin を書かない

<!-- auto:dimensions -->
| token | Tailwind | CSS 変数 | 値 | 用途 |
| --- | --- | --- | --- | --- |
| `space.inset-xs` | `p-inset-xs` | `--8341-space-inset-xs` | `4px` |  |
| `space.inset-sm` | `p-inset-sm` | `--8341-space-inset-sm` | `8px` |  |
| `space.inset-md` | `p-inset-md` | `--8341-space-inset-md` | `12px` |  |
| `space.inset-lg` | `p-inset-lg` | `--8341-space-inset-lg` | `16px` |  |
| `space.inset-xl` | `p-inset-xl` | `--8341-space-inset-xl` | `24px` |  |
| `space.gap-xs` | `gap-gap-xs` | `--8341-space-gap-xs` | `4px` |  |
| `space.gap-sm` | `gap-gap-sm` | `--8341-space-gap-sm` | `8px` |  |
| `space.gap-md` | `gap-gap-md` | `--8341-space-gap-md` | `16px` |  |
| `space.stack-sm` | `gap-stack-sm` | `--8341-space-stack-sm` | `8px` | 密接に関係する要素（ラベルと入力欄） |
| `space.stack-md` | `gap-stack-md` | `--8341-space-stack-md` | `24px` | 同じグループ内の要素（フォーム項目同士） |
| `space.stack-lg` | `gap-stack-lg` | `--8341-space-stack-lg` | `64px` | セクション間 |
| `space.gutter` | `h-gutter` | `--8341-space-gutter` | `32px` | グリッドのガター（本文サイズ × 2） |
| `space.page-inline` | `h-page-inline` | `--8341-space-page-inline` | `16px` | モバイル時の左右余白。md 以上は 32px |
| `size.control-sm` | `h-control-sm` | `--8341-size-control-sm` | `36px` | 小さいコントロールの見た目の高さ（タップ領域は 44px を別途確保） |
| `size.control-md` | `h-control-md` | `--8341-size-control-md` | `44px` | 標準。見た目の高さ＝最小タップ領域 |
| `size.control-lg` | `h-control-lg` | `--8341-size-control-lg` | `52px` |  |
| `size.target-min` | `h-target-min` | `--8341-size-target-min` | `44px` | WCAG 2.5.5 のタップ領域 |
| `size.icon-sm` | `size-icon-sm` | `--8341-size-icon-sm` | `16px` |  |
| `size.icon-md` | `size-icon-md` | `--8341-size-icon-md` | `20px` |  |
| `size.icon-lg` | `size-icon-lg` | `--8341-size-icon-lg` | `24px` |  |
| `size.content-max` | `max-w-content` | `--8341-size-content-max` | `1200px` | コンテンツ最大幅 |
| `size.prose-max` | `max-w-prose` | `--8341-size-prose-max` | `720px` | 本文の最大幅（和文で 1 行 40〜45 字） |
| `radius.none` | `rounded-none` | `--8341-radius-none` | `0px` |  |
| `radius.xs` | `rounded-xs` | `--8341-radius-xs` | `4px` | チェックボックス・タグ |
| `radius.sm` | `rounded-sm` | `--8341-radius-sm` | `6px` | 小さいボタン |
| `radius.md` | `rounded-md` | `--8341-radius-md` | `8px` | ボタン・入力欄 |
| `radius.lg` | `rounded-lg` | `--8341-radius-lg` | `12px` | バナー・横長カード |
| `radius.xl` | `rounded-xl` | `--8341-radius-xl` | `16px` | カード・ダイアログ |
| `radius.full` | `rounded-full` | `--8341-radius-full` | `9999px` | ピル形・円 |
| `border-width.default` | — | `--8341-border-width-default` | `1px` |  |
| `border-width.strong` | — | `--8341-border-width-strong` | `2px` |  |
| `border-width.accent` | — | `--8341-border-width-accent` | `4px` | 見出しのバー・バナーの左線 |
| `border-width.underline` | — | `--8341-border-width-underline` | `1px` | リンクの下線 |
| `border-width.underline-hover` | — | `--8341-border-width-underline-hover` | `3px` | ホバー時のリンク下線（太さで状態変化を示す） |
| `focus.outline-width` | — | `--8341-focus-outline-width` | `2px` |  |
| `focus.ring-width` | — | `--8341-focus-ring-width` | `4px` | outline-offset 分を含む box-shadow の広がり |
| `focus.offset` | — | `--8341-focus-offset` | `2px` |  |
| `shadow.1` | `shadow-1` | `--8341-shadow-1` | `2 層の影` | カード hover・ドロップダウン |
| `shadow.2` | `shadow-2` | `--8341-shadow-2` | `2 層の影` | ポップオーバー・メニュー |
| `shadow.3` | `shadow-3` | `--8341-shadow-3` | `2 層の影` | ドロワー・モーダル |
| `motion.duration.fast` | — | `--8341-motion-duration-fast` | `120ms` |  |
| `motion.duration.base` | — | `--8341-motion-duration-base` | `200ms` |  |
| `motion.duration.slow` | — | `--8341-motion-duration-slow` | `320ms` |  |
| `motion.easing.standard` | `ease-standard` | `--8341-motion-easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` |  |
| `motion.easing.enter` | `ease-enter` | `--8341-motion-easing-enter` | `cubic-bezier(0, 0, 0, 1)` |  |
| `motion.easing.exit` | `ease-exit` | `--8341-motion-easing-exit` | `cubic-bezier(0.3, 0, 1, 1)` |  |
| `z.dropdown` | — | `--8341-z-dropdown` | `100` |  |
| `z.sticky` | — | `--8341-z-sticky` | `200` |  |
| `z.overlay` | — | `--8341-z-overlay` | `300` |  |
| `z.modal` | — | `--8341-z-modal` | `400` |  |
| `z.toast` | — | `--8341-z-toast` | `500` |  |
<!-- /auto:dimensions -->

## 6. Depth & Elevation

- `shadow-1`: カードのホバー・ドロップダウン / `shadow-2`: ポップオーバー・Select / `shadow-3`: ドロワー・モーダル
- ボタン・入力欄に影は使わない
- ダークテーマでは影より面の明るさ（`bg-canvas` < `bg-surface` < `bg-muted`）で手前を表す

## 7. Do's and Don'ts

### Do

- semantic トークンの Tailwind クラスだけを使う
- コンポーネントのスタイルは `tv()`（`@/lib/tv`）で書き、クラスの結合は `cn()`（`@/lib/tv`）
- 状態は色＋形（アイコン・線の太さ・下線）＋文字で伝える
- Base UI の部品とネイティブ要素を使い、独自の操作体系を作らない
- ボタンの文言は「〜する」の動詞。リンクは行き先が分かる文
- エラーは「何が誤りで、どう直すか」を書く
- 新しい semantic カラーを足したら `contrast.rules.json` に組み合わせを足す

### Don't

- 任意値での色・px の直書き（`bg-[#333]`、`p-[12px]`）。Tailwind 既定のパレット
- 任意値・手書き CSS からの `--color-*` / `--spacing-*` / `--text-*` の参照（`--8341-*` を使う）
- 動的なクラス名の組み立て（`` `text-${size}` ``）。Tailwind が検出できない。variants に列挙する
- 14px 未満の文字、純黒の本文、中間ウェイト（500 / 600）
- hover で太さ・大きさを変える
- プレースホルダーをラベル代わりにする
- 見出しや配置で分かることを、補助ラベルや説明文で繰り返す（ラベルの言い換えだけの `supportText`、見出しを言い直す導入文）。関係はレイアウトで示す
- アイコンだけのボタン（閉じるボタンなど慣習的なもの以外）。使う場合は `aria-label`
- `outline-none` でフォーカス表示を消す（代わりに `focus-ring`）
- `div` に `role="button"` を付けて作り直す

## 8. Responsive Behavior

- 768px 未満: 1 カラム、左右余白 16px、見出しは 1 段小さい size を選ぶ（例: h1 を `xl` → `lg`）
- 文字サイズを 200% にしても、横幅 320px でも、情報と機能が欠けない（e2e で検査）
- タップ領域は常に 44×44px 以上
- `prefers-reduced-motion: reduce` で動きを止める（テーマで設定済み。Tailwind の `motion-reduce:` も使う）
- `forced-colors: active` で境界・フォーカスを維持（各コンポーネントの `forced-colors:`）

## 9. Agent Prompt Guide

### クイックリファレンス

```
Import (npm):       import { Button } from '8341-ui/Button';  +  @import "8341-ui/theme.css";
Import (shadcn):    npx shadcn@latest add @8341/button          →  import { Button } from '@/components/ui/Button/index';
Theme:              <html class="dark"> / <html data-theme="dark">（未指定は OS 追従）
Body:               text-body-md text-fg（16px / 1.7 / 0.02em）
Sub text:           text-fg-subtle
Link:               Link コンポーネント（下線は常に表示）
Primary:            bg-key text-fg-on-key（Button variant="primary"）
Border:             入力欄 border-border-input / カード border-border
Focus:              focus-ring
Spacing:            gap-stack-sm / md / lg（8 / 24 / 64）、p-inset-*
Radius:             ボタン・入力 rounded-md / バナー rounded-lg / カード rounded-xl
Control height:     h-control-sm / md / lg（36 / 44 / 52、既定 44）
Breakpoint:         md: のみ（768px）
Variants:           tv() from '@/lib/tv'（tailwind-variants v3）
```

### 作業前に必ず読むもの

0. 画面を作る場合は、プロダクトの DESIGN.md（UI の方向性とサービス種別）
1. このファイル
2. `docs/rulebook/02-accessibility.md`（必須ルール）
3. 該当コンポーネントのソースとストーリー（`packages/ui/src/components/*/`）

### 作業後に必ず実行するもの

```bash
make check   # fmt・lint（型情報つき）・型・トークン・コントラスト・DESIGN.md・レジストリ・クラス監査・アーキテクチャ
make test    # 単体テスト + 全ストーリーの a11y テスト
```

### プロンプト例

```
8341-ui の DESIGN.md に従って、住所変更の申請フォームを作ってください。
- 部品は FormField / TextField / Select / RadioGroup / Button を使い、Base UI の Form で包む
- 郵便番号は inputMode="numeric"、autoComplete を必ず指定
- 必須項目には required。エラー文は「何が誤りで、どう直すか」を書く
- 余白は Stack（gap="md"）で管理し、色や px を直書きしない。Tailwind のクラスは semantic トークンのものだけ
```
