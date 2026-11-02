# 0020 Node.js を 26 LTS（Lithium）に更新する

- 日付: 2026-11-02
- 状態: 採用

## 背景

[0015](./0015-dependency-update-2026-10.md) は Node.js を LTS の最新にし、26 が LTS に入ったら更新するとした。2026-10-28 に 26.13.0 が LTS Lithium として公開された（https://nodejs.org/dist/index.json の `lts` は `Lithium`）。

## 決定

- `.tool-versions` の Node.js を 26.13.0 にする。CI の `actions/setup-node` は `node-version-file: .tool-versions` なので、同じ版を使う
- ルート `package.json` の `devEngines.runtime` を `>=26.13.0` にする（LTS 入り前の 26.0〜26.12 は対象にしない）
- `@types/node` は Node.js のメジャー版に合わせ、catalog を `^26.6.6` にする。26 系で、公開から 1 日以上経っている最新
- 他の依存の版は変えない

## 理由

- 0015 の方針（LTS の最新。Current のままでは上げない）に沿う
- 手元と CI の版は `.tool-versions` の 1 か所に置く、という既存の仕組みを変えない

## 影響・トレードオフ

- 開発環境は `make tools`（mise / asdf）で 26.13.0 を入れ直す
- 公開パッケージの API は変わらない。changeset は付けない
- `@types/node` に 26.13.0 と同じパッチ番号の版は無い。型定義はメジャーを合わせ、パッチは types の公開版に従う
