# 設計判断の記録（ADR）

値や方針を変えたときは、ここに 1 判断 1 ファイルで残します。ファイル名は `NNNN-短い説明.md`。

| # | 判断 | 状態 |
| --- | --- | --- |
| [0001](./0001-react-with-plain-css.md) | React + プレーン CSS（CSS 変数 + BEM + data 属性） | 採用 |
| [0002](./0002-key-color-and-oklch-palette.md) | キーカラー「藍」と OKLCH による共通明度カーブ | 採用 |
| [0003](./0003-dark-theme.md) | semantic 層でのダークテーマ | 採用 |
| [0004](./0004-palt-for-headings.md) | 見出しのみ palt | 採用 |
| [0005](./0005-focus-double-ring.md) | フォーカスの二重リング | 採用 |
| [0006](./0006-control-height-44.md) | 標準コントロール高さ 44px | 採用 |

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
