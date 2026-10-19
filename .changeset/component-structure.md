---
'8341-ui': minor
---

コンポーネントのディレクトリ構造を PascalCase とコロケーションにしました（ADR-0016）。

- shadcn: コンポーネントは `components/ui/Button/index.tsx` の形で入り、import は `@/components/ui/Button/index` になります。以前に入れた `components/ui/button.tsx` などは自動では移りません。入れ直す場合は古いファイルを消してから `npx shadcn add @8341/button` を実行してください
- npm: コンポーネントごとのエントリが `8341-ui/button` から `8341-ui/Button`（PascalCase）に変わります。`8341-ui` からの import は変わりません
