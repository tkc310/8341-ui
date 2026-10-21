# 変わったストーリーと PR 本文（ds-storybook-preview の手順 3）

## 変わったストーリーを特定する

- 変えたファイルから、関係するストーリーを選ぶ
  - コンポーネントを変えた → そのコンポーネントの全ストーリー
  - トークンを変えた → `Foundations` のストーリーと、そのトークンを使うコンポーネント（`grep -rn "<Tailwind のクラス名>" packages/ui/src/components`）
- ストーリー ID は、ビルド結果の `index.json` から引くのが確実

  ```bash
  jq -r '.entries[] | select(.importPath | contains("/Button/")) | "\(.id)\t\(.title) / \(.name)"' apps/storybook/storybook-static/index.json
  ```

## リンクの形

ストーリーごとにライトとダークのリンクを付け、見比べてほしい点を 1 行で書く。`<P>` はプレビューの URL。

- ライト: `<P>?path=/story/<id>&globals=theme:light`
- ダーク: `<P>?path=/story/<id>&globals=theme:dark`
- 並べて表示: `<P>?path=/story/<id>&globals=theme:side-by-side`

## 本文を更新する

REST API で更新する（`gh pr edit` は GraphQL を使うので、環境によっては通らない）。

```bash
gh api repos/tkc310/8341-ui/pulls/<番号> --jq .body > /tmp/pr-body.md
# <!-- storybook-preview:start --> と <!-- storybook-preview:end --> の間を書き換える
gh api -X PATCH repos/tkc310/8341-ui/pulls/<番号> -F body=@/tmp/pr-body.md
```

## 書く内容の例

```markdown
<!-- storybook-preview:start -->
プレビュー: https://tkc310.github.io/8341-ui/pr-preview/pr-12/ （abc1234 時点）

| ストーリー | ライト | ダーク | 見てほしい点 |
| --- | --- | --- | --- |
| Button / Variants | [開く](…&globals=theme:light) | [開く](…&globals=theme:dark) | danger の背景色を濃くした |
| Foundations / Colors | [開く](…) | [開く](…) | `bg.danger` の値 |
<!-- storybook-preview:end -->
```

push を重ねて変わったストーリーが増えたら、表に足す。
