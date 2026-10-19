# 0014 リリースの仕組みと OSS としての体裁を整える

- 日付: 2026-10-19
- 状態: 採用

## 背景
リポジトリ名を `design-system-myself` から `8341ui` に変えた（Pages の URL も `tkc310.github.io/8341ui/` に変わる）。
リリースは Changesets の「版を上げる PR」までしか動いておらず、npm に公開しない設定では、タグも GitHub Releases も作られなかった。shadcn のレジストリは常に最新だけを配るため、利用側が版を固定できなかった。

## 決定
- 版を上げる PR をマージしたら、npm に公開しないときも `changeset tag` でタグを作り、GitHub Releases を作る（changesets/action が「New tag」の出力から作る）
- リリースした版のレジストリを Pages の `r/v<版>/` に残し、利用側が版を固定できるようにする。main の公開ジョブはこの場所を消さない
- 0.1.0 を初回リリースとして CHANGELOG を用意する
- パッケージに `repository`・`homepage`・`bugs`・`publishConfig.provenance` を入れる（npm の provenance に `repository` が要る）
- README にバッジを並べ、開発（CONTRIBUTING.md）・運用（docs/operations.md）・リリース（docs/releasing.md）・脆弱性の報告（SECURITY.md）を別の文書にする

## 理由
- 版の記録（タグと Releases）と、版ごとのレジストリがあれば、npm に公開しなくても利用側が変更を追い、版を固定できる
- 手順を README から切り出すと、README は「何か・どう使うか」に絞れる

## 影響・トレードオフ
- `GITHUB_TOKEN` で作った版を上げる PR では CI が動かない。`CHANGESETS_TOKEN` を登録するか、PR を閉じて開き直す
- `r/v<版>/` は増え続ける。古い版を消すときは gh-pages ブランチから手で消す
- 旧 URL（`tkc310.github.io/design-system-myself/`）のレジストリを登録している利用側は、URL の書き換えが要る
