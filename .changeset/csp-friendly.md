---
'8341-ui': patch
---

`style-src` に `'unsafe-inline'` を入れない CSP の下でも崩れないようにしました。

- Checkbox・Radio・Switch: Base UI が隣に描くネイティブ入力の style 属性が CSP で止まると、入力が見えていた。テーマの `hide-native-input` でクラスからも隠す
- Skeleton: 既定の大きさ（幅いっぱい・1em）をクラスで持ち、`width` / `height` を指定しないときは style 属性を出さない
