# 04 コンポーネント

## ファイル構成

```
src/components/Button/
├── Button.tsx           # 実装（1 ファイル 1 コンポーネントが基本）
├── Button.css           # スタイル（BEM + data 属性）
└── Button.stories.tsx   # Storybook（状態ごとのストーリーと play テスト）
```

複数の部品にまたがる例はカテゴリ別のストーリー（`Form.stories.tsx` など）に置きます。
単体テストは `src/components/components.test.tsx` に集約しています。

## 実装の規約

### React

- 素の HTML 要素を包む部品は `forwardRef` し、その要素の標準属性を `...rest` で受け取る
- ネイティブ要素を優先する（`button`、`a`、`details`、`select`、`fieldset`、`input type="checkbox"`）。`div` に `role` を付けて作り直さない
- `Button` の既定は `type="button"`。送信ボタンは明示的に `type="submit"`
- 見た目のバリエーションは `variant`、大きさは `size`、色調は `tone` という名前に揃える
- アクセシブルな名前に関わる props（`label`、`legend`、`title`）は必須にする
- 文言の既定値は日本語で持ち、props で上書きできるようにする（例: `Link` の `newTabLabel`）

### CSS

- クラス名は `dsm-{block}__{element}`。状態・バリエーションは `data-*` 属性で表す（`data-variant="secondary"`）
- ARIA で表せる状態は ARIA 属性をそのままセレクタにする（`[aria-invalid='true']`、`[aria-busy='true']`）
- コンポーネント内の可変値は `--_` で始まるローカル変数にまとめ、バリエーションではその変数だけを差し替える
- フォーカスは `.dsm-focusable` クラスを付けて共通の二重リングを使う。独自のフォーカス表示を作らない
- `:hover` は `@media (hover: hover)` の中に。`:hover` / `:active` は `:not(:disabled)` を付けて無効状態に効かないようにする
- 論理プロパティ（`margin-inline-start`、`padding-block`）を使う
- 必要なら `@media (forced-colors: active)` で境界を補う

## 完了の定義（Definition of Done）

新しいコンポーネント、または既存コンポーネントの変更は、以下をすべて満たして完了です。

- [ ] semantic トークンだけで書かれている（`npm run check:css` が error 0）
- [ ] すべての状態（default / hover / active / focus / disabled / invalid など）のストーリーがある
- [ ] ライトとダークの両方で見た目を確認した（Storybook の「並べて表示」）
- [ ] addon-a11y の違反がゼロ
- [ ] キーボード操作を play 関数かテストで検証している
- [ ] [02 アクセシビリティ](./02-accessibility.md) の手動確認項目を実施した
- [ ] ストーリーの `docs.description` に「いつ使うか / いつ使わないか」を書いた
- [ ] `src/index.ts` から export し、DESIGN.md のコンポーネント一覧を更新した

## 部品の選び方

| やりたいこと | 使うもの | 使わないもの |
| --- | --- | --- |
| 処理を実行する | Button | Link |
| ページを移動する | Link（カード全体なら Card の `href`） | Button |
| 2〜6 個から 1 つ選ぶ | RadioGroup | Select |
| 7 個以上から 1 つ選ぶ | Select | RadioGroup |
| オン / オフ、複数選択 | Checkbox | トグルスイッチ（未提供） |
| ページ上部の重要なお知らせ | NotificationBanner | Tag |
| 一覧の項目の状態 | Tag（アイコン付き） | 色だけの点 |
| よくある質問など折りたたみ | Accordion | 独自のディスクロージャ |
| 要素の縦横の間隔 | Stack | 個別の margin |
