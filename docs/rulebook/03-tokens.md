# 03 トークン

## 層の構造

```
tokens/palette.config.json ──(npm run tokens:palette)──▶ tokens/primitive/color.json
tokens/primitive/*.json    ┐
tokens/semantic/base.json  ├─(npm run tokens:build)──▶ src/styles/tokens.css  (CSS 変数)
tokens/semantic/color.*.json┘                          src/styles/typography.css
                                                        src/tokens/tokens.ts / tokens.json
                                                        DESIGN.md の自動生成ブロック
```

| 層 | 例 | 誰が参照するか |
| --- | --- | --- |
| Primitive | `color.primitive.indigo.700`、`dimension.16`、`font.size.16` | semantic トークンだけ |
| Semantic | `color.text.subtle`、`space.stack-md`、`text.body-md`、`radius.md` | コンポーネント、アプリ |
| Component | Button 内部の `--_bg` など `--_` で始まるローカル変数 | そのコンポーネントの CSS だけ |

**必須**: コンポーネントとアプリのコードは semantic トークンだけを使う。色の直書き、primitive カラーの参照、3px を超える px の直書きは `npm run check:css` が error にする。

## 命名

- CSS 変数は `--dsm-{トークンのパスをハイフンでつないだもの}`。例: `color.text.subtle` → `--dsm-color-text-subtle`
- semantic カラーは `color.{役割}.{意味}[-{状態}]`。役割は `bg` / `text` / `icon` / `border` / `focus`
- 状態の接尾辞は `-hover` / `-active` / `-subtle`（薄い面）に限る
- テキストスタイルは `text.{用途}-{サイズ}`。用途は `display` / `heading` / `body` / `dense` / `label` / `mono`

## カラー

### Primitive の作り方

全色相で **OKLCH の明度カーブを共有** しています（`palette.config.json` の `lightness`）。
そのため段階番号がそのままコントラストの目安になります。

| 段階 | 白背景とのコントラスト | 主な用途 |
| --- | --- | --- |
| 50〜200 | 1.1〜1.4 | 薄い面（`bg.*-subtle`） |
| 300〜400 | 1.8〜2.4 | ダークテーマの文字・キー |
| 600 | 約 4.5 | 境界（3:1 以上） |
| 700 | 約 6 | ライトのキー背景・アイコン |
| 800 | 約 8 | ライトの文字色（リンク・エラー） |
| 1000〜1200 | 13〜17 | 本文・ダークの面 |

色相を変えたいときは `palette.config.json` の `hue` を変えて `npm run tokens:palette && npm run tokens:build && npm run check:contrast` を実行します。

### Semantic の主なもの

| トークン | 用途 |
| --- | --- |
| `color.bg.canvas` / `surface` / `subtle` / `muted` | ページ背景 / 面 / 区切りの帯 / ホバー |
| `color.bg.key` (+ `-hover` / `-active`) | primary ボタンなど主要操作 |
| `color.bg.key-subtle` | 選択中、secondary のホバー |
| `color.text.default` / `subtle` | 本文 / 補足（どちらも 4.5:1 以上） |
| `color.text.link*` | リンクの 4 状態（focus は `color.focus.*`） |
| `color.border.input` | 入力欄の枠（3:1 以上） |
| `color.border.subtle` | **装飾専用**。情報を担う境界には使わない（3:1 未満のため） |
| `color.focus.ring` / `outline` / `text` | フォーカス表示 |

### 新しい semantic カラーを足すとき

1. `color.light.json` と `color.dark.json` の **両方** に同じキーで追加する（キーがずれるとビルドが失敗する）
2. `tokens/contrast.rules.json` に、そのトークンが置かれうる組み合わせを追加する
3. `npm run tokens:build && npm run check:contrast`
4. 用途を `$description` に書く（DESIGN.md とStorybook に反映される）

## タイポグラフィ

- フォント: `Noto Sans JP` → OS の和文ゴシック。Web フォントが読めなくても情報が伝わる順に並べる
- 太さは 400 と 700 の 2 種類のみ
- 字間は大きい文字ほど詰める: 44px 以上 `0` / 28〜36px `0.01em` / それ以下 `0.02em`
- 見出しだけ `palt`（約物詰め）を使う。本文はベタ組み（[ADR-0004](../decisions/0004-palt-for-headings.md)）
- 最小 14px。それより小さい値はトークンに存在しない

## 余白・サイズ・角丸

| 種類 | トークン | ルール |
| --- | --- | --- |
| レイアウト余白 | `space.stack-sm / md / lg`（8 / 24 / 64） | 3 段階のみ。要素の関係の近さで選ぶ |
| 部品内の余白 | `space.inset-*`、`space.gap-*` | 4px 刻み |
| コントロール高さ | `size.control-sm / md / lg`（36 / 44 / 52） | md が既定。sm は 44px のタップ領域を別途確保 |
| 角丸 | `radius.xs`〜`xl`、`full` | 横長の要素ほど小さく。カード 16、バナー 12、ボタン・入力 8 |
| 影 | `shadow.1〜3` | ボタンには使わない。浮いている物（メニュー・モーダル）だけ |

## ブレークポイント

`768px`（`breakpoint.md`）の 1 点のみ。CSS 変数はメディアクエリで使えないため、値を直接書いてよい唯一の例外です。

```css
@media (min-width: 48rem) { /* 768px 以上 */ }
```
