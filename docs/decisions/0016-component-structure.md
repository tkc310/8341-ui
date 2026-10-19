# 0016 コンポーネントのディレクトリ構造を PascalCase とコロケーションにする

- 日付: 2026-10-19
- 状態: 採用

## 背景
コンポーネントは `src/components/button/` のようにケバブケースのディレクトリに置き、本体（`button.tsx`）・再エクスポート（`index.ts`）・ストーリー・Code Connect を並べていた。単体テストは `components.test.tsx` の 1 ファイルにまとめていた。

8341-ui を使うプロダクト（yorozuya など）は、[コンポーネント構造規則](https://github.com/tkc310/yorozuya/blob/main/src/components/COMPONENT_STRUCTURE.md)で `src/components/ui/Button/index.tsx` の形を採っている。shadcn で配布したファイルの形がプロダクトの規則と食い違っていた。

## 決定
- 規則を `packages/ui/src/components/COMPONENT_STRUCTURE.md` に取り込み、デザインシステム向けに調整する
- コンポーネントは `src/components/ui/<PascalCase>/` に置く。本体は `index.tsx`（そのまま公開 API。`index.ts` の再エクスポートはやめる）、テストは `index.test.tsx`、ストーリーは `index.stories.tsx`、Code Connect は `index.figma.ts`、フックは `useXxx.ts`、専用の子コンポーネントは入れ子のディレクトリ
- import: 同じコンポーネントのディレクトリの中は相対パス、ほかのコンポーネントは `@/components/ui/<Name>/index`、テスト用の道具は `@/test/*`。3 階層以上さかのぼる相対パスは使わない
- 規則の `layouts/`・`features/` はアプリのものなので、このパッケージには置かない
- 検査: `scripts/check-structure.ts`（ディレクトリ名・ファイル名・相対パス）と dependency-cruiser（ほかのコンポーネントの `index.tsx` 以外を参照しない、本体からテスト用の道具を参照しない）を `make check` で動かす
- レジストリの名前はケバブケースのまま（`@8341/form-field`）。ディレクトリ名から作る

## 理由
- ソースのパスに `ui/` を含めると、shadcn は利用側の ui ディレクトリの下に `ui/` より後ろのパスを保って置く（`resolveNestedFilePath`）。`target` を書かなくても、利用側の alias の設定を守ったまま `components/ui/Button/index.tsx` に入る
- ほかのコンポーネントを alias で import すると、shadcn が利用側の alias に書き換えられ、レジストリの依存（`registryDependencies`）も import から作れる。相対パスにするとどちらも効かない
- 本体・テスト・ストーリー・フックが 1 つのディレクトリに揃い、ディレクトリを見ればコンポーネントの範囲がわかる

## 影響・トレードオフ
- 利用側の修正が要る（0.x の間は minor）
  - shadcn: 新しく入れたコンポーネントは `components/ui/Button/index.tsx` に入り、import は `@/components/ui/Button/index` になる。以前に入れた `components/ui/button.tsx` は自動では移らない（入れ直すなら古いファイルを消して `npx shadcn add`）
  - npm: コンポーネントごとのエントリが `8341-ui/button` から `8341-ui/Button`（ディレクトリ名）になる。パッケージ全体のエントリ（`8341-ui`）は変わらない
- ストーリーの ID（`components-button--default` など）はタイトルから作るので変わらない
- VRT（`gallery.vrt.test.tsx`）はコンポーネントを横断するため、`src/components/` の直下に置く例外にする
