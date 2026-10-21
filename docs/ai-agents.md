# AI エージェントへの対応

このリポジトリの指示とスキルは、Claude Code を推奨エージェントとして書いている。Cursor と Codex でも同じものを読めるように、正本を 1 か所に置き、ほかの置き場所はシンボリックリンクにしている。

## 置き場所

| 種類 | 正本 | ほかのエージェント向けの入口 |
| --- | --- | --- |
| リポジトリの指示 | `AGENTS.md` | `CLAUDE.md` → `AGENTS.md`（シンボリックリンク） |
| スキル | `.claude/skills/<name>/SKILL.md` | `.agents/skills` → `.claude/skills`（シンボリックリンク） |
| 画面設計のルール | `docs/design-principles/` | `.claude/skills/design-principles/references` → `docs/design-principles`（シンボリックリンク） |

正本だけを編集する。シンボリックリンクの先を編集すれば、すべてのエージェントに反映される。

## エージェントごとの読み込み方

| エージェント | 指示 | スキル |
| --- | --- | --- |
| Claude Code（推奨） | `CLAUDE.md`（= `AGENTS.md`） | `.claude/skills/`。`/design-init` のようにスラッシュコマンドでも呼べる |
| Cursor | `AGENTS.md` | `.agents/skills/` と `.cursor/skills/`。互換のため `.claude/skills/` も読む |
| Codex | `AGENTS.md` | `.agents/skills/`（シンボリックリンクの先を辿る） |

- Cursor は `.agents/skills/` と `.claude/skills/` の両方を読むため、同じスキルが二重に見える場合がある。動作は同じなので、どちらを選んでもよい
- 質問の出し方はエージェントによって違う。スキルは「Claude Code では AskUserQuestion、ほかでは番号付きの質問リストをテキストで出す」と書いている

## スキルの一覧

| スキル | 使う場面 |
| --- | --- |
| `design-principles` | 画面設計のルールを適用する（新規作成・調整・レビューの 3 モード） |
| `design-init` / `design-adjust` / `design-review` | 上の各モードを直接呼ぶ |
| `ds-build-ui` | このデザインシステムで画面やフォームを作る・レビューする |
| `ds-improve` | このデザインシステム自体を改善する |
| `ds-storybook-preview` | 見た目が変わる PR に Storybook のプレビューを添える |
| `ds-slides` | このデザインシステムのトークンとデザイン原則で、発表用のスライドを作る |

<!-- factory:start -->
新しいデザインシステムを作るときは `ds-factory` を使う（[デザインシステムファクトリー](./factory.md)）。

<!-- factory:end -->

## Windows で使う場合

シンボリックリンクを使うため、Windows では次のどちらかが要る。設定しないと、リンクがパスを書いたテキストファイルとして取り出され、`CLAUDE.md` とスキルが読めなくなる。

- 開発者モードを有効にし、`git config --global core.symlinks true` を設定してから clone する
- WSL の中で clone して使う
