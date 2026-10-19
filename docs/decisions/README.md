# 設計判断の記録（ADR）

値や方針を変えたときは、ここに 1 判断 1 ファイルで残します。ファイル名は `NNNN-短い説明.md`。

| #                                             | 判断                                                  | 状態           |
| --------------------------------------------- | ----------------------------------------------------- | -------------- |
| [0001](./0001-react-with-plain-css.md)        | React + プレーン CSS（CSS 変数 + BEM + data 属性）    | 廃止（→ 0008） |
| [0002](./0002-key-color-and-oklch-palette.md) | キーカラー「藍」と OKLCH による共通明度カーブ         | 採用           |
| [0003](./0003-dark-theme.md)                  | semantic 層でのダークテーマ                           | 採用           |
| [0004](./0004-palt-for-headings.md)           | 見出しのみ palt                                       | 採用           |
| [0005](./0005-focus-double-ring.md)           | フォーカスの二重リング                                | 採用           |
| [0006](./0006-control-height-44.md)           | 標準コントロール高さ 44px                             | 採用           |
| [0007](./0007-adopt-design-principles.md)     | 画面設計のルールに design-principles を採用           | 採用（置き場所は 0013） |
| [0008](./0008-stack-2026-10.md)               | Base UI + Tailwind v4 + shadcn 方式などの技術スタック | 採用           |
| [0009](./0009-dtcg-representation.md)         | DTCG 2025.10 でのトークンの表し方                     | 採用           |
| [0010](./0010-tailwind-theme-mapping.md)      | Tailwind のテーマ名とトークンの対応                   | 採用           |
| [0011](./0011-storybook-pr-preview.md) | PR ごとの Storybook をローカルでビルドし Pages（gh-pages ブランチ）に置く | 採用 |
| [0012](./0012-self-contained-registry.md) | shadcn のレジストリだけで導入できるようにする（テーマにトークンを同梱） | 採用 |
| [0013](./0013-design-principles-in-repo-and-factory.md) | design-principles を取り込み、デザインシステムファクトリーとして位置づける | 採用 |
| [0014](./0014-release-and-oss-docs.md) | リリースの仕組み（タグ・Releases・版ごとのレジストリ）と OSS としての体裁 | 採用 |
| [0015](./0015-dependency-update-2026-10.md) | 依存と道具を最新に更新する（Node.js 24 LTS・pnpm 12・TypeScript 7） | 採用 |
| [0016](./0016-component-structure.md) | コンポーネントのディレクトリ構造を PascalCase とコロケーションにする | 採用 |

## テンプレート

```md
# NNNN タイトル

- 日付: YYYY-MM-DD
- 状態: 提案 / 採用 / 廃止（→ NNNN）

## 背景

## 決定

## 理由

## 影響・トレードオフ
```
