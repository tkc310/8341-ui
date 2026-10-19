# 運用

このリポジトリを動かし続けるための仕組みと、GitHub の設定をまとめる。開発の手順は [CONTRIBUTING.md](../CONTRIBUTING.md)、リリースは [releasing.md](./releasing.md)。

## ワークフロー

| ワークフロー | きっかけ | やること |
| --- | --- | --- |
| `CI`（`ci.yml`） | PR、main への push | `check`（fmt・lint・型・生成物の鮮度・コントラスト・クラス監査・依存の向き）、`test`（単体テスト、全ストーリーの実ブラウザ描画と axe）。main では `storybook`（Pages への公開）も動く。リリースは CI では行わない（[releasing.md](./releasing.md)） |
| `Storybook preview cleanup` | PR を閉じたとき | その PR のプレビュー（`pr-preview/pr-<番号>/`）を消す |
| `Branch cleanup` | main への push、手動 | マージ済み・閉じた PR の元ブランチと `ci-debug*` を、環境 `branch-cleanup` の承認後に消す |
| `Weekly audit` | 毎週月曜、手動 | 健康診断レポート（warning の蓄積、コントラストの余裕、未使用トークン、ストーリーの欠け）を Issue に起票する |

## GitHub Pages の構成

配信元は `gh-pages` ブランチ（Settings > Pages > Deploy from a branch）。

```
https://tkc310.github.io/8341ui/
├── index.html …            main の Storybook（CI の storybook ジョブ）
├── r/{name}.json           最新のレジストリ（同上）
├── r/v<版>/{name}.json     リリースした版のレジストリ（手元の make release-publish。残し続ける）
└── pr-preview/pr-<番号>/   PR ごとの Storybook（ローカルの make storybook-preview。PR を閉じると消える）
```

`gh-pages` ブランチは手で編集しない・強制 push しない（ほかの置き場所が消える）。

## トークンとシークレット

リポジトリにはトークンもシークレットも登録しない。権限が要る操作（リリース、npm への公開、リポジトリの設定）は、権限のあるアカウント保有者が手元の `gh`・`npm` のログインで行う。
ワークフローが使うのは、GitHub が実行ごとに自動で発行して破棄する `GITHUB_TOKEN` だけで、権限は各ワークフローの `permissions` で必要な範囲に絞っている。

## リポジトリの設定（一度だけ）

| 設定 | 場所・コマンド | 目的 |
| --- | --- | --- |
| Pages の配信元を `gh-pages` / `(root)` に | Settings > Pages | Storybook・レジストリ・プレビューの公開 |
| main の保護（PR 必須、`check`・`test` の通過必須） | 下の「main の保護」 | CI が落ちたままのマージを防ぐ |
| 環境 `branch-cleanup` の承認者 | 下の「ブランチの片付け」 | ブランチ削除を承認制にする |
| マージ後に元ブランチを自動で消す（任意） | `gh api -X PATCH repos/tkc310/8341ui -F delete_branch_on_merge=true` | 片付けの手間を減らす |
| 脆弱性の非公開報告を有効に | Settings > Code security > Private vulnerability reporting | [SECURITY.md](../SECURITY.md) の報告窓口 |

### main の保護

```bash
gh api -X POST repos/tkc310/8341ui/rulesets --input - <<'EOF'
{
  "name": "main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request", "parameters": {
        "required_approving_review_count": 0, "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false, "require_last_push_approval": false,
        "required_review_thread_resolution": false } },
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [
          { "context": "check", "integration_id": 15368 },
          { "context": "test", "integration_id": 15368 } ] } }
  ]
}
EOF
```

### ブランチの片付け

`Branch cleanup` は main への push のたびに削除候補を一覧にし、承認されてから消す（Actions の画面か、通知の「Review deployments」から承認）。候補が無いときは承認の依頼も出ない。承認者を設定しないと、承認なしで消える。

```bash
gh api -X PUT repos/tkc310/8341ui/environments/branch-cleanup \
  -F "reviewers[][type]=User" -F "reviewers[][id]=$(gh api user --jq .id)"
```

## 改善ループ

品質の問題は「気づく → 記録する → 直す → 再発を防ぐ」で回す（[rulebook/06-improvement-loop.md](./rulebook/06-improvement-loop.md)）。

- 週次監査の Issue と、Issue テンプレート「改善提案」で気づいたことを集める
- 候補は [improvement/backlog.md](./improvement/backlog.md)、直したものは [improvement/log.md](./improvement/log.md) に 1 行で残す
- AI エージェントに回させるときは `ds-improve` スキルを使う

## 困ったとき

| 症状 | 原因と対処 |
| --- | --- |
| Pages が古い内容のまま | 配信のキャッシュ。`gh-pages` ブランチが新しければ数分で反映される |
| `make install-ci`（`pnpm install --frozen-lockfile`）が失敗する | 依存を変えたのにロックファイルを更新していない。手元で `make install` してコミットする |
| `check` が生成物のずれで失敗する | トークンやコンポーネントを変えたら、`design-md`・`tw-merge`・`registry` を実行して生成物を更新する |
| Windows で `CLAUDE.md` やスキルが読めない | シンボリックリンクが取り出せていない（[ai-agents.md](./ai-agents.md) の「Windows で使う場合」） |
