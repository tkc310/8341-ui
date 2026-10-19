# 8341-ui

[![CI](https://github.com/tkc310/8341ui/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/tkc310/8341ui/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/tkc310/8341ui?sort=semver&display_name=tag)](https://github.com/tkc310/8341ui/releases)
[![License: MIT](https://img.shields.io/github/license/tkc310/8341ui)](./LICENSE)
[![Storybook](https://img.shields.io/badge/Storybook-live-FF4785?logo=storybook&logoColor=white)](https://tkc310.github.io/8341ui/)
[![shadcn registry](https://img.shields.io/badge/shadcn-registry%20%408341-000000?logo=shadcnui&logoColor=white)](https://tkc310.github.io/8341ui/r/registry.json)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG%202.2-AA-005A9C?logo=w3c&logoColor=white)](./docs/rulebook/02-accessibility.md)
[![Changesets](https://img.shields.io/badge/maintained%20with-changesets-176de3)](https://github.com/changesets/changesets)

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Base UI](https://img.shields.io/badge/Base%20UI-v1-111111)](https://base-ui.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![DTCG 2025.10](https://img.shields.io/badge/Design%20Tokens-DTCG%202025.10-6E56CF)](https://www.designtokens.org/)
[![pnpm 11](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Claude%20Code%20%7C%20Cursor%20%7C%20Codex-D97757?logo=claude&logoColor=white)](./docs/ai-agents.md)

プロジェクトで使い回す、自分用のデザインシステムです。
[デジタル庁デザインシステム（DADS）](https://design.digital.go.jp/dads/) のアクセシビリティ基準を土台に、
キーカラー「藍」・ダークテーマ・自己改善の仕組みを加えて再設計しています。
画面設計のルールは [design-principles](./docs/design-principles/README.md)（このリポジトリの `docs/design-principles/`）を採用しています。

<!-- factory:start -->
## このリポジトリの位置づけ

1. **デザインシステムとして使う** — 8341-ui のトークンとコンポーネントを、shadcn のレジストリでプロダクトに取り込みます（下の「使う」）。
2. **デザインシステムファクトリーとして使う** — design-principles とヒアリングの結果から、8341-ui をひな形に新しいデザインシステムのリポジトリを作ります。AI エージェントのスキル `ds-factory` として動きます（`/ds-factory`）。
3. **AI エージェント** — Claude Code を推奨とし、Cursor と Codex でも同じ指示とスキルを読めるよう、シンボリックリンクで入口をそろえています。

詳しくは [`docs/factory.md`](./docs/factory.md)（位置づけとファクトリー）と [`docs/ai-agents.md`](./docs/ai-agents.md)（エージェントごとの対応）を読んでください。

<!-- factory:end -->

- **Storybook**: https://tkc310.github.io/8341ui/
- **shadcn レジストリ**: `https://tkc310.github.io/8341ui/r/{name}.json`（例: [button](https://tkc310.github.io/8341ui/r/button.json)）

![ライト / ダークのプレビュー](./docs/assets/preview.png)

| 含まれるもの                                                                       | 場所                                                                             |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 画面設計のルール（UI の方向性 → サービス別の特化ルール → 原則 → WCAG 2.2）        | [`docs/design-principles/`](./docs/design-principles/)                           |
| ルールブック（原則・アクセシビリティ・トークン・コンポーネント・文言・改善ループ） | [`docs/rulebook/`](./docs/rulebook/)                                             |
| AI エージェントのスキル（Claude Code 推奨。Cursor・Codex にも対応）                | [`.claude/skills/`](./.claude/skills/)（[対応表](./docs/ai-agents.md)）          |
| トークン（W3C DTCG 2025.10、primitive / semantic、ライト / ダーク）                | [`packages/tokens`](./packages/tokens/)（`8341-ui-tokens`）                    |
| コンポーネント 18 種（Base UI + Tailwind CSS v4 + tailwind-variants）              | [`packages/ui`](./packages/ui/)（`8341-ui`）                                   |
| shadcn レジストリ（`registry:base` で Base UI を固定）                             | [`packages/ui/registry.json`](./packages/ui/registry.json)                       |
| Storybook 10・e2e                                                                  | [`apps/storybook`](./apps/storybook/)                                            |
| AI エージェント向け仕様                                                            | [`DESIGN.md`](./DESIGN.md)、[`AGENTS.md`](./AGENTS.md)                           |
| 自己改善の仕組み                                                                   | [`docs/rulebook/06-improvement-loop.md`](./docs/rulebook/06-improvement-loop.md) |
| プロダクト用 DESIGN.md の雛形                                                      | [`templates/PRODUCT-DESIGN.md`](./templates/PRODUCT-DESIGN.md)                   |

技術スタックと選んだ理由は [ADR-0008](./docs/decisions/0008-stack-2026-10.md) にあります。

## はじめる

使う道具の版は [`.tool-versions`](./.tool-versions)（Node.js・pnpm・GitHub CLI）にあります。[mise](https://mise.jdx.dev/) か asdf で `mise install` すると、同じ版が入ります。詳しい導入手順は [CONTRIBUTING.md](./CONTRIBUTING.md#導入手順) を読んでください。

```bash
mise install   # .tool-versions の版の Node.js・pnpm・gh を入れる
pnpm install
pnpm dev       # Storybook（http://localhost:6006）
pnpm check     # fmt・lint（型情報つき）・型・トークン・コントラスト・DESIGN.md・レジストリ・クラス監査・アーキテクチャ
pnpm test      # 単体テスト（happy-dom）＋ 全ストーリーの a11y テスト
pnpm test:vrt  # VRT（手動）
pnpm test:e2e  # e2e（手動）
```

## 使う

### shadcn 方式（推奨: コードを持つ）

利用側の `components.json` にレジストリを登録します。

```json
{
  "registries": { "@8341": "https://tkc310.github.io/8341ui/r/{name}.json" }
}
```

版を固定するときは、URL を `https://tkc310.github.io/8341ui/r/v<版>/{name}.json` にします（[リリース](./docs/releasing.md)）。

```bash
npx shadcn@latest add @8341/8341-base @8341/button @8341/form-field @8341/text-field
```

```css
/* globals.css */
@import 'tailwindcss';
@import './styles/8341-ui.css';
```

テーマ（`styles/8341-ui.css`）はトークンの CSS を同梱しているので、npm のパッケージは要りません。
トークンを更新したら `npx shadcn@latest add @8341/theme --overwrite` で取り込み直します。
トークンをデータ（`tokens.json` や Figma 用 JSON）として使いたい場合は、このリポジトリの `packages/tokens/dist/` から取得します（npm には公開していません）。

### npm パッケージ（公開した場合）

npm への公開は既定で無効です（[リリース](#リリース)）。公開すると、次のように import して使えます。

```tsx
import { Button } from '8341-ui/button';
import { FormField } from '8341-ui/form-field';
import { TextField } from '8341-ui/text-field';

export function SignUp() {
  return (
    <form>
      <FormField label="メールアドレス" required supportText="例: taro@example.jp">
        <TextField type="email" autoComplete="email" />
      </FormField>
      <Button type="submit">登録する</Button>
    </form>
  );
}
```

```css
/* Tailwind を使う場合 */
@import 'tailwindcss';
@import '8341-ui/theme.css';
@source "../node_modules/8341-ui/dist";
```

`@source` のパスは、この CSS ファイルから見た `node_modules/8341-ui/dist` への相対パスにします（例: `src/app.css` なら `../node_modules/...`）。
shadcn 方式で部品をコピーした場合は、部品がプロジェクト内にあるので `@source` は不要です。

Tailwind を使わない場合は、ビルド済みの `import '8341-ui/styles.css'` を読み込みます。

テーマは `<html class="dark">` または `<html data-theme="dark">` で切り替えます。どちらも無ければ OS の設定に従います。

## トークンを変える

```bash
# 例: キーカラーの色相を変える（packages/tokens/src/palette.config.json の families.indigo.hue）
pnpm --filter 8341-ui-tokens palette     # primitive を再生成
pnpm --filter 8341-ui-tokens build       # CSS 変数・Tailwind テーマ・Figma JSON
pnpm --filter 8341-ui-tokens design-md   # DESIGN.md の表
pnpm --filter 8341-ui-tokens tw-merge    # クラス統合の設定
pnpm check
```

## 開発に参加する

セットアップ・コマンド・変更の流れは [CONTRIBUTING.md](./CONTRIBUTING.md) にあります。見た目が変わる PR には、`pnpm storybook:preview` で公開した Storybook のプレビューを添えます。

## 運用

CI・GitHub Pages の構成・リポジトリの設定（main の保護、ブランチの片付けなど）は [docs/operations.md](./docs/operations.md) にあります。

## リリース

権限のあるアカウント保有者が手元で `pnpm release:version`（版を上げる PR を作る）と `pnpm release:publish`（タグ・GitHub Releases・その版のレジストリ `r/v<版>/`）を実行します。リポジトリにトークンは置きません。npm への公開は任意です（`--npm`）。手順と版の決め方は [docs/releasing.md](./docs/releasing.md) にあります。

## ライセンス

[MIT](./LICENSE)
