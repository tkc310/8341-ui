---
name: ds-build-ui
description: このデザインシステムを使って画面やフォームを作る・レビューするときに使う。DESIGN.md とアクセシビリティのルールに沿って実装し、セルフチェックする。
---

# デザインシステムで UI を作る

## 作る前に読む

0. プロダクトの DESIGN.md。無ければ `templates/PRODUCT-DESIGN.md` から作り、UI の方向性とサービス種別を決める。design-principles スキル（上流）が使える環境では、その手順（ヒアリング → 方向性 → 特化ルール → 原則 → WCAG）に従う
1. `DESIGN.md`（トークン・コンポーネントの早見表と Do / Don't）
2. `docs/rulebook/02-accessibility.md`（必須ルール A1〜A15）
3. `docs/rulebook/05-writing.md`（ボタン・エラー文の書き方）
4. 使うコンポーネントのストーリー（`src/components/**/*.stories.tsx`）

## 作るときの決まり

- 既存コンポーネントを組み合わせる。足りないときは独自に作る前にバックログを確認し、無ければ Issue を起票する
- 部品は shadcn 方式で取り込む（`npx shadcn@latest add @tkc/{name}`）か、npm の `8341-ui` から import する
- 余白は `Stack`（gap は sm / md / lg の 3 段階）、色・寸法は semantic トークンの Tailwind クラス（`bg-*`・`text-fg-*`・`border-border-*`・`p-inset-*`）だけ
- 独自のバリアントは `tv()`（`@/lib/tv`）で書く。クラス名を動的に組み立てない
- フォームは Base UI の `Form` と `FormField` で組み、`type` / `inputMode` / `autoComplete` を指定する
- 1 画面の primary ボタンは 1 つを目安に

## 作った後のセルフチェック

- [ ] 色・px の直書き、Tailwind 既定のパレット（`text-gray-500` など）がない
- [ ] 見出しレベルが飛んでいない（h1 は 1 つ）
- [ ] すべての入力欄にラベル、必須は「必須」表示
- [ ] エラー文が「何が誤りで、どう直すか」になっている
- [ ] キーボードだけで最後まで操作できる
- [ ] ライト / ダークの両方で読める
- [ ] 選んだサービス種別の特化ルールのレビュー項目を満たす

デザインシステム側の不足や不具合に気づいたら、作業を止めずに Issue（改善提案テンプレート）を起票しておく。
