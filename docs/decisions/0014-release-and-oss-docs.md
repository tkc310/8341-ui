# 0014 リリースの仕組みと OSS としての体裁を整える

- 日付: 2026-10-19
- 状態: 採用

## 背景
リポジトリ名を `design-system-myself` から `8341ui` に変えた（Pages の URL も `tkc310.github.io/8341ui/` に変わる）。
リリースは Changesets の「版を上げる PR」までしか動いておらず、npm に公開しない設定では、タグも GitHub Releases も作られなかった。shadcn のレジストリは常に最新だけを配るため、利用側が版を固定できなかった。

## 決定
- リリースは CI ではなく、権限のあるアカウント保有者が手元で行う（`scripts/release.mjs`）。リポジトリにトークンやシークレットを置かない
  - `pnpm release:version`: changeset を版に反映し、版を上げる PR を作る（人が作る PR なので CI がそのまま動く）
  - `pnpm release:publish [--npm]`: タグと GitHub Releases を作り、その版のレジストリを Pages の `r/v<版>/` に置く。`--npm` のときは手元の npm のログインで公開する
- main の公開ジョブは `r/v<版>/` を消さない。利用側はこの URL で版を固定できる
- 0.1.0 を初回リリースとして CHANGELOG を用意する
- パッケージに `repository`・`homepage`・`bugs` を入れる
- README にバッジを並べ、開発（CONTRIBUTING.md）・運用（docs/operations.md）・リリース（docs/releasing.md）・脆弱性の報告（SECURITY.md）を別の文書にする

## 理由
- 版の記録（タグと Releases）と、版ごとのレジストリがあれば、npm に公開しなくても利用側が変更を追い、版を固定できる
- 長く有効なトークンをリポジトリに置かなければ、漏えいしたときの被害を考えずに済む。権限のある人が手元で実行すれば、2 段階認証もそのまま使える
- 手順を README から切り出すと、README は「何か・どう使うか」に絞れる

## 影響・トレードオフ
- リリースはアカウント保有者がいないと進まない（自動化しない代わりの手間）
- 手元から npm に公開するため、npm の provenance は付かない。必要になったら npm の Trusted Publishing（OIDC。トークンを発行しない）を検討する
- `r/v<版>/` は増え続ける。古い版を消すときは gh-pages ブランチから手で消す
- 旧 URL（`tkc310.github.io/design-system-myself/`）のレジストリを登録している利用側は、URL の書き換えが要る
