# リポジトリの前提（一度だけ、人間が行う）

公開に失敗する、または Pages にプレビューが出ないときに読む。

| 何が | どこに | 誰が置くか |
| --- | --- | --- |
| PR ごとのプレビュー | `https://tkc310.github.io/8341-ui/pr-preview/pr-<番号>/` | `ds-storybook-preview`（`make storybook-preview`） |
| main の Storybook とレジストリ | `https://tkc310.github.io/8341-ui/` | CI（main への push 時） |

どちらも `gh-pages` ブランチに置かれる（ADR-0011）。PR を閉じると、プレビューは CI（`storybook-preview-cleanup.yml`）が消す。

## 設定

- Settings > Pages > Build and deployment > Source を「Deploy from a branch」、Branch を `gh-pages` / `(root)` にする
  - 「GitHub Actions」のままだと `gh-pages` ブランチの内容は配信されない
  - `gh-pages` ブランチは、最初の `make storybook-preview` か main への最初の push で作られる
- Settings > Actions > General > Workflow permissions を「Read and write permissions」にする（main の配信と PR を閉じたときの削除に使う）
- ローカルに `gh`（GitHub CLI、ログイン済み）と、`gh-pages` へ push できる権限があること

## 公開の流れ（`make storybook-preview` の中身）

トークンの生成 → レジストリのビルド → Storybook のビルド → `gh-pages` の `pr-preview/pr-<番号>/` へ push。未コミット・未 push のまま実行すると、PR の差分とプレビューが食い違うため、スクリプトが警告を出す。
