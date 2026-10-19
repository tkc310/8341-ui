import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t}from"./iframe-CQ2tr8BS.js";import{i as n,r}from"./react-B2fHeuu4.js";import{a as i,o as a}from"./blocks-CE0zYedr.js";function o(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`はじめに`}),`
`,(0,c.jsx)(t.h1,{id:`8341-ui`,children:`8341-ui`}),`
`,(0,c.jsxs)(t.p,{children:[`プロジェクトをまたいで使い回す、自分用のデザインシステムです。
`,(0,c.jsx)(t.a,{href:`https://design.digital.go.jp/dads/`,rel:`nofollow`,children:`デジタル庁デザインシステム（DADS）`}),` のアクセシビリティ基準を土台に、
キーカラー「藍」・ダークテーマを加えて再設計しています。画面設計のルールは
`,(0,c.jsx)(t.a,{href:`https://github.com/tkc310/8341ui/tree/main/docs/design-principles`,rel:`nofollow`,children:`design-principles`}),` を採用しています。`]}),`
`,(0,c.jsx)(t.h2,{id:`構成`,children:`構成`}),`
`,(0,c.jsxs)(t.p,{children:[`| 層             | 置き場所                    | 技術                                                                                  |
| -------------- | --------------------------- | ------------------------------------------------------------------------------------- |
| トークン       | `,(0,c.jsx)(t.code,{children:`packages/tokens`}),`           | W3C DTCG 2025.10 → Style Dictionary v5 → CSS 変数・Tailwind `,(0,c.jsx)(t.code,{children:`@theme`}),`・Figma Variables |
| コンポーネント | `,(0,c.jsx)(t.code,{children:`packages/ui`}),`               | Base UI v1 + Tailwind CSS v4 + tailwind-variants v3                                   |
| 配布           | `,(0,c.jsx)(t.code,{children:`packages/ui/registry.json`}),` | shadcn 方式（コードを持つ）。npm パッケージとしても使える                             |`]}),`
`,(0,c.jsx)(t.h2,{id:`使い方-1-shadcn-方式推奨`,children:`使い方 1: shadcn 方式（推奨）`}),`
`,(0,c.jsxs)(t.p,{children:[`利用側の `,(0,c.jsx)(t.code,{children:`components.json`}),` にレジストリを登録して、コードを取り込みます。`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-json`,children:`{
  "registries": { "@8341": "https://tkc310.github.io/8341ui/r/{name}.json" }
}
`})}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-bash`,children:`npx shadcn@latest add @8341/8341-base @8341/button @8341/form-field @8341/text-field
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`globals.css`}),` で Tailwind の後にテーマを読み込みます。`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`@import 'tailwindcss';
@import './styles/8341-ui.css';
`})}),`
`,(0,c.jsxs)(t.p,{children:[`テーマ（`,(0,c.jsx)(t.code,{children:`styles/8341-ui.css`}),`）はトークンの CSS を同梱しているので、npm のパッケージは要りません。
トークンを更新したら `,(0,c.jsx)(t.code,{children:`npx shadcn@latest add @8341/theme --overwrite`}),` で取り込み直します。
トークンをデータ（`,(0,c.jsx)(t.code,{children:`tokens.json`}),` や Figma 用 JSON）として使いたい場合は、このリポジトリの `,(0,c.jsx)(t.code,{children:`packages/tokens/dist/`}),` から取得します（npm には公開していません）。`]}),`
`,(0,c.jsx)(t.h2,{id:`使い方-2-npm-パッケージ公開した場合`,children:`使い方 2: npm パッケージ（公開した場合）`}),`
`,(0,c.jsx)(t.p,{children:`npm への公開は既定で無効です。公開すると、次のように使えます。`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { Button } from '8341-ui/button';
import '8341-ui/styles.css'; // Tailwind を使わない場合（ビルド済み）
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Tailwind を使うプロジェクトでは `,(0,c.jsx)(t.code,{children:`styles.css`}),` の代わりに次を書きます。`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-css`,children:`@import 'tailwindcss';
@import '8341-ui/theme.css';
@source "../node_modules/8341-ui/dist";
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`@source`}),` のパスは、この CSS ファイルから見た `,(0,c.jsx)(t.code,{children:`node_modules/8341-ui/dist`}),` への相対パスにします（例: `,(0,c.jsx)(t.code,{children:`src/app.css`}),` なら `,(0,c.jsx)(t.code,{children:`../node_modules/...`}),`）。
shadcn 方式で部品をコピーした場合は、部品がプロジェクト内にあるので `,(0,c.jsx)(t.code,{children:`@source`}),` は不要です。`]}),`
`,(0,c.jsx)(t.h2,{id:`テーマ`,children:`テーマ`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`<html class="dark">`}),` か `,(0,c.jsx)(t.code,{children:`<html data-theme="dark">`}),` でダークにします。どちらも無ければ OS の設定に従います。
ツールバーの Theme で、ライト・ダーク・並べて表示を切り替えられます。`]}),`
`,(0,c.jsx)(t.h2,{id:`ドキュメント`,children:`ドキュメント`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`ルールブック: リポジトリの `,(0,c.jsx)(t.code,{children:`docs/rulebook/`})]}),`
`,(0,c.jsxs)(t.li,{children:[`AI エージェント向けの仕様: `,(0,c.jsx)(t.code,{children:`DESIGN.md`})]}),`
`,(0,c.jsxs)(t.li,{children:[`改善の進め方: `,(0,c.jsx)(t.code,{children:`docs/rulebook/06-improvement-loop.md`})]}),`
`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=t(),r(),a()})))()}l();export{s as default};