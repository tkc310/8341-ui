---
name: ds-improve
description: このデザインシステム自体を改善するときに使う。監査レポートやバックログ、Issue から 1 件選んで直し、再発防止のチェックを足して PR にする。
---

# デザインシステムの改善を 1 件回す

`docs/rulebook/06-improvement-loop.md` の手順をエージェントが実行するためのスキル。

## 手順

1. **現状を知る**
   - `make audit` を実行し、`reports/audit.md` を読む
   - `docs/improvement/backlog.md` と、ラベル `improvement` / `design-audit` の未解決 Issue を確認する
2. **1 件だけ選ぶ**
   - 優先度: アクセシビリティ > 一貫性 > 開発体験 > 見た目
   - 1 PR 1 改善。大きいものは分割してバックログに戻す
3. **直す**
   - 関連するルールブックの章、DESIGN.md、該当コンポーネントのソースとストーリーを先に読む
   - トークンを変えるなら `packages/tokens/src/*.tokens.json` を編集し、`make tokens` と `design-md`・`tw-merge` を実行する（生成物を手で編集しない）
   - 値や方針を変えるなら `docs/decisions/` に ADR を追加する
4. **再発を防ぐ（省略しない）**
   - コントラスト → `tokens/contrast.rules.json` に組み合わせを追加
   - クラスの書き方 → `packages/ui/scripts/audit-classes.ts`、依存の向き → `.dependency-cruiser.cjs`、lint → ルートの `vite.config.ts` の `lint` にルールを追加
   - 振る舞い → テストかストーリーの play 関数を追加
   - 判断基準 → ルールブックに追記
5. **確かめる**
   - `make verify` が通ること。見た目を変えたら `make test-vrt` も
   - 見た目を変えたら Storybook の「並べて表示」でライト / ダークを確認する
6. **記録して出す**
   - `docs/improvement/log.md` の表の先頭に 1 行追記（日付・種別・内容・再発防止）
   - バックログから該当行を消す
   - 公開パッケージを変えたら `make changeset` で変更内容を記録する
   - PR テンプレートのチェックリストを埋めて PR を作る
   - 見た目を変えたら、`ds-storybook-preview` スキルで Storybook のプレビューを公開し、PR にリンクを添える

## やってはいけないこと

- チェックを通すためにルール（`contrast.rules.json` の min や audit のルール）を緩める。緩める必要があるなら ADR で理由を書き、人間の承認を得る
- 生成ファイル（AGENTS.md の「守ること」に一覧）を直接編集する
- 複数の改善を 1 つの PR に混ぜる
