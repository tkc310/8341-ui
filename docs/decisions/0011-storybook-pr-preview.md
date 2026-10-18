# 0011 PR ごとの Storybook をローカルでビルドし、GitHub Pages の gh-pages ブランチに置く

- 日付: 2026-10-18
- 状態: 採用

## 背景
見た目の変わる PR を、レビューする人が手元でビルドせずに確かめられるようにしたい。
開発はエージェントがローカルで進めることを想定しており、変更を作ったエージェントがそのまま見た目の確認とリンクの添付まで行うのが自然である。
リポジトリは公開なので、GitHub Pages を無料で使える。

## 決定
- Pages の配信元を「GitHub Actions」から「`gh-pages` ブランチ」に変える
  - 直下: main の Storybook と shadcn レジストリ（`/r/*.json`）。CI が main への push で置く（`clean-exclude: pr-preview` で PR 用を消さない、強制 push しない）
  - `pr-preview/pr-<番号>/`: PR ごとの Storybook。**ローカル**で `pnpm storybook:preview` が置く（`apps/storybook/scripts/publish-preview.ts`）
- PR を閉じたら、CI（`storybook-preview-cleanup.yml`）が `pr-preview/pr-<番号>/` を消す。ビルドはしない
- 手順は `.claude/skills/ds-storybook-preview/SKILL.md`。PR テンプレートに「Storybook プレビュー」節を置き、変わったストーリーへのライト / ダークのリンクを書く

## 理由
- Pages はリポジトリにつき 1 サイトで、Actions 方式（`actions/deploy-pages`）は配信のたびにサイト全体を置き換える。PR ごとの置き場を共存させるには、ブランチ方式でディレクトリを分けるしかない
- ローカルでビルドすれば、CI の分数を使わず、エージェントがビルド失敗をその場で直せる。どのストーリーを見ればよいかも、変更を作った本人が一番よく分かる
- Chromatic などの外部サービスは、無料枠と外部アカウントの管理が要る。自分用のシステムには過剰

## 影響・トレードオフ
- 公開するには `gh-pages` へ push できる権限と、ログイン済みの `gh` が要る。フォークからの PR はプレビューを作れない
- ローカルの未コミットの変更を含んでビルドできてしまう。スクリプトは警告を出すだけなので、push してから公開する運用で揃える
- プレビューは公開リポジトリの Pages として誰でも見られる。秘密の値を含めてビルドしない
- `gh-pages` ブランチの履歴は増え続ける。重くなったら、直下と `pr-preview/` の現状だけを残す形で作り直す（手順は必要になったときに ADR を足す）
- 初回だけ、リポジトリの設定（Pages の配信元、Actions の書き込み権限）を人間が変える必要がある
