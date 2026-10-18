# DESIGN.md — tkc310-ui

> AI エージェントがこのデザインシステムに沿った日本語 UI を生成・修正するための仕様書です。
> `<!-- auto:* -->` で囲まれた表は `npm run tokens:build` がトークンから自動生成します（手で編集しない）。
> 詳しいルールと理由は `docs/rulebook/`、設計判断は `docs/decisions/` を参照してください。

- パッケージ: `tkc310-ui`（React + TypeScript）
- CSS 接頭辞: `tkc-`（クラス）、`--tkc-`（CSS 変数）
- 準拠: WCAG 2.2 AA / JIS X 8341-3:2016
- 参考: デジタル庁デザインシステム（DADS）

## 0. 位置づけと採用したルール

- **基盤のデザインシステム**: 特定のプロダクトに属さず、複数のプロダクトで使い回す
- **画面設計のルール**: [design-principles](https://github.com/tkc310/agents-playground/tree/main/docs/design-principles) を採用する。適用順は UI の方向性 → サービス別の特化ルール → 原則 → WCAG 2.2
- **UI の方向性とサービス種別**: 基盤では決めない。各プロダクトの DESIGN.md で決める（雛形: `templates/PRODUCT-DESIGN.md`）
- **原則とトークン・コンポーネントの対応**: `docs/rulebook/01-principles.md`
- **必須ルールを外した項目**: なし。タップ領域 44px、文字のコントラストを一律 4.5:1、リンクの下線必須、二重のフォーカス線は、上流の必須より厳しくしている

---

## 1. Visual Theme & Atmosphere

- **キーワード**: 静か・明快・誠実。装飾を控え、文字と情報を主役にする
- **キーカラー**: 藍（OKLCH hue 265）。落ち着いた青紫
- **密度**: 本文 16px・行間 1.7。コントロールの標準高さ 44px（= 最小タップ領域）
- **テーマ**: ライト / ダーク。`<html data-theme="dark">` で明示、属性なしなら OS 設定に従う
- **奥行き**: 面の差は背景色と罫線で表す。影は浮いている物（メニュー・モーダル）にだけ使う

## 2. Color Palette & Roles

### 使い方の原則

- コンポーネント・アプリは **semantic トークンだけ** を使う（`var(--tkc-color-text-default)` など）
- primitive（`--tkc-color-primitive-*`）と色の直書きは禁止（`npm run check:css` が検出）
- すべての組み合わせは `tokens/contrast.rules.json` で両テーマ検証済み: 文字 4.5:1 以上、UI 境界 3:1 以上
- `color.border.subtle` は装飾専用（3:1 未満）。入力欄やカードの境界には `border.input` / `border.default`

### Semantic colors

<!-- auto:semantic-colors -->
| token | CSS 変数 | light | dark | 用途 |
| --- | --- | --- | --- | --- |
| `color.bg.canvas` | `--tkc-color-bg-canvas` | `#ffffff` white | `#1a1b1d` gray.1200 | ページ全体の背景 |
| `color.bg.surface` | `--tkc-color-bg-surface` | `#ffffff` white | `#252629` gray.1100 | カード・入力欄など面の背景 |
| `color.bg.subtle` | `--tkc-color-bg-subtle` | `#f6f7f7` gray.50 | `#252629` gray.1100 | 区切りたい帯・コードブロック |
| `color.bg.muted` | `--tkc-color-bg-muted` | `#ecedee` gray.100 | `#313336` gray.1000 | ホバー時の面・テーブル見出し |
| `color.bg.inverse` | `--tkc-color-bg-inverse` | `#252629` gray.1100 | `#f6f7f7` gray.50 |  |
| `color.bg.disabled` | `--tkc-color-bg-disabled` | `#ecedee` gray.100 | `#313336` gray.1000 |  |
| `color.bg.key` | `--tkc-color-bg-key` | `#385db8` indigo.700 | `#a8c4fe` indigo.300 | 主要アクション（Primary ボタン） |
| `color.bg.key-hover` | `--tkc-color-bg-key-hover` | `#2d4c9c` indigo.800 | `#cadbfe` indigo.200 |  |
| `color.bg.key-active` | `--tkc-color-bg-key-active` | `#223d81` indigo.900 | `#e4edff` indigo.100 |  |
| `color.bg.key-subtle` | `--tkc-color-bg-key-subtle` | `#e4edff` indigo.100 | `#11234f` indigo.1100 | 選択中の項目・Secondary ボタンの hover |
| `color.bg.key-subtle-hover` | `--tkc-color-bg-key-subtle-hover` | `#cadbfe` indigo.200 | `#192f65` indigo.1000 |  |
| `color.bg.danger` | `--tkc-color-bg-danger` | `#b61b25` red.700 | `#feaba4` red.300 |  |
| `color.bg.danger-hover` | `--tkc-color-bg-danger-hover` | `#9a101c` red.800 | `#ffcdc8` red.200 |  |
| `color.bg.danger-active` | `--tkc-color-bg-danger-active` | `#800613` red.900 | `#fee7e4` red.100 |  |
| `color.bg.danger-subtle` | `--tkc-color-bg-danger-subtle` | `#fef4f3` red.50 | `#3a0104` red.1200 |  |
| `color.bg.success-subtle` | `--tkc-color-bg-success-subtle` | `#edfbf1` green.50 | `#00220f` green.1200 |  |
| `color.bg.warning-subtle` | `--tkc-color-bg-warning-subtle` | `#fffcf3` yellow.50 | `#271d00` yellow.1200 |  |
| `color.bg.info-subtle` | `--tkc-color-bg-info-subtle` | `#f3f7fe` indigo.50 | `#0a183b` indigo.1200 |  |
| `color.bg.overlay` | `--tkc-color-bg-overlay` | `rgba(10, 12, 20, 0.48)`  | `rgba(0, 0, 0, 0.64)`  | モーダル背面 |
| `color.text.default` | `--tkc-color-text-default` | `#252629` gray.1100 | `#f6f7f7` gray.50 | 本文。純黒は使わない |
| `color.text.subtle` | `--tkc-color-text-subtle` | `#616369` gray.700 | `#c2c4c8` gray.300 | 補足・説明文（4.5:1 以上） |
| `color.text.disabled` | `--tkc-color-text-disabled` | `#8c8f95` gray.500 | `#75777d` gray.600 | 無効状態（WCAG のコントラスト要件対象外だが 3:1 を目安） |
| `color.text.inverse` | `--tkc-color-text-inverse` | `#f6f7f7` gray.50 | `#252629` gray.1100 |  |
| `color.text.key` | `--tkc-color-text-key` | `#2d4c9c` indigo.800 | `#a8c4fe` indigo.300 | キーカラーの文字（Secondary ボタン等） |
| `color.text.on-key` | `--tkc-color-text-on-key` | `#ffffff` white | `#0a183b` indigo.1200 | bg.key / bg.danger の上の文字 |
| `color.text.danger` | `--tkc-color-text-danger` | `#9a101c` red.800 | `#feaba4` red.300 |  |
| `color.text.success` | `--tkc-color-text-success` | `#016337` green.800 | `#91d7a9` green.300 |  |
| `color.text.warning` | `--tkc-color-text-warning` | `#833b02` orange.800 | `#e7c567` yellow.300 |  |
| `color.text.link` | `--tkc-color-text-link` | `#2d4c9c` indigo.800 | `#a8c4fe` indigo.300 |  |
| `color.text.link-hover` | `--tkc-color-text-link-hover` | `#192f65` indigo.1000 | `#cadbfe` indigo.200 |  |
| `color.text.link-visited` | `--tkc-color-text-link-visited` | `#5f3c91` purple.800 | `#ceb6fc` purple.300 |  |
| `color.text.link-active` | `--tkc-color-text-link-active` | `#833b02` orange.800 | `#feaf82` orange.300 |  |
| `color.icon.default` | `--tkc-color-icon-default` | `#313336` gray.1000 | `#ecedee` gray.100 |  |
| `color.icon.subtle` | `--tkc-color-icon-subtle` | `#616369` gray.700 | `#c2c4c8` gray.300 |  |
| `color.icon.key` | `--tkc-color-icon-key` | `#385db8` indigo.700 | `#a8c4fe` indigo.300 |  |
| `color.icon.danger` | `--tkc-color-icon-danger` | `#b61b25` red.700 | `#feaba4` red.300 |  |
| `color.icon.success` | `--tkc-color-icon-success` | `#037743` green.700 | `#91d7a9` green.300 |  |
| `color.icon.warning` | `--tkc-color-icon-warning` | `#7f6404` yellow.700 | `#e7c567` yellow.300 |  |
| `color.icon.info` | `--tkc-color-icon-info` | `#385db8` indigo.700 | `#a8c4fe` indigo.300 |  |
| `color.border.subtle` | `--tkc-color-border-subtle` | `#d9dbdd` gray.200 | `#313336` gray.1000 | 装飾的な区切り線（情報を担わないもの限定） |
| `color.border.default` | `--tkc-color-border-default` | `#8c8f95` gray.500 | `#75777d` gray.600 | カードなど意味のある境界（3:1 以上） |
| `color.border.input` | `--tkc-color-border-input` | `#75777d` gray.600 | `#8c8f95` gray.500 | 入力欄・チェックボックスの枠 |
| `color.border.strong` | `--tkc-color-border-strong` | `#404246` gray.900 | `#d9dbdd` gray.200 | 入力欄 hover |
| `color.border.key` | `--tkc-color-border-key` | `#385db8` indigo.700 | `#a8c4fe` indigo.300 |  |
| `color.border.danger` | `--tkc-color-border-danger` | `#b61b25` red.700 | `#fe7f77` red.400 |  |
| `color.border.success` | `--tkc-color-border-success` | `#037743` green.700 | `#64c288` green.400 |  |
| `color.border.warning` | `--tkc-color-border-warning` | `#977806` yellow.600 | `#d5aa02` yellow.400 |  |
| `color.border.disabled` | `--tkc-color-border-disabled` | `#c2c4c8` gray.300 | `#404246` gray.900 |  |
| `color.focus.ring` | `--tkc-color-focus-ring` | `#e7c567` yellow.300 | `#e7c567` yellow.300 | フォーカスの内側リング |
| `color.focus.outline` | `--tkc-color-focus-outline` | `#1a1b1d` gray.1200 | `#f6f7f7` gray.50 | フォーカスの外側アウトライン |
| `color.focus.text` | `--tkc-color-focus-text` | `#1a1b1d` gray.1200 | `#1a1b1d` gray.1200 | フォーカスリング色の背景に乗る文字（リンクのフォーカス時） |
<!-- /auto:semantic-colors -->

### Primitive colors（参照用）

全色相で OKLCH の明度カーブを共有。段階番号がコントラストの目安になる（600 ≒ 白背景 4.5:1、800 ≒ 8:1）。

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

```css
--tkc-font-family-sans: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif;
--tkc-font-family-mono: "Noto Sans Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

- 太さは **400 と 700 の 2 種類のみ**
- **最小 14px**。それ未満は使わない
- 字間はサイズに反比例: 44px 以上 `0` / 28〜36px `0.01em` / それ以下 `0.02em`
- 見出し（Heading）のみ `font-feature-settings: 'palt'`。本文はベタ組み
- 本文の 1 行は最大 `--tkc-size-prose-max`（720px ≒ 40〜45 字）
- 和文の改行: `line-break: strict; overflow-wrap: anywhere;`（base.css で設定済み）
- テキストスタイルはクラス `.tkc-text-{style}` か、CSS 変数 `--tkc-text-{style}-{font-size|line-height|...}` で使う

<!-- auto:typography -->
| style | class | size | line-height | weight | letter-spacing | 用途 |
| --- | --- | --- | --- | --- | --- | --- |
| display-lg | `.tkc-text-display-lg` | 56px | 1.4 | 700 | 0em |  |
| display-md | `.tkc-text-display-md` | 44px | 1.4 | 700 | 0em |  |
| heading-xl | `.tkc-text-heading-xl` | 36px | 1.4 | 700 | 0.01em |  |
| heading-lg | `.tkc-text-heading-lg` | 32px | 1.5 | 700 | 0.01em |  |
| heading-md | `.tkc-text-heading-md` | 28px | 1.5 | 700 | 0.01em |  |
| heading-sm | `.tkc-text-heading-sm` | 24px | 1.5 | 700 | 0.02em |  |
| heading-xs | `.tkc-text-heading-xs` | 20px | 1.5 | 700 | 0.02em |  |
| heading-xxs | `.tkc-text-heading-xxs` | 18px | 1.6 | 700 | 0.02em |  |
| body-lg | `.tkc-text-body-lg` | 18px | 1.7 | 400 | 0.02em |  |
| body-md | `.tkc-text-body-md` | 16px | 1.7 | 400 | 0.02em | 本文の基準 |
| body-sm | `.tkc-text-body-sm` | 14px | 1.7 | 400 | 0.02em | 注記。最小サイズ |
| dense-md | `.tkc-text-dense-md` | 16px | 1.3 | 400 | 0.02em | テーブル・リストなど密度を上げたい箇所 |
| dense-sm | `.tkc-text-dense-sm` | 14px | 1.3 | 400 | 0.02em |  |
| label-md | `.tkc-text-label-md` | 16px | 1 | 700 | 0.02em | 1 行で完結する UI ラベル（ボタン等） |
| label-sm | `.tkc-text-label-sm` | 14px | 1 | 700 | 0.02em |  |
| mono-md | `.tkc-text-mono-md` | 16px | 1.5 | 400 | 0em |  |
| mono-sm | `.tkc-text-mono-sm` | 14px | 1.5 | 400 | 0em |  |
<!-- /auto:typography -->

## 4. Component Stylings

### 一覧

<!-- auto:components -->
- `Accordion` — `src/components/Accordion/`
- `Breadcrumb` — `src/components/Breadcrumb/`
- `Button` — `src/components/Button/`
- `Card` — `src/components/Card/`
- `Checkbox` — `src/components/Checkbox/`
- `Divider` — `src/components/Divider/`
- `FormField` — `src/components/FormField/`
- `Heading` — `src/components/Heading/`
- `Icon` — `src/components/Icon/`
- `Link` — `src/components/Link/`
- `NotificationBanner` — `src/components/NotificationBanner/`
- `Radio` — `src/components/Radio/`
- `Select` — `src/components/Select/`
- `Stack` — `src/components/Stack/`
- `Tag` — `src/components/Tag/`
- `Text` — `src/components/Text/`
- `TextField` — `src/components/TextField/`
- `Textarea` — `src/components/Textarea/`
<!-- /auto:components -->

### 共通規約

- クラスは `tkc-{block}__{element}`、状態・バリエーションは `data-*` 属性（`data-variant`、`data-size`、`data-tone`）
- ARIA で表せる状態は ARIA 属性をセレクタに使う（`[aria-invalid='true']`、`[aria-busy='true']`）
- フォーカス可能な要素には `.tkc-focusable` を付け、共通の二重リングを使う
- `:hover` は `@media (hover: hover)` 内に書き、`:not(:disabled)` を付ける
- hover で文字の太さ・大きさを変えない

### Button

| prop | 値 | 備考 |
| --- | --- | --- |
| `variant` | `primary`（既定）/ `secondary` / `tertiary` / `danger` | primary は 1 画面 1 つが目安 |
| `size` | `sm` 36px / `md` 44px（既定）/ `lg` 52px | sm は擬似要素でタップ領域 44px |
| `loading` | boolean | `aria-busy`。disabled にせずクリックだけ無効化 |
| `iconStart` / `iconEnd` | ReactNode | アイコンは文字と併用 |

- 既定 `type="button"`。角丸 `radius.md`（sm は `radius.sm`）
- 色: primary = `bg.key` / `text.on-key`、hover `bg.key-hover`、active `bg.key-active`
- secondary = `bg.surface` + `border.key` + `text.key`、hover で `bg.key-subtle`

### Link（5 状態）

| 状態 | 表現 |
| --- | --- |
| default | `text.link` + 下線 1px（offset 0.2em） |
| visited | `text.link-visited`（藤） |
| hover | `text.link-hover` + 下線 3px（太さだけ変える） |
| active | `text.link-active`（橙） |
| focus | 背景 `focus.ring` + 文字 `focus.text` + 外側アウトライン |

- `target="_blank"` で外部アイコンと「（新しいタブで開きます）」の読み上げ補足が自動で付く

### Form（FormField + TextField / Textarea / Select / Checkbox / RadioGroup）

```tsx
<FormField label="メールアドレス" required supportText="例: taro@example.jp" error={error}>
  <TextField type="email" autoComplete="email" />
</FormField>
```

- FormField が `id`・`aria-describedby`（エラー → 補足の順）・`aria-invalid`・`required` を子に渡す
- 必須は「必須」バッジ（文字）。`*` だけにしない
- 入力欄: 枠 `border.input` 1px、角丸 `radius.md`、高さ 36/44/52、font-size 16px 固定（iOS のズーム防止）
- エラー: 枠 `border.danger` を 2px 相当に＋エラーアイコン＋太字の文言（`text.danger`）
- 読み取り専用: 破線の枠 + `bg.subtle`
- 選択肢が 2〜6 個なら RadioGroup、7 個以上なら Select

### NotificationBanner

- `tone`: `info` / `success` / `warning` / `danger`。左に 4px の色帯、背景 `bg.{tone}-subtle`、角丸 `radius.lg`
- 見出しの先頭に種別（「エラー: 」など）を視覚的に隠して読ませる
- 動的に挿入するときだけ `live`（danger は `role="alert"`、他は `role="status"`）

### Card

- 枠 `border.default`、角丸 `radius.xl`、内側余白 24px
- `href` を渡すとタイトルのリンクを `::after` でカード全体に広げる（読み上げはタイトルだけ）

## 5. Layout Principles

- **ブレークポイントは 1 点**: `@media (min-width: 48rem)`（768px）
- **レイアウト余白は 3 段階**: `space.stack-sm` 8px（密接）/ `stack-md` 24px（同じグループ）/ `stack-lg` 64px（セクション間）
- 部品内の余白は `space.inset-*` / `space.gap-*`（4px 刻み）
- グリッド: 12 カラム、ガター `space.gutter`（32px = 本文 × 2）、最大幅 `size.content-max`（1200px）
- 左右の余白: モバイル 16px、768px 以上 32px
- 要素の間隔は Stack コンポーネント（`gap="sm|md|lg"`）で管理し、個別の margin を書かない

<!-- auto:dimensions -->
| token | CSS 変数 | 値 | 用途 |
| --- | --- | --- | --- |
| `space.inset-xs` | `--tkc-space-inset-xs` | `4px` |  |
| `space.inset-sm` | `--tkc-space-inset-sm` | `8px` |  |
| `space.inset-md` | `--tkc-space-inset-md` | `12px` |  |
| `space.inset-lg` | `--tkc-space-inset-lg` | `16px` |  |
| `space.inset-xl` | `--tkc-space-inset-xl` | `24px` |  |
| `space.gap-xs` | `--tkc-space-gap-xs` | `4px` |  |
| `space.gap-sm` | `--tkc-space-gap-sm` | `8px` |  |
| `space.gap-md` | `--tkc-space-gap-md` | `16px` |  |
| `space.stack-sm` | `--tkc-space-stack-sm` | `8px` | 密接に関係する要素（ラベルと入力欄） |
| `space.stack-md` | `--tkc-space-stack-md` | `24px` | 同じグループ内の要素（フォーム項目同士） |
| `space.stack-lg` | `--tkc-space-stack-lg` | `64px` | セクション間 |
| `space.gutter` | `--tkc-space-gutter` | `32px` | グリッドのガター（本文サイズ × 2） |
| `space.page-inline` | `--tkc-space-page-inline` | `16px` | モバイル時の左右余白。md 以上は 32px |
| `size.control-sm` | `--tkc-size-control-sm` | `36px` | 小さいコントロールの見た目の高さ（タップ領域は 44px を別途確保） |
| `size.control-md` | `--tkc-size-control-md` | `44px` | 標準。見た目の高さ＝最小タップ領域 |
| `size.control-lg` | `--tkc-size-control-lg` | `52px` |  |
| `size.target-min` | `--tkc-size-target-min` | `44px` | WCAG 2.5.5 のタップ領域 |
| `size.icon-sm` | `--tkc-size-icon-sm` | `16px` |  |
| `size.icon-md` | `--tkc-size-icon-md` | `20px` |  |
| `size.icon-lg` | `--tkc-size-icon-lg` | `24px` |  |
| `size.content-max` | `--tkc-size-content-max` | `1200px` | コンテンツ最大幅 |
| `size.prose-max` | `--tkc-size-prose-max` | `720px` | 本文の最大幅（和文で 1 行 40〜45 字） |
| `radius.none` | `--tkc-radius-none` | `0px` |  |
| `radius.xs` | `--tkc-radius-xs` | `4px` | チェックボックス・タグ |
| `radius.sm` | `--tkc-radius-sm` | `6px` | 小さいボタン |
| `radius.md` | `--tkc-radius-md` | `8px` | ボタン・入力欄 |
| `radius.lg` | `--tkc-radius-lg` | `12px` | バナー・横長カード |
| `radius.xl` | `--tkc-radius-xl` | `16px` | カード・ダイアログ |
| `radius.full` | `--tkc-radius-full` | `9999px` | ピル形・円 |
| `border-width.default` | `--tkc-border-width-default` | `1px` |  |
| `border-width.strong` | `--tkc-border-width-strong` | `2px` |  |
| `border-width.accent` | `--tkc-border-width-accent` | `4px` | 見出しのバー・バナーの左線 |
| `border-width.underline` | `--tkc-border-width-underline` | `1px` | リンクの下線 |
| `border-width.underline-hover` | `--tkc-border-width-underline-hover` | `3px` | ホバー時のリンク下線（太さで状態変化を示す） |
| `focus.outline-width` | `--tkc-focus-outline-width` | `2px` |  |
| `focus.ring-width` | `--tkc-focus-ring-width` | `4px` | outline-offset 分を含む box-shadow の広がり |
| `focus.offset` | `--tkc-focus-offset` | `2px` |  |
| `shadow.1` | `--tkc-shadow-1` | `0 1px 2px 0 rgba(16, 24, 48, 0.12), 0 1px 3px 1px rgba(16, 24, 48, 0.08)` | カード hover・ドロップダウン |
| `shadow.2` | `--tkc-shadow-2` | `0 2px 6px 0 rgba(16, 24, 48, 0.14), 0 4px 12px 2px rgba(16, 24, 48, 0.08)` | ポップオーバー・メニュー |
| `shadow.3` | `--tkc-shadow-3` | `0 6px 16px 0 rgba(16, 24, 48, 0.16), 0 12px 32px 4px rgba(16, 24, 48, 0.10)` | ドロワー・モーダル |
| `motion.duration-fast` | `--tkc-motion-duration-fast` | `120ms` |  |
| `motion.duration-base` | `--tkc-motion-duration-base` | `200ms` |  |
| `motion.duration-slow` | `--tkc-motion-duration-slow` | `320ms` |  |
| `motion.easing-standard` | `--tkc-motion-easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` |  |
| `motion.easing-enter` | `--tkc-motion-easing-enter` | `cubic-bezier(0, 0, 0, 1)` |  |
| `motion.easing-exit` | `--tkc-motion-easing-exit` | `cubic-bezier(0.3, 0, 1, 1)` |  |
| `z.dropdown` | `--tkc-z-dropdown` | `100` |  |
| `z.sticky` | `--tkc-z-sticky` | `200` |  |
| `z.overlay` | `--tkc-z-overlay` | `300` |  |
| `z.modal` | `--tkc-z-modal` | `400` |  |
| `z.toast` | `--tkc-z-toast` | `500` |  |
<!-- /auto:dimensions -->

## 6. Depth & Elevation

- `shadow.1`: カードのホバー・ドロップダウン / `shadow.2`: ポップオーバー / `shadow.3`: ドロワー・モーダル
- ボタン・入力欄に影は使わない
- ダークテーマでは影より面の明るさ（`bg.canvas` < `bg.surface` < `bg.muted`）で手前を表す

## 7. Do's and Don'ts

### Do

- semantic トークンだけを使う
- 状態は色＋形（アイコン・線の太さ・下線）＋文字で伝える
- ネイティブ要素（`button`、`a`、`details`、`select`、`fieldset`）を使う
- ボタンの文言は「〜する」の動詞。リンクは行き先が分かる文
- エラーは「何が誤りで、どう直すか」を書き、送信時は最初のエラーにフォーカスを移す
- 新しい semantic カラーを足したら `contrast.rules.json` に組み合わせを足す

### Don't

- 色の直書き（`#333`、`rgb()`）、primitive カラーの参照
- 3px を超える px の直書き（トークンを使う）
- 14px 未満の文字、純黒 `#000` の本文
- 中間ウェイト（500 / 600）
- `:hover` を `@media (hover: hover)` の外に書く、hover で太さ・大きさを変える
- プレースホルダーをラベル代わりにする
- アイコンだけのボタン（閉じるボタンなど慣習的なもの以外）。使う場合は `aria-label`
- `outline: none` でフォーカス表示を消す
- `div` に `role="button"` を付けて作り直す

## 8. Responsive Behavior

- 768px 未満: 1 カラム、左右余白 16px、見出しは 1 段小さい size を選ぶ（例: h1 を `xl` → `lg`）
- 文字サイズを 200% にしても、横幅 320px でも、情報と機能が欠けない
- タップ領域は常に 44×44px 以上
- `prefers-reduced-motion: reduce` で動きを止める（base.css）
- `forced-colors: active` で境界・フォーカスを維持（各コンポーネント CSS）

## 9. Agent Prompt Guide

### クイックリファレンス

```
Import:      import { Button, FormField, TextField, ... } from 'tkc310-ui';
             import 'tkc310-ui/styles.css';
Theme:       <html data-theme="light|dark">（未指定は OS 追従）
Body:        16px / 400 / 1.7 / 0.02em / color: var(--tkc-color-text-default)
Sub text:    var(--tkc-color-text-subtle)
Link:        var(--tkc-color-text-link) + underline（常に）
Primary bg:  var(--tkc-color-bg-key) / text: var(--tkc-color-text-on-key)
Border:      input → var(--tkc-color-border-input) / card → var(--tkc-color-border-default)
Focus:       class="tkc-focusable"（黄リング + 外側アウトライン）
Spacing:     8 / 24 / 64（stack-sm / md / lg）
Radius:      button・input 8 / banner 12 / card 16
Control:     36 / 44 / 52（既定 44）
Breakpoint:  768px のみ
```

### 作業前に必ず読むもの

0. 画面を作る場合は、プロダクトの DESIGN.md（UI の方向性とサービス種別）
1. このファイル
2. `docs/rulebook/02-accessibility.md`（必須ルール）
3. 該当コンポーネントのソースとストーリー（`src/components/*/`）

### 作業後に必ず実行するもの

```bash
npm run check   # トークン・コントラスト・CSS 規約・DESIGN.md 同期・型・Lint
npm test        # 単体テスト + 全ストーリーの a11y テスト
```

### プロンプト例

```
tkc310-ui の DESIGN.md に従って、住所変更の申請フォームを作ってください。
- 部品は FormField / TextField / Select / RadioGroup / Button を使う
- 郵便番号は inputMode="numeric"、autoComplete を必ず指定
- 必須項目には required、送信時のエラーは「何が誤りで、どう直すか」を書く
- 送信時にエラーがあれば上部に NotificationBanner（danger）で一覧を出し、最初のエラーにフォーカス
- 余白は Stack（gap="md"）で管理し、色や px を直書きしない
```
