# ルールブック

このデザインシステムで UI を作るとき、また、このデザインシステム自体を変更するときに守るルールです。
人にも AI エージェントにも同じルールを適用します。
画面設計の判断は[design-principles](../design-principles/README.md) に従い、このルールブックはそれをトークンとコンポーネントに落とす方法を定めます。

| 章                                           | 内容                                                                  |
| -------------------------------------------- | --------------------------------------------------------------------- |
| [01 デザイン原則](./01-principles.md)        | design-principlesとの対応表と、このシステムの設計方針 |
| [02 アクセシビリティ](./02-accessibility.md) | WCAG 2.2 AA を最低ラインとした必須要件                                |
| [03 トークン](./03-tokens.md)                | primitive / semantic の使い分けと追加手順                             |
| [04 コンポーネント](./04-components.md)      | API・CSS・ファイル構成の規約と完了の定義                              |
| [05 文言](./05-writing.md)                   | ラベル・ボタン・エラーメッセージの書き方                              |
| [06 改善ループ](./06-improvement-loop.md)    | このシステムを継続的に良くする仕組み                                  |
| [07 スライド](./07-slides.md)                | 原則とトークンで発表用のスライドを作るときのルール                    |

設計判断の経緯は [docs/decisions](../decisions/) に ADR として残しています。

## ルールの強さ

- **必須**: 守らないと CI が失敗する、またはレビューで差し戻す
- **推奨**: 理由があれば外してよい。外したら PR に理由を書く
- **参考**: 判断材料

## 参考にしたもの

- [デジタル庁デザインシステム（DADS）](https://design.digital.go.jp/dads/) — アクセシビリティ基準、フォーカス表示、リンクの 5 状態、単一ブレークポイント、角丸・余白の段階設計
- [DADS の DESIGN.md（awesome-design-md-jp）](https://kzhrknt.github.io/awesome-design-md-jp/design-md/digital-go/DESIGN.md) — エージェント向け仕様書の構成
- [DADS コードスニペット（HTML 版）](https://github.com/digital-go-jp/design-system-example-components-html) — BEM + data 属性による状態表現
- [`docs/design-principles/`](../design-principles/README.md) — 画面設計のルールの正。UI の方向性、サービス別の特化ルール、15 の原則、WCAG 2.2（[ADR-0007](../decisions/0007-adopt-design-principles.md)）
