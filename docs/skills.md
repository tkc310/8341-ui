# スキルの一覧

AI エージェント（Claude Code・Cursor・Codex）がこのリポジトリで使うスキルの一覧です。スキルの正本は `.claude/skills/<名前>/` にあります（置き場所とエージェントごとの読み込み方は [ai-agents.md](./ai-agents.md)）。

## 呼び出し方

- 頼みごとを書けば、エージェントがスキルの説明（`description`）から選んで読み込みます（「スライドを作って」→ `ds-slides`）
- 名前で呼ぶこともできます。Claude Code・Cursor は `/ds-slides`、Codex は `$ds-slides`

## 一覧

| スキル | 使う場面 | 主な成果物 | 段階ごとに読む文書 |
| --- | --- | --- | --- |
| [`design-principles`](../.claude/skills/design-principles/SKILL.md) | 画面設計のルールを当てはめる（新規作成・調整・レビュー）。アクセシビリティの評価 | DESIGN.md、評価レポート | `mode-1-init.md` / `mode-2-adjust.md` / `mode-3-review.md`、`feedback.md`、`references/`（[design-principles](./design-principles/README.md)） |
| [`design-init`](../.claude/skills/design-init/SKILL.md) | 新しいプロダクトの DESIGN.md を作る（モード 1 の入口） | DESIGN.md | `design-principles` の `mode-1-init.md` |
| [`design-adjust`](../.claude/skills/design-adjust/SKILL.md) | 既存の DESIGN.md・トークン・コンポーネントを見直す（モード 2 の入口） | 更新した DESIGN.md・定義 | `design-principles` の `mode-2-adjust.md` |
| [`design-review`](../.claude/skills/design-review/SKILL.md) | 画面やモックアップをレビューする（モード 3 の入口） | 評価レポート | `design-principles` の `mode-3-review.md` |
| [`ds-build-ui`](../.claude/skills/ds-build-ui/SKILL.md) | このデザインシステムで画面やフォームを作る・レビューする | 画面のコード | DESIGN.md の必要な節、[02 アクセシビリティ](./rulebook/02-accessibility.md)、[05 文言](./rulebook/05-writing.md) |
| [`ds-slides`](../.claude/skills/ds-slides/SKILL.md) | トークンとデザイン原則に沿って発表用のスライドを作る | 1 ファイルの HTML デッキ（印刷で PDF） | `authoring.md`、`verify.md`、[07 スライド](./rulebook/07-slides.md) |
| [`ds-improve`](../.claude/skills/ds-improve/SKILL.md) | このデザインシステム自体を 1 件ずつ改善する | 改善の PR | [06 改善ループ](./rulebook/06-improvement-loop.md)、関係する章 |
| [`ds-storybook-preview`](../.claude/skills/ds-storybook-preview/SKILL.md) | 見た目が変わる PR に Storybook のプレビューを添える | Pages のプレビューと PR 本文のリンク | `pr-body.md`、`setup.md`（失敗したときだけ） |

迷ったら: 画面を **作る** なら `ds-build-ui`、画面を **決める・評価する** なら `design-principles`、**このリポジトリを直す** なら `ds-improve`。

<!-- factory:start -->
### デザインシステムファクトリー

| スキル | 使う場面 | 主な成果物 | 段階ごとに読む文書 |
| --- | --- | --- | --- |
| [`ds-factory`](../.claude/skills/ds-factory/SKILL.md) | このリポジトリをひな形に、新しいデザインシステムを作る | 新しいリポジトリ | `hearing.md`、`finish.md`、[factory.md](./factory.md) |

<!-- factory:end -->

## 必要なときだけ読み込む仕組み

エージェントのコンテキスト（一度に読める量）を節約するため、文書は 3 段階に分けて、必要になった段階で読みます。

| 段階 | いつ読まれるか | 何を置くか |
| --- | --- | --- |
| 0. 常に | 会話の始めに毎回 | `AGENTS.md`（= `CLAUDE.md`）と、各スキルの `name`・`description`。**どの文書をいつ読むかの索引だけ** を置き、ルールの本文は書かない |
| 1. スキルを使うとき | 頼みごとがスキルに当てはまったとき | `SKILL.md` の本体。**手順の骨組みだけ**（何を、どの順で、どの文書を読んでから行うか） |
| 2. その段階に入ったとき | 手順の中で、その段階に来たとき | スキルのディレクトリに置いた詳しい文書（`mode-1-init.md`・`authoring.md` など）と、`docs/` の文書。**大きい文書は該当する節だけ** を読む |

決まり:

- `SKILL.md` の本体は 2,000 字（空白を除く）以内にする。超えるなら、段階ごとの文書に分けて、その段階の手順からリンクする
- 段階ごとの文書は、スキルと同じディレクトリに `<内容>.md` の名前で置き、冒頭に「いつ読むか」を 1 行書く
- 同じ内容を複数の文書に写さない。入口のスキル（`design-init` など）は、元のスキルの文書を指すだけにする
- `AGENTS.md` から文書を自動で読み込む書き方（`@path/to/file.md` の取り込み）は使わない。表で場所を示し、必要になったら読む
- 大きい文書（DESIGN.md・`principles.md`・`wcag-for-designers.md` など）は、全文ではなく見出しで探して該当する節だけを読む

`make check` が、スキルの `name` とディレクトリ名の一致、`description` の有無、この一覧にすべてのスキルが載っていること、本体の字数、スキルの中の相対リンクの切れ、どこからも参照されない段階ごとの文書を検査します（`scripts/check-skills.ts`）。

## スキルを足す・直すとき

1. `.claude/skills/<名前>/SKILL.md` を書く。`description` には「いつ使うか」を具体的に書く（エージェントはここだけを見て選ぶ）
2. 本体が長くなるなら、段階ごとの文書に分ける（上の決まり）
3. この一覧の表に 1 行足す
4. `make check` を通し、`docs/improvement/log.md` に記録する
