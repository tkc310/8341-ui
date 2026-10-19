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
| 判断の理由を知る                 | `docs/decisions/`                                       |
| 開発の手順・運用・リリースを知る | `CONTRIBUTING.md`・`docs/operations.md`・`docs/releasing.md` |
| 画面を設計する・DESIGN.md を書く・デザインをレビューする | `docs/design-principles/` → `.claude/skills/design-principles/SKILL.md`（`/design-init`・`/design-adjust`・`/design-review`） |

<!-- factory:start -->
新しいデザインシステムを作るときは `.claude/skills/ds-factory/SKILL.md`（デザインシステムファクトリー）を使います。

<!-- factory:end -->
## 技術スタック

React 19 / TypeScript、Base UI v1、Tailwind CSS v4、tailwind-variants v3、shadcn 方式の配布、
W3C DTCG 2025.10 + Style Dictionary v5、Vite+（oxlint / oxfmt / Vitest 5 / tsdown / Vite Task）、pnpm 11、Changesets v3、dependency-cruiser、Storybook 10。
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
  src/components/*/       *.tsx・index.ts・*.stories.tsx・*.figma.ts
  src/lib/                tv / cn / focus（tw-merge-config.ts は生成物）
  src/styles/theme.css    Tailwind のテーマ（@utility focus-ring など）
  registry.json           shadcn レジストリ（生成物）
apps/storybook/           Storybook 10・e2e（Playwright）・レジストリの配信元
docs/design-principles/   画面設計のルール（UI の方向性 → 特化ルール → 原則 → WCAG）の正本
docs/rulebook/            ルールブック（design-principles とトークン・コンポーネントの対応）
docs/decisions/           ADR
docs/improvement/         改善バックログとログ
DESIGN.md                 エージェント向け仕様（auto ブロックは生成物）
templates/                プロダクト用 DESIGN.md の雛形
.claude/skills/           エージェントのスキル（正本。.agents/skills はここへのシンボリックリンク）
```

## コマンド

```bash
mise install                               # .tool-versions の Node.js・pnpm・gh を入れる（asdf なら asdf install）
pnpm install
pnpm dev                                   # Storybook
pnpm build                                 # トークン → UI（vp pack + styles.css）→ Storybook
pnpm check                                 # vp check（fmt・lint・型）＋ 各パッケージの検査 ＋ dependency-cruiser
pnpm test                                  # 単体テスト（happy-dom）＋ ストーリーテスト（a11y）
pnpm test:vrt / pnpm test:e2e              # 手動・都度実行
pnpm --filter 8341-ui-tokens build         # トークンの CSS・Tailwind テーマ・Figma JSON を生成
pnpm --filter 8341-ui-tokens design-md     # DESIGN.md の表を更新
pnpm --filter 8341-ui-tokens tw-merge      # クラス統合の設定を更新
pnpm --filter 8341-ui registry             # registry.json を更新
pnpm audit:report                          # 健康診断レポート（reports/audit.md）
pnpm changeset                             # 変更内容を記録（公開されるパッケージを変えたとき）
```

## 守ること

- 画面設計のルールは `docs/design-principles/` を正とする。ギャップを見つけたら例外を作らず、そこを直す PR を出す
- 生成物を手で編集しない: `packages/tokens/dist/`、`packages/tokens/src/primitive/color.tokens.json`、`packages/ui/src/lib/tw-merge-config.ts`、`packages/ui/registry.json`、DESIGN.md の `<!-- auto:* -->` ブロック
- コンポーネントは semantic トークンの Tailwind クラスだけを使い、`tv` / `cn` は `@/lib/tv` から import する
- 任意値・手書き CSS では `var(--8341-*)` を参照する（`var(--color-*)` は未定義になりうる）
- チェックを通すためにルールを緩めない（必要なら ADR を書いて人間に確認する）
- 変更したら `pnpm check && pnpm test` を通し、`docs/improvement/log.md` に記録する
- 公開パッケージを変えたら `pnpm changeset` を添える（版の決め方は `docs/releasing.md`）
