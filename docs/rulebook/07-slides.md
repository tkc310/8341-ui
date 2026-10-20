# 07 スライド

8341-ui のトークンと design-principles の原則で、発表用のスライド（HTML のデッキ）を作るときのルールです。
画面と同じく、判断の正は [design-principles](../design-principles/README.md) です。この章は、その原則をスライドという形式に落とす方法を定めます。
作り方の手順は `ds-slides` スキル（`.claude/skills/ds-slides/SKILL.md`）、道具は `scripts/slides/` にあります。

## 前提

- スライドは **960×540 の論理サイズ（16:9）** のキャンバスに組み、表示する画面に合わせて全体を拡大・縮小する。寸法はすべて rem なので、文字の大きさの比率は画面によらず一定になる
- 文字サイズ・色・余白・角丸は **8341-ui の semantic トークンだけ** を使う。スライド専用のトークンは作らない（960 幅で 18px の本文は、1920 幅の画面では 36px 相当になる）
- 色の組み合わせは、トークンの `contrast.rules.json` で両テーマ検証済みのものだけを使う。スライドの作者は色を選ばない（レイアウトとクラスが決める）
- 原則の「UI の方向性」と「サービス別の特化ルール」はスライドには当てはめない。スライドは読み物（一方向の説明）として、原則と WCAG を適用する

## ルール

強さは [ルールブックの README](./README.md#ルールの強さ) と同じです。「検査」欄の ID は `make slides-check` が出すエラー（必須）・警告（推奨）の ID です。

### 構成と文言

| #   | ルール | 強さ | 原則 | 検査 |
| --- | --- | --- | --- | --- |
| S1  | 1 枚に 1 つのメッセージ。スライドの見出しには、その 1 枚で伝えたい結論を文で書く（「背景」「概要」のような名詞だけの見出しは章扉に限る） | 必須 | 読み順と優先度・文言 | レビュー |
| S2  | 表紙の `h1` はデッキに 1 つ。ほかのスライドは `h2` を 1 つ持ち、スライドの中の小見出しは `h3`。段を飛ばさない | 必須 | 読み順と優先度（WCAG 1.3.1・2.4.6） | `heading-*` |
| S3  | 箇条書きは 1 つのリストに 5 項目まで、入れ子は 2 段まで | 必須 | 一度に出す数 | `list-*` |
| S4  | 本文はスライドあたり 150 字まで。箇条書きの 1 項目は 40 字（2 行）まで、見出しは 40 字（2 行）まで | 推奨 | 削る・一度に出す数 | `text-*` |
| S5  | 強調（`strong`）はスライドあたり 2 つまで | 推奨 | 読み順と優先度 | `emphasis-many` |
| S6  | 文言は [05 文言](./05-writing.md) に従う。リンクは行き先が分かる文にし、「こちら」「詳細」だけにしない | 必須 | 文言 | `link-text` |
| S7  | 冒頭に結論か目次、章の区切りに章扉、最後にまとめを置く | 推奨 | 読み順と優先度・再認 | レビュー |
| S8  | 話す内容は発表者メモ（`aside.notes`）に書き、スライドの本文に書き込まない | 推奨 | 削る | レビュー |

### 見た目

| #   | ルール | 強さ | 原則 | 検査 |
| --- | --- | --- | --- | --- |
| S9  | 色・寸法はトークンだけ。ソースに `style` 属性・`<style>`・`<script>`・外部 CSS を書かない。クラスは下の「使えるクラス」だけ | 必須 | 一貫性 | `style-*`・`class-unknown` |
| S10 | 文字サイズはレイアウトと要素が決める（下の対応表）。14px（`text-body-sm`）未満の文字を作らない | 必須 | 文字と図の判別（DS の A7） | `deck.css` の監査 |
| S11 | 色だけで区別しない。グラフは系列に直接ラベルを付け、注目する系列だけをキーカラーにする。注記（`callout`）は種別を文字でも伝える | 必須 | 文字と図の判別（WCAG 1.4.1） | `chart-*`・ビルド |
| S12 | グラフの色は `chart-*` クラスで付ける。SVG の `fill`・`stroke` に色を直書きしない | 必須 | 文字と図の判別（WCAG 1.4.11） | `chart-color` |
| S13 | 画像には `alt`、SVG の図には `role="img"` と `aria-label`（または `<title>`）を付ける。飾りの画像は `alt=""` | 必須 | WCAG 1.1.1 | `img-alt`・`svg-name` |
| S14 | 表には見出しセル（`th`）を付ける。表は 6 行 × 5 列までにし、超えるなら分けるか図にする | 必須（`th`）／推奨（大きさ） | 一度に出す数（WCAG 1.3.1） | `table-*` |
| S15 | 揃えは左。中央揃え・両端揃え・影・グラデーション・切り替えの動きを使わない | 必須 | 配置の秩序・削る | `deck.css` |

### 閲覧と操作

| #   | ルール | 強さ | 原則 | 検査 |
| --- | --- | --- | --- | --- |
| S16 | キーボードだけで送る・戻る・一覧・全画面ができる。文字キー 1 つのショートカットは作らない（矢印・PageUp/PageDown・Space・Home/End を使う） | 必須 | WCAG 2.1.1・2.1.4 | `deck.js` |
| S17 | 幅 768px 未満と印刷では、スライドを 1 枚ずつ縦に並べた「一覧」で表示し、文字を縮めない | 必須 | WCAG 1.4.10・1.4.4 | `deck.css` |
| S18 | 発表モードでは現在のスライドだけを読み上げの対象にし、切り替えを「3 / 12 枚目: 見出し」と知らせる | 必須 | 状態と応答（WCAG 4.1.3） | `deck.js` |
| S19 | `<html lang>` と `<title>` を書く | 必須 | WCAG 3.1.1・2.4.2 | `doc-*` |
| S20 | 操作ボタンは 44×44px 以上、フォーカスは二重リング（`focus-ring` と同じ） | 必須 | 操作の幾何（DS の A5・A6） | `deck.css` |

## レイアウト

スライドの種類は `<section class="slide" data-layout="…">` で選びます。位置・大きさ・余白はレイアウトが決めます。

| `data-layout` | 用途 | 中身 |
| --- | --- | --- |
| `title` | 表紙 | `h1`（デッキの題）、`p.subtitle`、`p.meta`（日付・発表者） |
| `section` | 章扉 | `p.eyebrow`（「第 2 章」など）、`h2` |
| `statement` | 1 文で言い切る | `h2`（大きく）、任意で `p` |
| `content` | 標準 | `h2`、`p.lead`、`ul` / `ol` / `p`、`.callout` |
| `columns` | 2〜3 列の対比・並列 | `h2`、`.col` を 2〜3 個（各 `h3` と本文。`.col.card` で枠付き） |
| `stats` | 数字を見せる | `h2`、`.stat` を 2〜4 個（`.stat-value` と `.stat-label`） |
| `steps` | 手順・流れ | `h2`、`ol.steps`（3〜5 段。各 `li` に `h3` と `p`） |
| `figure` | 図・グラフ・画像 | `h2`、`figure`（`img` か `svg`）と `figcaption` |
| `table` | 表 | `h2`、`table`（`thead` の `th`、必要なら行見出しの `th scope="row"`） |
| `summary` | まとめ・締め | `h2`、`ol` / `ul`（持ち帰ってほしいこと 3 つまでを推奨）、任意で `p.meta` |

どのレイアウトにも、`p.source`（出典・注記）と `aside.notes`（発表者メモ）を置けます。

## 要素とトークンの対応

| 要素 | テキストスタイル | 色 |
| --- | --- | --- |
| 表紙の題（`title` の `h1`） | `text.display-md`（44px） | `color.text.default`。上に `border-width.accent` × `color.border.key` のバー |
| 章扉・`statement` の見出し | `text.display-md`（44px） | `color.text.default` |
| スライドの見出し（`h2`） | `text.heading-lg`（32px） | `color.text.default` |
| 小見出し（`h3`） | `text.heading-xs`（20px） | `color.text.default` |
| 本文・箇条書き | `text.body-lg`（18px） | `color.text.default` |
| リード・副題 | `text.heading-xxs`（18px 太字） / `text.body-lg` | `color.text.subtle` |
| 数字（`.stat-value`） | `text.display-lg`（56px） | `color.text.key` |
| 表 | `text.body-md`（16px）、見出しは太字 | 見出し行 `color.bg.muted`、罫線 `color.border.default` |
| 出典・注記・ページ番号 | `text.body-sm`（14px） | `color.text.subtle` |
| 章扉の小見出し（`.eyebrow`）・タグ | `text.label-md` / `text.label-sm` | `color.text.key` |
| 注記（`.callout`） | `text.heading-xxs` + `text.body-md` | NotificationBanner と同じ（`bg.{tone}-subtle`・左 4px の線・アイコン） |
| 強調（`strong`） | 太字（700） | `color.text.default`（色だけで強調しない） |
| リンク | 本文と同じ | Link と同じ 5 状態（下線は常に表示） |
| グラフの注目系列 / その他 / 軸 / ラベル | — | `color.icon.key` / `color.border.default` / `color.border.default` / `color.text.default`・`color.text.subtle` |

余白: キャンバスの左右 `space.stack-lg`（64px。本文の 1 行が約 45 字になる）、上下 `space.gutter`（32px）、要素の間 `space.stack-md`（24px）、見出しと本文の間 `space.stack-md`、関係の深い要素の間 `space.stack-sm`（8px）。列の間は `space.gutter`。

## 使えるクラス

`slide`、`subtitle`、`meta`、`eyebrow`、`lead`、`source`、`notes`、`col`、`card`、`stat`、`stat-value`、`stat-label`、`steps`、`callout`、`callout-info` / `callout-success` / `callout-warning` / `callout-danger`、`tag`、`tag-key` / `tag-success` / `tag-warning` / `tag-danger`、`chart-key`、`chart-base`、`chart-axis`、`chart-label`、`chart-label-subtle`、`visually-hidden`

増やすときは `scripts/slides/lib.ts` の `ALLOWED_CLASSES` と `deck.css`、この表を同時に直します。

## テーマ

既定はライト。発表の場所に合わせて `<html data-theme="dark">` にできます（`--theme` でビルド時にも指定可）。`data-theme` を付けない `auto` は OS の設定に従います。どちらもトークンの検証済みの組み合わせなので、テーマを替えても S10〜S12 は満たされます。
