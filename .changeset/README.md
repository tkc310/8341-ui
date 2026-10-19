# Changesets

公開パッケージ（`8341-ui`・`8341-ui-tokens`）を変えた PR には、`make changeset` で変更内容を 1 つ追加します。
リリースの流れと版の決め方は [docs/releasing.md](../docs/releasing.md) を読んでください。

- `8341-ui` と `8341-ui-tokens` は同じ版でそろえます（`fixed`）
- 0.x の間は、利用側の修正が要る変更を minor、それ以外を patch にします
- 変更の説明は利用者向けに書きます（何が変わり、利用側で何をすればよいか）
