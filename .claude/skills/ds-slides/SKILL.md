---
name: ds-slides
description: 8341-ui のトークンとデザイン原則に沿って、発表用のスライド（1 ファイルの HTML デッキ。印刷すると PDF）を作る・直すときに使う。構成の決め方、レイアウトの選び方、検査とビルドの手順を含む。
---

# デザインシステムに沿ってスライドを作る

スライドの見た目（文字サイズ・色・余白・揃え）は `scripts/slides/deck.css` が 8341-ui の semantic トークンだけで決める。作者が決めるのは **構成・文言・レイアウトの選択** だけにする。ルールの正は `docs/rulebook/07-slides.md`（S1〜S20）で、その元は `docs/design-principles/principles.md` と WCAG 2.2 である。

## 作る前に読む

1. `docs/rulebook/07-slides.md`（ルール・レイアウト・使えるクラス）
2. `docs/rulebook/05-writing.md`（です・ます、数字、リンクの書き方）
3. `scripts/slides/examples/sample.html`（全レイアウトの見本）
4. 判断に迷ったら `docs/design-principles/principles.md` の該当ルールだけ（「読み順と優先度」「まとまり」「一度に出す数」「削る」「文言」）

## 手順

### 1. 前提を聞く

推測できない項目だけを、短いリストで一度に聞く（Claude Code では AskUserQuestion、ほかのエージェントでは番号付きの質問リスト）。

- 目的: 聞き手に何を決めて・知ってもらいたいか（1 文で）
- 聞き手: 誰か、前提知識はどれくらいか
- 場: 発表時間（枚数の目安は 1 分 1 枚）、投影か配布か、会場が暗いか（暗いならダークを提案）
- 材料: 数字・図・出典として使ってよい資料

答えを 3〜5 行で要約して確認してから進む。

### 2. 構成を決める（書く前に）

- まず **結論の 1 文** を決める。冒頭（表紙の次）に `statement` で置く（S7）
- 各スライドの見出し（`h2`）だけを並べた骨子を作る。見出しは **そのスライドの結論を文で**（S1）。見出しだけを順に読んで話が通じれば構成は良い
- 章が 3 つ以上なら `section`（章扉）で区切る。最後は `summary` で「持ち帰ってほしいこと」を 3 つまで
- 骨子をユーザーに見せて合意してから中身を書く（枚数が多い、または聞き手が重要な場合）

### 3. レイアウトを選ぶ

| 伝えたいこと | レイアウト |
| --- | --- |
| 1 文の主張・結論 | `statement` |
| 理由や事実を 3〜5 個 | `content`（箇条書き） |
| 2〜3 個の対比・並列 | `columns`（枠が要るなら `.col.card`） |
| 数字そのものが主役 | `stats`（2〜4 個） |
| 時間の流れ・手順 | `steps`（3〜5 段） |
| 推移・比較の傾向 | `figure`（SVG のグラフ） |
| 数値を正確に読ませる | `table`（6 行 × 5 列まで） |

同じ種類の内容には、デッキの中で同じレイアウトを使う（一貫性）。

### 4. ソースを書く

`slides/<名前>.html`（置き場所はユーザーの指定に従う）に、見本と同じ形で書く。

```html
<!doctype html>
<html lang="ja" data-theme="light">
<head><meta charset="utf-8"><title>デッキの題</title></head>
<body>
<section class="slide" data-layout="title">
  <h1>デッキの題</h1>
  <p class="subtitle">副題</p>
  <p class="meta">2026年10月20日　発表者</p>
</section>
<section class="slide" data-layout="content">
  <h2>このスライドの結論を文で書く</h2>
  <ul><li>…</li></ul>
  <p class="source">出典: …</p>
  <aside class="notes">話す内容はここへ（S8）</aside>
</section>
</body>
</html>
```

決まり（違反は検査でエラーになる）:

- `body` の直下は `section.slide` だけ。`style` 属性・`<style>`・`<script>`・独自のクラスは書かない（S9）
- 表紙だけ `h1`、ほかは `h2` を 1 つ、小見出しは `h3`（S2）
- 箇条書きは 5 項目・2 段まで（S3）。収まらないならスライドを分ける
- 画像は `alt`、SVG は `role="img"` と `aria-label`（S13）。表は `th`（S14）
- 新しいタブで開くリンクは `target="_blank"` だけ書けば、アイコンと読み上げの補足はビルドが付ける

グラフ（`figure` の SVG）:

- `viewBox` の幅は 832（キャンバスの本文の幅）にすると、文字がスライドの文字と同じ大きさになる
- 色はクラスで付ける: 注目する系列 `chart-key`、ほか `chart-base`、軸 `chart-axis`、ラベル `chart-label` / `chart-label-subtle`。`fill` などに色を書かない（S12）
- 注目するのは 1 系列だけ。各系列に値か名前のラベルを直接付け、凡例と色だけで区別させない（S11）
- `aria-label` には、グラフから読み取ってほしいこと（値と傾向）を書く

### 5. 検査してビルドする

```bash
make slides-check SRC=slides/<名前>.html   # エラー（必須）と警告（推奨）を出す
make slides SRC=slides/<名前>.html          # dist/slides/<名前>.html を作る（エラーがあれば作らない）
make slides SRC=… OUT=… THEME=dark          # 出力先・テーマを指定（light / dark / auto）
```

- エラーは必ず直す。警告（分量・強調の数・表の大きさ）は、理由が無ければ直す。分量の警告は、文を削るか発表者メモへ移すかスライドを分けて解く
- ルールを緩めて通さない。ルールが合わない場面を見つけたら、作業を止めずに `docs/rulebook/07-slides.md` の改善案としてユーザーに伝える

### 6. 見た目を確かめる

ブラウザ（Playwright など）が使えるなら、出力を開いて確かめる。

- 発表モード（幅 1280 程度）で `#1`〜`#N` を順に開いてスクリーンショットを撮り、全枚を見る。コンソールに「はみ出しています」の警告が出たスライドは分量を減らす（`.slide[data-overflow]` でも分かる）
- `html[data-theme="dark"]` にしてもう一度見る
- 幅 360 で開き、一覧モードで横スクロールが出ないこと（`document.documentElement.scrollWidth` が 360）

ブラウザが無ければ、ユーザーに出力ファイルを開いて確かめてもらう。

### 7. 渡す

出力の HTML（1 ファイル。オフラインで開ける）を渡し、使い方を 1〜2 行で添える:
→ / ← / PageDown / PageUp で送る、「全画面で表示」で全画面、「一覧で表示」で発表者メモつきの一覧、ブラウザの印刷で 1 枚 1 ページの PDF。

## セルフチェック

- [ ] 見出しだけを順に読んで、話の筋が通る（S1）
- [ ] 冒頭に結論、最後にまとめがある（S7）
- [ ] 1 枚に言いたいことが 1 つだけ。2 つあるなら分けた
- [ ] 数字に出典か注記がある（`p.source`）
- [ ] 文言が 05 文言に沿っている（です・ます、数字は半角、リンクは行き先が分かる文）
- [ ] `make slides-check` のエラーが 0、警告は理由を説明できる
- [ ] ライト / ダーク、発表 / 一覧（幅 360）で読める。はみ出しが無い

## 直すとき

- デッキの見た目・操作・検査を変えるのはデザインシステムの変更になる。`ds-improve` の手順で、`scripts/slides/`（`deck.css`・`deck.js`・`lib.ts`）と `docs/rulebook/07-slides.md` を同時に直し、`make check` を通す
- 使えるクラスやレイアウトを足すときは、`lib.ts` の `ALLOWED_CLASSES` / `LAYOUTS`、`deck.css`、07 章の表、見本（`examples/sample.html`）をそろえて直す
- `deck.css` には `var(--8341-*)` と `--deck-*` だけを書く（色・px・太さ・中央揃え・動きの直書きは監査で落ちる）
