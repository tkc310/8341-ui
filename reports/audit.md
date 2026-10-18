# デザインシステム監査レポート 2026-10-18

| 項目 | 結果 |
| --- | --- |
| コントラスト | 190/190 件が基準を満たす |
| クラス監査 | error 0 / warning 0 |
| 未使用の semantic トークン | 16 |
| ストーリーの無いコンポーネント | 0 |
| Code Connect の無いコンポーネント | 13 |
| 改善バックログの未着手 | 17 |

### コントラスト不足（0）

なし

### コントラストの余裕が 5% 未満（0）

なし

### クラス監査（0）

なし

### 未使用の semantic トークン（16）

- `space.page-inline`
- `size.content-max`
- `border-width.default`
- `border-width.strong`
- `motion.duration.fast`
- `motion.duration.base`
- `motion.duration.slow`
- `motion.easing.enter`
- `motion.easing.exit`
- `z.sticky`
- `z.overlay`
- `z.modal`
- `z.toast`
- `color.bg.inverse`
- `color.bg.overlay`
- `color.text.inverse`

### ストーリーの無いコンポーネント（0）

なし

### Code Connect の無いコンポーネント（13）

- `accordion`
- `breadcrumb`
- `card`
- `divider`
- `form-field`
- `heading`
- `icon`
- `link`
- `radio-group`
- `select`
- `stack`
- `text`
- `textarea`


---
次の一手: 上の項目から 1 つ選び、`docs/rulebook/06-improvement-loop.md` の手順で直す。
未使用トークンは利用側のプロジェクトで使っている可能性があるため、削除する前に確認すること。
