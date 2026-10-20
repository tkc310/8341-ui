---
'8341-ui': patch
---

コンポーネントを 5 つ追加しました（yorozuya で使っていた部品を、8341-ui のトークンと Base UI で作り直したもの）。

- `Switch`: 押した瞬間に反映するオン / オフ（Base UI の Switch。`npx shadcn add @8341/switch`）
- `Dialog`: 画面に重ねて入力させるダイアログ。`placement="side"` で先頭側からせり出し、裏の画面も操作できる（`@8341/dialog`）
- `Spinner`: 読み込みや保存の最中を `role="status"` で伝える（`@8341/spinner`）
- `Skeleton`: 読み込み中に中身の形だけを先に見せる（`@8341/skeleton`）
- `Truncate`: 1 行に収まらない文字を省略し、ホバーとフォーカスで全文を出す（`@8341/truncate`）
