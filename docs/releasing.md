# リリース

8341-ui のリリースは、**権限のあるアカウント保有者が手元で実行する**。リポジトリにトークンやシークレットは置かない（ADR-0014）。
版の記録には Changesets を使い、タグ・GitHub Releases・版ごとのレジストリ・npm への公開（任意）は `scripts/release.mjs` が、実行者の `gh` と `npm` のログインで行う。

## 配布するもの

| チャネル | 中身 | 版の固定 |
| --- | --- | --- |
| shadcn レジストリ（最新） | `https://tkc310.github.io/8341ui/r/{name}.json`（main への push で CI が更新） | できない（常に main の最新） |
| shadcn レジストリ（版ごと） | `https://tkc310.github.io/8341ui/r/v<版>/{name}.json` | できる（リリースした版のまま残る） |
| GitHub Releases | 各版の変更内容（CHANGELOG の該当節） | タグ `8341-ui@<版>`・`8341-ui-tokens@<版>` |
| npm（任意） | `8341-ui`・`8341-ui-tokens` | できる。`--npm` を付けたときだけ公開する |

利用側で版を固定するときは、`components.json` のレジストリの URL に版を入れる。

```json
{
  "registries": { "@8341": "https://tkc310.github.io/8341ui/r/v0.1.0/{name}.json" }
}
```

## 版の決め方

- [セマンティック バージョニング](https://semver.org/lang/ja/)に従う。`8341-ui` と `8341-ui-tokens` は同じ版でそろえる（`.changeset/config.json` の `fixed`）
- 0.x の間は、次のように決める

| 変更 | 版 |
| --- | --- |
| 利用側の修正が要る（トークン・props・クラス名の削除や改名、既定値の変更で見た目が大きく変わる） | minor |
| 利用側の修正が要らない（不具合の修正、トークンの値の微調整、部品の追加） | patch |
| 文書・CI・リポジトリ内の道具だけの変更 | changeset を付けない |

1.0.0 にしたら、利用側の修正が要る変更は major、部品やトークンの追加は minor、修正は patch にする。

## 流れ

```
変更の PR（changeset を添える） ──マージ──▶ main（.changeset/*.md が溜まる）

【手元】pnpm release:version
   └─▶「chore: リリース v<版>」PR（版の更新と CHANGELOG の追記）。人が作る PR なので CI がそのまま動く
          │ レビューしてマージ
          ▼
【手元】main で pnpm release:publish [--npm]
   ├─▶ ビルド（トークン・コンポーネント・レジストリ）
   ├─▶ タグ 8341-ui@<版> / 8341-ui-tokens@<版> を作って push
   ├─▶ GitHub Releases（本文は CHANGELOG の該当節）
   ├─▶ gh-pages の r/v<版>/（その版のレジストリ）
   └─▶ npm に公開（--npm のときだけ）
```

## 前提（実行する人）

| 道具 | 状態 |
| --- | --- |
| リポジトリの権限 | main・gh-pages への push とリリースの作成ができる（Maintain 以上） |
| GitHub CLI（`gh`） | `gh auth login` 済み |
| npm（`--npm` のときだけ） | `npm login` 済みで、パッケージの公開権限がある。2 段階認証の OTP を手元で入力する |
| 依存 | `pnpm install` 済み |

## 手順

### 1. 変更の PR に changeset を添える（開発者）

```bash
pnpm changeset
```

対象のパッケージと版の上げ幅（patch / minor / major）を選び、利用者向けの説明を書く。`.changeset/*.md` を PR に含める。

### 2. 版を上げる PR を作る（アカウント保有者）

```bash
git switch main && git pull
pnpm release:version
```

- `changeset version` で版と CHANGELOG を更新し、`release/v<版>` ブランチから PR を作る
- PR の CI が通り、版と CHANGELOG を確認できたらマージする

### 3. リリースする（アカウント保有者）

```bash
git switch main && git pull
pnpm release:publish --dry-run   # 何をするか確認する
pnpm release:publish             # npm に公開しないとき
pnpm release:publish --npm       # npm にも公開するとき
```

- main が origin/main と一致し、未コミットの変更がないことを確かめてから動く
- 同じ版のタグがすでにあれば止まる（二重リリースを防ぐ）

### 4. 確かめる

- GitHub の Releases に新しい版が出ている
- `https://tkc310.github.io/8341ui/r/v<版>/button.json` が開ける（Pages の反映に数分かかる）
- npm に公開したときは `npm view 8341-ui version`

## npm について

- 手元から公開するため、npm の provenance（どの CI でビルドしたかの証明）は付かない
- CI から公開して provenance を付けたくなったら、npm の Trusted Publishing（GitHub Actions の OIDC を使い、npm のトークンを発行しない方式）を検討する。その場合は ADR を書く

## やり直す

- 誤った版を出したときは、その版を消さずに、修正した次の版を出す
- GitHub Releases とタグを消す必要があるときは、Releases の画面から消し、`git push origin :refs/tags/<タグ>` でタグも消す。版ごとのレジストリ（`r/v<版>/`）も gh-pages ブランチから消す
- npm に公開した版は、72 時間以内なら `npm unpublish`、それ以降は `npm deprecate` で利用者に知らせる
