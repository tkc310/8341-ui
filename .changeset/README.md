# Changesets

変更を加えた PR には、`pnpm changeset` で変更内容を 1 つ追加します。

- `tkc310-ui` と `tkc310-ui-tokens` は同じバージョンで揃えて公開します（`fixed`）
- トークンの値を変えたら minor、名前を消したり変えたりしたら major
- 変更の説明は利用者向けに書きます（何が変わり、利用側で何をすればよいか）
