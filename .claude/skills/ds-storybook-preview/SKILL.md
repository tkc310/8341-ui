---
name: ds-storybook-preview
description: コンポーネントやトークンの見た目が変わる変更を PR にするとき・PR に追加で push したときに使う。ローカルで Storybook をビルドして GitHub Pages に公開し、変わったストーリーへのリンク（ライト / ダーク）を PR 本文に添える。
---

# PR に Storybook のプレビューを添える

レビューする人が、手元でビルドしなくても変更後の見た目をブラウザで確かめられるようにする。
**ビルドと公開は、開発しているエージェントがローカルで行う**（CI ではビルドしない）。

| 何が | どこに | 誰が置くか |
| --- | --- | --- |
| PR ごとのプレビュー | `https://tkc310.github.io/8341ui/pr-preview/pr-<番号>/` | このスキル（`pnpm storybook:preview`） |
| main の Storybook とレジストリ | `https://tkc310.github.io/8341ui/` | CI（main への push 時） |

どちらも `gh-pages` ブランチに置かれる（ADR-0011）。PR を閉じると、プレビューは CI（`storybook-preview-cleanup.yml`）が消す。

## いつ使うか

次のどれかを変えて、PR を作るとき、または PR に追加で push したとき。

- `packages/ui/src/`（コンポーネント・スタイル）
- `packages/tokens/src/`（トークンの値）
- `apps/storybook/src/`、`apps/storybook/.storybook/`（ストーリー・テーマ切り替え）
- 上のどれでもないが見た目に影響するもの（Tailwind・Base UI など依存の更新、ビルド設定）

見た目が変わらない変更（文書だけ、スクリプトだけ）には使わない。

## 手順

1. **コミットして push し、PR を作る**
   - プレビューは PR の番号ごとに置くので、先に PR が要る
   - PR 本文は `.github/pull_request_template.md` を使う。「Storybook プレビュー」節の印（`<!-- storybook-preview:start -->` 〜 `<!-- storybook-preview:end -->`）は消さない
   - push してから公開する。未コミット・未 push のままだと、PR の差分とプレビューが食い違う（スクリプトが警告を出す）

2. **ビルドして公開する**（リポジトリのルートで）

   ```bash
   pnpm storybook:preview
   ```

   - トークンの生成 → レジストリのビルド → Storybook のビルド → `gh-pages` の `pr-preview/pr-<番号>/` へ push、の順に動く
   - PR 番号は今のブランチから自動で探す。見つからないときは `pnpm build:storybook && pnpm --filter 8341-ui-storybook preview:publish -- --pr <番号>`
   - 最後に URL が出る。Pages への反映に 1〜2 分かかる
   - ビルドが失敗したら、原因を直してから公開する。ビルドの通らない PR はレビューに出さない

3. **変わったストーリーを特定する**
   - 変えたファイルから、関係するストーリーを選ぶ
     - コンポーネントを変えた → そのコンポーネントの全ストーリー
     - トークンを変えた → `Foundations` のストーリーと、そのトークンを使うコンポーネント（`grep -rn "<Tailwind のクラス名>" packages/ui/src/components`）
   - ストーリー ID は、ビルド結果の `index.json` から引くのが確実

     ```bash
     jq -r '.entries[] | select(.importPath | contains("/button/")) | "\(.id)\t\(.title) / \(.name)"' apps/storybook/storybook-static/index.json
     ```

4. **PR 本文の「Storybook プレビュー」節を書き換える**
   - ストーリーごとにライトとダークのリンクを付け、見比べてほしい点を 1 行で書く
   - リンクの形（`<P>` はプレビューの URL）
     - ライト: `<P>?path=/story/<id>&globals=theme:light`
     - ダーク: `<P>?path=/story/<id>&globals=theme:dark`
     - 並べて表示: `<P>?path=/story/<id>&globals=theme:side-by-side`
   - 本文は REST API で更新する（`gh pr edit` は GraphQL を使うので、環境によっては通らない）

     ```bash
     gh api repos/tkc310/8341ui/pulls/<番号> --jq .body > /tmp/pr-body.md
     # <!-- storybook-preview:start --> と <!-- storybook-preview:end --> の間を書き換える
     gh api -X PATCH repos/tkc310/8341ui/pulls/<番号> -F body=@/tmp/pr-body.md
     ```

   - 書く内容の例

     ```markdown
     <!-- storybook-preview:start -->
     プレビュー: https://tkc310.github.io/8341ui/pr-preview/pr-12/ （abc1234 時点）

     | ストーリー | ライト | ダーク | 見てほしい点 |
     | --- | --- | --- | --- |
     | Button / Variants | [開く](…&globals=theme:light) | [開く](…&globals=theme:dark) | danger の背景色を濃くした |
     | Foundations / Colors | [開く](…) | [開く](…) | `bg.danger` の値 |
     <!-- storybook-preview:end -->
     ```

5. **自分でも開いて確かめる**
   - ブラウザを使える環境なら、上のリンクを開き、ライト・ダーク・フォーカス表示（Tab キー）を目で確かめる。a11y パネルに違反が出ていないかも見る
   - 開けない環境なら、PR 本文に「エージェントは描画を確認していない」と書き、人間に確認を頼む

6. **push するたびに 2〜4 をやり直す**
   - URL は変わらない。本文の「〜時点」のコミットを更新し、変わったストーリーが増えたら表に足す

## 前提（リポジトリの設定。一度だけ、人間が行う）

- Settings > Pages > Build and deployment > Source を「Deploy from a branch」、Branch を `gh-pages` / `(root)` にする
  - 「GitHub Actions」のままだと `gh-pages` ブランチの内容は配信されない
  - `gh-pages` ブランチは、最初の `pnpm storybook:preview` か main への最初の push で作られる
- Settings > Actions > General > Workflow permissions を「Read and write permissions」にする（main の配信と PR を閉じたときの削除に使う）
- ローカルに `gh`（GitHub CLI、ログイン済み）と、`gh-pages` へ push できる権限があること

## やってはいけないこと

- プレビューの URL だけを貼って、どのストーリーを見ればよいか書かない
- `gh-pages` ブランチを手で編集する・強制 push する（main の Storybook や他の PR のプレビューが消える）
- 他の PR のプレビュー（`pr-preview/pr-<別の番号>/`）を上書き・削除する
- 秘密の値（`.env` など）が入る状態でビルドして公開する。公開リポジトリの Pages は誰でも見られる
