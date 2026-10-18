# AGENTS.md

AI エージェント向けの作業ガイドです。

## まず読むもの

| やりたいこと                     | 読むもの                                                |
| -------------------------------- | ------------------------------------------------------- |
| このシステムで UI を作る         | `DESIGN.md` → `.claude/skills/ds-build-ui/SKILL.md`     |
| このシステム自体を直す・改善する | `docs/rulebook/` → `.claude/skills/ds-improve/SKILL.md` |
| 判断の理由を知る                 | `docs/decisions/`                                       |

## 技術スタック

React 19 / TypeScript、Base UI v1、Tailwind CSS v4、tailwind-variants v3、shadcn 方式の配布、
W3C DTCG 2025.10 + Style Dictionary v5、Vite+（oxlint / oxfmt / Vitest 5 / tsdown / Vite Task）、pnpm 11、Changesets v3、dependency-cruiser、Storybook 10。
詳しくは [ADR-0008](docs/decisions/0008-stack-2026-10.md)。

## リポジトリの地図

```
packages/tokens/          トークン（tkc310-ui-tokens）
  src/{primitive,semantic}/*.tokens.json  DTCG 2025.10 のトークン ← 値を変えるならここ
  src/tkc310-ui.resolver.json  テーマ（light / dark）の構成
  src/palette.config.json プリミティブカラーの生成パラメータ
  src/contrast.rules.json コントラストの検証規則
  scripts/                生成・検証（build.ts は Style Dictionary v5）
packages/ui/              コンポーネント（tkc310-ui）
  src/components/*/       *.tsx・index.ts・*.stories.tsx・*.figma.ts
  src/lib/                tv / cn / focus（tw-merge-config.ts は生成物）
  src/styles/theme.css    Tailwind のテーマ（@utility focus-ring など）
  registry.json           shadcn レジストリ（生成物）
apps/storybook/           Storybook 10・e2e（Playwright）・レジストリの配信元
docs/rulebook/            ルールブック
docs/decisions/           ADR
docs/improvement/         改善バックログとログ
DESIGN.md                 エージェント向け仕様（auto ブロックは生成物）
templates/                プロダクト用 DESIGN.md の雛形
```

## コマンド

```bash
pnpm install
pnpm dev                                   # Storybook
pnpm build                                 # トークン → UI（vp pack + styles.css）→ Storybook
pnpm check                                 # vp check（fmt・lint・型）＋ 各パッケージの検査 ＋ dependency-cruiser
pnpm test                                  # 単体テスト（happy-dom）＋ ストーリーテスト（a11y）
pnpm test:vrt / pnpm test:e2e              # 手動・都度実行
pnpm --filter tkc310-ui-tokens build       # トークンの CSS・Tailwind テーマ・Figma JSON を生成
pnpm --filter tkc310-ui-tokens design-md   # DESIGN.md の表を更新
pnpm --filter tkc310-ui-tokens tw-merge    # クラス統合の設定を更新
pnpm --filter tkc310-ui registry           # registry.json を更新
pnpm audit:report                          # 健康診断レポート（reports/audit.md）
pnpm changeset                             # 変更内容を記録（公開されるパッケージを変えたとき）
```

## 守ること

- 生成物を手で編集しない: `packages/tokens/dist/`、`packages/tokens/src/primitive/color.tokens.json`、`packages/ui/src/lib/tw-merge-config.ts`、`packages/ui/registry.json`、DESIGN.md の `<!-- auto:* -->` ブロック
- コンポーネントは semantic トークンの Tailwind クラスだけを使い、`tv` / `cn` は `@/lib/tv` から import する
- 任意値・手書き CSS では `var(--tkc-*)` を参照する（`var(--color-*)` は未定義になりうる）
- チェックを通すためにルールを緩めない（必要なら ADR を書いて人間に確認する）
- 変更したら `pnpm check && pnpm test` を通し、`docs/improvement/log.md` に記録する
