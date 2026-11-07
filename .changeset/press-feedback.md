---
'8341-ui': patch
---

タッチでも押したことが伝わるよう、押している間の見た目（`active:`）を付けました。

- Link・Card（`href`）・Accordion・Checkbox / Radio / Switch（ラベルの文字を押しても出る）・入力欄・NotificationBanner の閉じるボタンに、マウスの hover と同じ見た目を `active:` でも付けた
- Button の hover と押した見た目を `enabled:` から `not-disabled:` に替えた。`buttonVariants` を `<a>` に当てたとき、hover も押した見た目も出なかった
- テーマで端末のタップの塗り（`-webkit-tap-highlight-color`）を消した
- iOS Safari で `:active` を効かせるには、アプリで `document` に `touchstart` の受け手を置く（README）
