# 0009 DTCG 2025.10 でのトークンの表し方

- 日付: 2026-10-18
- 状態: 採用

## 背景

DTCG 2025.10 は dimension の単位を px と rem に限り、typography 複合型の letterSpacing も dimension である。和文の字間は文字サイズに比例させたい（0.02em など）。また Figma Variables は srgb と px しか取り込めず、コレクションをまたぐ別名には Figma 固有の ID が必要になる。Style Dictionary v5 は Resolver モジュールに未対応。

## 決定

- 色は `colorSpace: "oklch"` の色オブジェクトで持ち、sRGB の色域に収めた値と `hex` の代替値を添える（`oklch()` と hex が同じ色になる）
- 字間は `number`（文字サイズに対する比率）で持ち、CSS には em を付けて出す
- テキストスタイルは typography 複合型にせず、`text.{スタイル}.font-size` などの個別のトークンで持つ
- テーマは Resolver 文書（`8341-ui.resolver.json`）で表し、Style Dictionary へ渡すファイルの順番は自前のスクリプトが Resolver から決める
- Figma 向けには srgb・px に変換し、semantic は解決済みの値で書き出す

## 理由

仕様に合わない値を無理に押し込むより、仕様の型の範囲で意味を保てる表し方を選ぶ。Resolver を正にしておけば、Style Dictionary が対応したときに置き換えるだけで済む。

## 影響・トレードオフ

- DTCG に対応したツールが字間を dimension として読むことはできない（number として見える）
- Figma 側では semantic が primitive への別名にならない。primitive の値を変えたら、Figma にも取り込み直す
