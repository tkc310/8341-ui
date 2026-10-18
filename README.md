# tkc310-ui

プロジェクトで使い回す、自分用のデザインシステムです。
[デジタル庁デザインシステム（DADS）](https://design.digital.go.jp/dads/) のアクセシビリティ基準を土台に、
キーカラー「藍」・ダークテーマ・自己改善の仕組みを加えて再設計しています。
画面設計のルールは [design-principles](https://github.com/tkc310/agents-playground/tree/main/docs/design-principles) を採用しています。

![ライト / ダークのプレビュー](./docs/assets/preview.png)

| 含まれるもの                                                                       | 場所                                                                             |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| ルールブック（原則・アクセシビリティ・トークン・コンポーネント・文言・改善ループ） | [`docs/rulebook/`](./docs/rulebook/)                                             |
| トークン（W3C DTCG 2025.10、primitive / semantic、ライト / ダーク）                | [`packages/tokens`](./packages/tokens/)（`tkc310-ui-tokens`）                    |
| コンポーネント 18 種（Base UI + Tailwind CSS v4 + tailwind-variants）              | [`packages/ui`](./packages/ui/)（`tkc310-ui`）                                   |
| shadcn レジストリ（`registry:base` で Base UI を固定）                             | [`packages/ui/registry.json`](./packages/ui/registry.json)                       |
| Storybook 10・e2e                                                                  | [`apps/storybook`](./apps/storybook/)                                            |
| AI エージェント向け仕様                                                            | [`DESIGN.md`](./DESIGN.md)、[`AGENTS.md`](./AGENTS.md)                           |
| 自己改善の仕組み                                                                   | [`docs/rulebook/06-improvement-loop.md`](./docs/rulebook/06-improvement-loop.md) |
| プロダクト用 DESIGN.md の雛形                                                      | [`templates/PRODUCT-DESIGN.md`](./templates/PRODUCT-DESIGN.md)                   |

技術スタックと選んだ理由は [ADR-0008](./docs/decisions/0008-stack-2026-10.md) にあります。

## はじめる

Node 22.12 以上と pnpm 11 を使います。

```bash
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
  "registries": { "@tkc": "https://tkc310.github.io/design-system-myself/r/{name}.json" }
}
```

```bash
npx shadcn@latest add @tkc/tkc-base @tkc/button @tkc/form-field @tkc/text-field
```

```css
/* globals.css */
@import 'tailwindcss';
@import './styles/tkc310-ui.css';
```

### npm パッケージ

```tsx
import { Button } from 'tkc310-ui/button';
import { FormField } from 'tkc310-ui/form-field';
import { TextField } from 'tkc310-ui/text-field';

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
@import 'tkc310-ui/theme.css';
@source "../node_modules/tkc310-ui/dist";
```

`@source` のパスは、この CSS ファイルから見た `node_modules/tkc310-ui/dist` への相対パスにします（例: `src/app.css` なら `../node_modules/...`）。
shadcn 方式で部品をコピーした場合は、部品がプロジェクト内にあるので `@source` は不要です。

Tailwind を使わない場合は、ビルド済みの `import 'tkc310-ui/styles.css'` を読み込みます。

テーマは `<html class="dark">` または `<html data-theme="dark">` で切り替えます。どちらも無ければ OS の設定に従います。

## トークンを変える

```bash
# 例: キーカラーの色相を変える（packages/tokens/src/palette.config.json の families.indigo.hue）
pnpm --filter tkc310-ui-tokens palette     # primitive を再生成
pnpm --filter tkc310-ui-tokens build       # CSS 変数・Tailwind テーマ・Figma JSON
pnpm --filter tkc310-ui-tokens design-md   # DESIGN.md の表
pnpm --filter tkc310-ui-tokens tw-merge    # クラス統合の設定
pnpm check
```

## 見た目の変わる PR にプレビューを添える

```bash
pnpm storybook:preview   # ビルドして https://tkc310.github.io/design-system-myself/pr-preview/pr-<番号>/ に公開
```

PR を作って push した後に実行します。変わったストーリーへのリンクを PR 本文の「Storybook プレビュー」節に書きます（手順: `.claude/skills/ds-storybook-preview/SKILL.md`、ADR-0011）。
PR を閉じるとプレビューは自動で消えます。初回は、リポジトリの Settings > Pages で配信元を `gh-pages` ブランチにしてください。

## リリース

公開パッケージ（`tkc310-ui`・`tkc310-ui-tokens`）を変えたら `pnpm changeset` で変更内容を記録します。
main にマージされると Changesets がバージョン更新の PR を作ります。
npm への公開は、リポジトリの Settings > Secrets and variables > Actions で変数 `ENABLE_NPM_PUBLISH` を `true` にし、シークレット `NPM_TOKEN` を登録したときだけ行われます（意図しない公開を防ぐため、既定では公開しません）。

## ライセンス

MIT
