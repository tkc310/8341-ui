# リリース

8341-ui のリリースは Changesets で管理する。版を決めるのは人間（PR に添える changeset）で、タグ・GitHub Releases・版ごとのレジストリは CI が作る。

## 配布するもの

| チャネル | 中身 | 版の固定 |
| --- | --- | --- |
| shadcn レジストリ（最新） | `https://tkc310.github.io/8341ui/r/{name}.json` | できない（常に main の最新） |
| shadcn レジストリ（版ごと） | `https://tkc310.github.io/8341ui/r/v<版>/{name}.json` | できる（リリースした版のまま残る） |
| GitHub Releases | 各版の変更内容（CHANGELOG の該当節） | タグ `8341-ui@<版>`・`8341-ui-tokens@<版>` |
| npm（任意） | `8341-ui`・`8341-ui-tokens` | できる。既定では公開しない（下の「npm に公開する」） |

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
変更の PR（changeset を添える）
   │ マージ
   ▼
main ──▶ CI の release ジョブ ──▶「chore: リリース（Version Packages）」PR を作る / 更新する
                                    （版の更新と CHANGELOG.md の追記。changeset が溜まるほど内容が増える）
   │ その PR をマージ
   ▼
main ──▶ CI の release ジョブ ──▶ タグ 8341-ui@x.y.z / 8341-ui-tokens@x.y.z
                               ├─▶ GitHub Releases（本文は CHANGELOG の該当節）
                               ├─▶ Pages の r/vx.y.z/（その版のレジストリ）
                               └─▶ npm に公開（ENABLE_NPM_PUBLISH が true のときだけ）
```

## 手順

### 1. 変更の PR に changeset を添える

```bash
pnpm changeset
```

- 対象のパッケージと版の上げ幅（patch / minor / major）を選び、利用者向けの説明を書く
- `.changeset/*.md` ができるので、PR に含める

### 2. 版を上げる PR を確認してマージする

- main にマージされると、CI が「chore: リリース（Version Packages）」PR を作る（次の変更が入るたびに更新される）
- 版と CHANGELOG を確認し、リリースしてよいときにマージする

`GITHUB_TOKEN` で作られた PR では CI が動かない（GitHub の仕様）。main の保護で `check`・`test` を必須にしている場合は、次のどちらかで CI を動かす。

- リポジトリのシークレット `CHANGESETS_TOKEN` に、このリポジトリの Contents と Pull requests に書き込める fine-grained token を登録する（以後、自動で CI が動く）
- PR をいったん閉じて開き直す

### 3. リリースを確認する

- GitHub の Releases に新しい版が出ている
- `https://tkc310.github.io/8341ui/r/v<版>/button.json` が開ける

## npm に公開する

既定では npm に公開しない（タグと GitHub Releases、版ごとのレジストリだけを作る）。公開するときは、リポジトリの Settings > Secrets and variables > Actions で次を設定する。

| 種類 | 名前 | 値 |
| --- | --- | --- |
| 変数 | `ENABLE_NPM_PUBLISH` | `true` |
| シークレット | `NPM_TOKEN` | npm の Automation token（または Granular token） |

公開は provenance（来歴の証明）つきで行う（`publishConfig.provenance`）。設定後に版を上げる PR をマージすると、`pnpm release`（ビルド → `changeset publish`）が動く。

## やり直す

- 誤った版を出したときは、その版を消さずに、修正した次の版を出す
- GitHub Releases とタグを消す必要があるときは、Releases の画面から消し、`git push origin :refs/tags/<タグ>` でタグも消す。版ごとのレジストリ（`r/v<版>/`）も gh-pages ブランチから消す
- npm に公開した版は、72 時間以内なら `npm unpublish`、それ以降は `npm deprecate` で利用者に知らせる
