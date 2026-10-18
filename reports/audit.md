# デザインシステム監査レポート 2026-10-18

| 項目 | 結果 |
| --- | --- |
| コントラスト | 190/190 件が基準を満たす |
| CSS 監査 | error 0 / warning 0 |
| 未使用の semantic トークン | 16 |
| ストーリーの無いコンポーネント | 0 |
| 改善バックログの未着手 | 13 |

### コントラスト不足（0）

なし

### コントラストの余裕が 5% 未満（0）

なし

### CSS 監査（0）

なし

### 未使用の semantic トークン（16）

- `space.page-inline`
- `radius.none`
- `size.content-max`
- `motion.duration-slow`
- `motion.easing-enter`
- `motion.easing-exit`
- `z.dropdown`
- `z.sticky`
- `z.overlay`
- `z.modal`
- `z.toast`
- `color.bg.inverse`
- `color.bg.overlay`
- `color.text.inverse`
- `shadow.2`
- `shadow.3`

### ストーリーの無いコンポーネント（0）

なし


---
次の一手: 上の項目から 1 つ選び、`docs/rulebook/06-improvement-loop.md` の手順で直す。
未使用トークンはアプリ側で使っている可能性があるため、削除前に利用プロジェクトを確認すること。
