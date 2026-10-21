# レイアウトの選び方とソースの書き方（ds-slides の手順 3）

全レイアウトの見本は `scripts/slides/examples/sample.html`。形に迷ったときだけ、該当するスライドの部分を読む。

## レイアウトを選ぶ

| 伝えたいこと | レイアウト |
| --- | --- |
| 1 文の主張・結論 | `statement` |
| 理由や事実を 3〜5 個 | `content`（箇条書き） |
| 2〜3 個の対比・並列 | `columns`（枠が要るなら `.col.card`） |
| 数字そのものが主役 | `stats`（2〜4 個） |
| 時間の流れ・手順 | `steps`（3〜5 段） |
| 推移・比較の傾向 | `figure`（SVG のグラフ） |
| 数値を正確に読ませる | `table`（6 行 × 5 列まで） |
| 表紙 / 章扉 / まとめ | `title` / `section` / `summary` |

同じ種類の内容には、デッキの中で同じレイアウトを使う（一貫性）。各レイアウトに置ける要素は `docs/rulebook/07-slides.md` の「レイアウト」の表。

## ソースの形

`slides/<名前>.html`（置き場所はユーザーの指定に従う）に書く。

```html
<!doctype html>
<html lang="ja" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <title>デッキの題</title>
  </head>
  <body>
    <section class="slide" data-layout="title">
      <h1>デッキの題</h1>
      <p class="subtitle">副題</p>
      <p class="meta">2026年10月20日　発表者</p>
    </section>
    <section class="slide" data-layout="content">
      <h2>このスライドの結論を文で書く</h2>
      <ul>
        <li>…</li>
      </ul>
      <p class="source">出典: …</p>
      <aside class="notes">話す内容はここへ（S8）</aside>
    </section>
  </body>
</html>
```

## 決まり（違反は検査でエラーになる）

- `body` の直下は `section.slide` だけ。`style` 属性・`<style>`・`<script>`・独自のクラスは書かない（S9）。使えるクラスは 07 章の「使えるクラス」
- 表紙だけ `h1`、ほかは `h2` を 1 つ、小見出しは `h3`（S2）
- 箇条書きは 5 項目・2 段まで（S3）。収まらないならスライドを分ける
- 画像は `alt`、SVG は `role="img"` と `aria-label`（S13）。表は `th`（S14）
- リンクは行き先が分かる文にする（S6）。新しいタブで開くリンクは `target="_blank"` だけ書けば、アイコンと読み上げの補足はビルドが付ける
- 文言は `docs/rulebook/05-writing.md` に従う（です・ます、数字は半角）

## グラフ（`figure` の SVG）

- `viewBox` の幅は 832（キャンバスの本文の幅）にすると、文字がスライドの文字と同じ大きさになる
- 色はクラスで付ける: 注目する系列 `chart-key`、ほか `chart-base`、軸 `chart-axis`、ラベル `chart-label` / `chart-label-subtle`。`fill` などに色を書かない（S12）
- 注目するのは 1 系列だけ。各系列に値か名前のラベルを直接付け、凡例と色だけで区別させない（S11）
- `aria-label` には、グラフから読み取ってほしいこと（値と傾向）を書く
