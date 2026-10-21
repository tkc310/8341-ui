# AGENTS.md

AI エージェント向けの作業ガイドです。Claude Code（推奨）・Cursor・Codex のどれでも同じ内容を読みます（`CLAUDE.md` はこのファイルへのシンボリックリンク。詳しくは [`docs/ai-agents.md`](docs/ai-agents.md)）。

<!-- factory:start -->
このリポジトリは、**デザインシステム（8341-ui）** であり、同時に design-principles とヒアリングから新しいデザインシステムを作る **デザインシステムファクトリー** でもあります（[`docs/factory.md`](docs/factory.md)）。

<!-- factory:end -->

## まず読むもの

| やりたいこと                     | 読むもの                                                |
| -------------------------------- | ------------------------------------------------------- |
| このシステムで UI を作る         | `DESIGN.md` → `.claude/skills/ds-build-ui/SKILL.md`     |
| このシステム自体を直す・改善する | `docs/rulebook/` → `.claude/skills/ds-improve/SKILL.md` |
| 見た目が変わる変更を PR にする | `.claude/skills/ds-storybook-preview/SKILL.md`（ローカルでビルドして Pages に公開し、PR にリンクを添える） |
| 使えるスキルを知る・スキルを足す | `docs/skills.md`                                        |
| 判断の理由を知る                 | `docs/decisions/`                                       |
| 開発の手順・運用・リリースを知る | `CONTRIBUTING.md`・`docs/operations.md`・`docs/releasing.md` |
| 発表用のスライドを作る | `docs/rulebook/07-slides.md` → `.claude/skills/ds-slides/SKILL.md`（`make slides SRC=…`） |
| 画面を設計する・DESIGN.md を書く・デザインをレビューする | `docs/design-principles/` → `.claude/skills/design-principles/SKILL.md`（`/design-init`・`/design-adjust`・`/design-review`） |

<!-- factory:start -->
新しいデザインシステムを作るときは `.claude/skills/ds-factory/SKILL.md`（デザインシステムファクトリー）を使います。

<!-- factory:end -->
## 読み込みの方針

コンテキストを節約するため、文書は必要になったときにだけ読む（仕組みは `docs/skills.md`）。

- 作業を始める前に、上の表の文書をまとめて読まない。今の作業に当てはまる行だけを読む
- スキルは `SKILL.md` の手順に従い、段階ごとの文書はその段階に入ってから読む
- 大きい文書（`DESIGN.md`・`docs/design-principles/principles.md`・`wcag-for-designers.md` など）は、見出しで探して該当する節だけを読む

## 技術スタック

React 19 / TypeScript、Base UI v1、Tailwind CSS v4、tailwind-variants v3、shadcn 方式の配布、
W3C DTCG 2025.10 + Style Dictionary v5、Vite+（oxlint / oxfmt / Vitest 5 / tsdown / Vite Task）、pnpm 12、Changesets v3、dependency-cruiser、Storybook 10。
詳しくは [ADR-0008](docs/decisions/0008-stack-2026-10.md)。

## リポジトリの地図

```
packages/tokens/          トークン（8341-ui-tokens）
  src/{primitive,semantic}/*.tokens.json  DTCG 2025.10 のトークン ← 値を変えるならここ
  src/8341-ui.resolver.json  テーマ（light / dark）の構成
  src/palette.config.json プリミティブカラーの生成パラメータ
  src/contrast.rules.json コントラストの検証規則
  scripts/                生成・検証（build.ts は Style Dictionary v5）
packages/ui/              コンポーネント（8341-ui）
  src/components/ui/*/    index.tsx・index.test.tsx・index.stories.tsx・index.figma.ts（PascalCase。src/components/COMPONENT_STRUCTURE.md）
  src/lib/                tv / cn / focus（tw-merge-config.ts は生成物）
  src/styles/theme.css    Tailwind のテーマ（@utility focus-ring など）
  registry.json           shadcn レジストリ（生成物）
apps/storybook/           Storybook 10・e2e（Playwright）・レジストリの配信元
scripts/slides/            スライドのビルドと検査（deck.css はトークンだけで書く）
docs/design-principles/   画面設計のルール（UI の方向性 → 特化ルール → 原則 → WCAG）の正本
docs/rulebook/            ルールブック（design-principles とトークン・コンポーネントの対応）
docs/decisions/           ADR
docs/improvement/         改善バックログとログ
DESIGN.md                 エージェント向け仕様（auto ブロックは生成物）
templates/                プロダクト用 DESIGN.md の雛形
.claude/skills/           エージェントのスキル（正本。.agents/skills はここへのシンボリックリンク。一覧は docs/skills.md）
```

## コマンド

コマンドはすべて `make` で実行する（`make` だけで一覧が出る。中身は `Makefile`）。

```bash
make setup                  # 初回: .tool-versions の道具（mise / asdf）と依存を入れる
make dev                    # Storybook
make build                  # トークン → コンポーネント（vp pack + styles.css）
make build-storybook        # Storybook とレジストリ
make check                  # fmt・lint・型 ＋ 各パッケージの検査 ＋ dependency-cruiser ＋ スライド・スキルの検査
make test                   # 単体テスト（happy-dom）＋ ストーリーテスト（a11y）
make verify                 # check と test
make test-vrt / test-e2e    # 手動・都度実行
make generate               # 生成物をまとめて更新（tokens・design-md・tw-merge・registry）
make tokens / palette / design-md / tw-merge / figma / registry   # 生成物を個別に更新
make audit                  # 健康診断レポート（reports/audit.md）
make slides SRC=… / slides-check SRC=…   # スライドのデッキを作る・検査する
make changeset              # 変更内容を記録（公開されるパッケージを変えたとき）
make storybook-preview      # PR 用の Storybook を Pages に公開
make release-version / release-publish   # リリース（アカウント保有者が手元で）
```

## 守ること

- 画面設計のルールは `docs/design-principles/` を正とする。ギャップを見つけたら例外を作らず、そこを直す PR を出す
- 生成物を手で編集しない: `packages/tokens/dist/`、`packages/tokens/src/primitive/color.tokens.json`、`packages/ui/src/lib/tw-merge-config.ts`、`packages/ui/registry.json`、DESIGN.md の `<!-- auto:* -->` ブロック
- コンポーネントは semantic トークンの Tailwind クラスだけを使い、`tv` / `cn` は `@/lib/tv` から import する
- コンポーネントの構造は `packages/ui/src/components/COMPONENT_STRUCTURE.md` に従う（`ui/<PascalCase>/index.tsx` に本体、テスト・ストーリー・フック・子コンポーネントを同じディレクトリに。ほかのコンポーネントは `@/components/ui/<Name>/index` で import）
- 任意値・手書き CSS では `var(--8341-*)` を参照する（`var(--color-*)` は未定義になりうる）
- チェックを通すためにルールを緩めない（必要なら ADR を書いて人間に確認する）
- 変更したら `make verify` を通し、`docs/improvement/log.md` に記録する
- コミットメッセージと PR のタイトルは Conventional Commits（`feat(button): …`・`fix: …`・`docs: …`。要約と本文は日本語）。種類・範囲・破壊的変更の書き方は [CONTRIBUTING.md](CONTRIBUTING.md#コミットメッセージと-pr-タイトル)
- 公開パッケージを変えたら `make changeset` を添える（版の決め方は `docs/releasing.md`）
