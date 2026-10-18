# AGENTS.md

AI エージェント向けの作業ガイドです。

## まず読むもの

| やりたいこと | 読むもの |
| --- | --- |
| このシステムで UI を作る | `DESIGN.md` → `.claude/skills/ds-build-ui/SKILL.md` |
| このシステム自体を直す・改善する | `docs/rulebook/` → `.claude/skills/ds-improve/SKILL.md` |
| 判断の理由を知る | `docs/decisions/` |

## リポジトリの地図

```
tokens/                トークンの元データ（DTCG 形式の JSON）← 値を変えるならここ
  palette.config.json  プリミティブカラーの生成パラメータ
  contrast.rules.json  コントラストの検証規則
scripts/               生成・検証スクリプト（依存ゼロ、tsx で実行）
src/styles/            tokens.css・typography.css は生成物、base.css は手書き
src/tokens/            生成物（tokens.ts / tokens.json）
src/components/        コンポーネント（tsx + css + stories）
docs/rulebook/         ルールブック
docs/decisions/        ADR
docs/improvement/      改善バックログとログ
DESIGN.md              エージェント向け仕様（auto ブロックは生成物）
```

## コマンド

```bash
npm run tokens:build   # トークン → CSS / TS / JSON / DESIGN.md を生成
npm run check          # 生成物の鮮度・コントラスト・CSS 規約・DESIGN.md 同期・型・Lint
npm test               # 単体テスト + 全ストーリーの a11y テスト
npm run audit          # 健康診断レポート（reports/audit.md）
npm run dev            # Storybook
```

## 守ること

- 生成物（`src/styles/tokens.css`、`src/styles/typography.css`、`src/tokens/*`、DESIGN.md の `<!-- auto:* -->` ブロック）を手で編集しない
- コンポーネント CSS は semantic トークンだけを使う
- チェックを通すためにルールを緩めない（必要なら ADR を書いて人間に確認する）
- 変更したら `npm run check && npm test` を通し、`docs/improvement/log.md` に記録する
