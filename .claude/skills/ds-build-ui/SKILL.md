---
name: ds-build-ui
description: このデザインシステムを使って画面やフォームを作る・レビューするときに使う。DESIGN.md とアクセシビリティのルールに沿って実装し、セルフチェックする。
---

# デザインシステムで UI を作る

## 作る前に読む

文書は大きいので、**全文ではなく必要な節だけ** を読む（見出しで探して、その節を読む）。

0. プロダクトの DESIGN.md の「プロダクトの前提」〜「採用したルールと外したもの」。無ければ `npx shadcn@latest add @8341/design-md` で置き（このリポジトリの中なら雛形は `templates/PRODUCT-DESIGN.md`）、（ ）のままの欄を `docs/design-principles/hearing.md` の項目で聞いて埋める
1. 8341-ui の `DESIGN.md`（このリポジトリ直下）は次の節だけ: 「9. Agent Prompt Guide」のクイックリファレンス、「7. Do's and Don'ts」、「4. Component Stylings」の一覧と、使うコンポーネントの節。色や余白を決めるときだけ「2. Color Palette & Roles」「5. Layout Principles」
2. `docs/rulebook/02-accessibility.md` の「必須ルール」の表（A1〜A16）
3. フォームやボタンの文言を書くときだけ `docs/rulebook/05-writing.md`
4. 使うコンポーネントのストーリー（`packages/ui/src/components/ui/<Name>/index.stories.tsx`）

## 作るときの決まり

- 既存コンポーネントを組み合わせる。足りないときは独自に作る前にバックログを確認し、無ければ Issue を起票する
- 部品は shadcn 方式で取り込む（`npx shadcn@latest add @8341/{name}`）か、npm の `8341-ui` から import する
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
