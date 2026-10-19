# 開発ガイド

8341-ui の開発手順をまとめる。運用（CI・Pages・GitHub の設定）は [docs/operations.md](./docs/operations.md)、リリースは [docs/releasing.md](./docs/releasing.md)。
AI エージェントで開発するときも、この手順と [AGENTS.md](./AGENTS.md) の「守ること」に従う。

## 前提

| 道具 | 版 |
| --- | --- |
| Node.js | 22.12 以上 |
| pnpm | 11（`corepack enable` で有効にできる） |
| GitHub CLI（`gh`） | プレビューの公開と PR の操作に使う |

Windows では、シンボリックリンクを使うための設定が要る（[docs/ai-agents.md](./docs/ai-agents.md) の「Windows で使う場合」）。

## セットアップ

```bash
git clone https://github.com/tkc310/8341ui.git
cd 8341ui
pnpm install          # prepare でトークンもビルドされる
pnpm dev              # Storybook（http://localhost:6006）
```

## よく使うコマンド

| コマンド | やること |
| --- | --- |
| `pnpm dev` | Storybook を起動する |
| `pnpm check` | fmt・lint（型情報つき）・型、生成物の鮮度、コントラスト、クラス監査、依存の向き |
| `pnpm test` | 単体テスト（happy-dom）と、全ストーリーの実ブラウザ描画・axe |
| `pnpm test:vrt` | 見た目の回帰テスト（手動） |
| `pnpm test:e2e` | e2e（320px・200%・強制カラー。手動） |
| `pnpm build` | トークン → コンポーネント（ESM・型・CSS） |
| `pnpm build:storybook` | Storybook とレジストリをビルドする |
| `pnpm storybook:preview` | PR 用の Storybook を Pages に公開する |
| `pnpm changeset` | 変更内容を記録する（公開パッケージを変えたとき） |

## 変更の流れ

1. **ブランチを切る**: `feat/…`・`fix/…`・`docs/…`・`chore/…` のように、変更の種類を頭に付ける
2. **変更する**: 下の「変更の種類ごとの手順」に従う
3. **確かめる**: `pnpm check && pnpm test`。見た目を変えたら `pnpm test:vrt` も
4. **記録する**:
   - 公開パッケージ（`8341-ui`・`8341-ui-tokens`）を変えたら `pnpm changeset`（[版の決め方](./docs/releasing.md#版の決め方)）
   - 改善なら `docs/improvement/log.md` に 1 行
   - 値や方針を変えたら `docs/decisions/` に ADR
5. **PR を出す**: PR テンプレートのチェックリストを埋める。見た目が変わるなら、`pnpm storybook:preview` で公開したプレビューのリンクを添える（`ds-storybook-preview` スキル）
6. **マージ**: `check` と `test` が通ったらマージする。マージ後のブランチは `Branch cleanup` が消す

コミットメッセージは `種類: 変更の要約`（例: `feat: Tooltip を追加`、`fix(select): …`）。本文は日本語で、何をなぜ変えたかを書く。

## 変更の種類ごとの手順

### トークンを変える

```bash
# 値を変える: packages/tokens/src/{primitive,semantic}/*.tokens.json
# キーカラーを変える: packages/tokens/src/palette.config.json → 次で primitive を再生成
pnpm --filter 8341-ui-tokens palette
pnpm --filter 8341-ui-tokens build       # CSS 変数・Tailwind テーマ・Figma JSON
pnpm --filter 8341-ui-tokens design-md   # DESIGN.md の表
pnpm --filter 8341-ui-tokens tw-merge    # クラス統合の設定
pnpm check
```

- semantic カラーを足したら、`packages/tokens/src/contrast.rules.json` に組み合わせを足す
- ライトとダークでキーをそろえる（CI が検査する）

### コンポーネントを足す・変える

`packages/ui/src/components/<name>/` に次をそろえる。

| ファイル | 中身 |
| --- | --- |
| `<name>.tsx` | 本体。Base UI の部品と `tv`（`@/lib/tv`）で書く。フックを使うなら先頭に `'use client'` |
| `index.ts` | 公開 API |
| `<name>.stories.tsx` | ストーリー。操作があるなら play 関数で振る舞いを検査する |
| `<name>.figma.ts` | Code Connect（Figma のコンポーネントがある場合） |

- semantic トークンの Tailwind クラスだけを使う（任意値では `var(--8341-*)`）
- 振る舞いのテストは `src/components/components.test.tsx` に足す
- 追加・削除したら `pnpm --filter 8341-ui registry` でレジストリを更新する
- 使い方の規約は [docs/rulebook/04-components.md](./docs/rulebook/04-components.md)、アクセシビリティは [02-accessibility.md](./docs/rulebook/02-accessibility.md)

### 画面設計のルールを変える

`docs/design-principles/` を直す。トークンやコンポーネントへの影響は [docs/rulebook/01-principles.md](./docs/rulebook/01-principles.md) の対応表で辿る。

## AI エージェントで開発する

Claude Code を推奨とし、Cursor と Codex でも同じスキルを使える（[docs/ai-agents.md](./docs/ai-agents.md)）。

| やりたいこと | スキル |
| --- | --- |
| このシステムで画面を作る | `ds-build-ui` |
| このシステムを改善する | `ds-improve` |
| 見た目が変わる PR にプレビューを添える | `ds-storybook-preview` |
| 画面を設計する・レビューする | `design-principles`（`/design-init`・`/design-adjust`・`/design-review`） |
| 新しいデザインシステムを作る | `ds-factory`（[docs/factory.md](./docs/factory.md)） |

## 質問・提案・不具合

- 改善の提案や不具合は、Issue テンプレート「改善提案」で起票する
- 脆弱性は Issue に書かず、[SECURITY.md](./SECURITY.md) の手順で知らせる
