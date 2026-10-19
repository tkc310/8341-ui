# 0012 shadcn のレジストリだけで導入できるようにする（テーマにトークンを同梱）

- 日付: 2026-10-19
- 状態: 採用

## 背景
レジストリの `theme`（と `tkc-base`）が npm パッケージ `8341-ui-tokens` に依存していた。
npm にはまだ公開しておらず、公開も既定で無効にしている（ENABLE_NPM_PUBLISH）ため、`npx shadcn add @tkc/...` がそのパッケージのインストールで失敗していた。

## 決定
- レジストリの `theme` は、`src/styles/theme.css` の `@import '8341-ui-tokens/*.css'` を、ビルド済みのトークン CSS（`tokens.css`・`tailwind.css`）の中身に置き換えた 1 ファイル（`styles/8341-ui.css`）として配る
  - 生成は `packages/ui/scripts/build-registry-css.ts`（`registry:build` の中で実行。出力 `registry-assets/` は追跡しない）
- レジストリの項目は、npm に公開していない自前のパッケージ（`8341-ui*`）に依存させない。`generate-registry.ts` が検出して失敗する
- npm パッケージ（`8341-ui`・`8341-ui-tokens`）は従来どおりビルドでき、公開すれば npm でも使える。テーマは npm 版では `8341-ui/theme.css`（トークンを import する形）のまま

## 理由
- 自分用のシステムなので、npm のアカウント・トークン・公開手順を持たずに使える方が軽い
- shadcn 方式はコードを利用側に置く方式なので、テーマ CSS も同じく利用側に置くのが一貫する

## 影響・トレードオフ
- トークンを変えたら、利用側で `npx shadcn@latest add @tkc/theme --overwrite` を実行して取り込み直す（版の通知や固定は無い）
- トークンのデータ（`tokens.json`・DTCG・Figma 用 JSON）はレジストリでは配らない。必要ならリポジトリから取得するか、npm に公開する
- Tailwind を使わないプロジェクトは、レジストリでは使えない（npm 版のビルド済み `styles.css` が要る）
