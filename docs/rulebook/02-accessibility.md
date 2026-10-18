# 02 アクセシビリティ

**WCAG 2.2 レベル AA** と **JIS X 8341-3:2016** を最低ラインとします。
以下は、このシステムでの具体的な実装ルールと、どこで担保しているかの対応表です。

## 必須ルール

| # | ルール | 基準 | 担保している場所 |
| --- | --- | --- | --- |
| A1 | 文字と背景のコントラスト 4.5:1 以上（大きい文字も同じ基準で統一） | 1.4.3 | `tokens/contrast.rules.json` → `npm run check:contrast` |
| A2 | 入力欄の枠・アイコン・フォーカス表示など UI の境界は 3:1 以上 | 1.4.11 | 同上 |
| A3 | 文字に隣接するアイコンは 4.5:1 以上（独自基準） | 1.4.11 | 同上 |
| A4 | 色だけで情報を伝えない。リンクは常に下線、エラーはアイコン＋文言＋太い枠 | 1.4.1 | Link / FormField / control.css |
| A5 | フォーカス表示は二重リング（内側: 黄 `color.focus.ring`、外側: `color.focus.outline`）。どの背景でもどちらかが 3:1 以上 | 2.4.7, 2.4.13 | `.dsm-focusable`（base.css） |
| A6 | タップ領域は 44×44px 以上。見た目が小さい部品は擬似要素で領域を広げる | 2.5.8（AAA の 2.5.5 も満たす） | `size.target-min`、Button sm、Checkbox |
| A7 | 文字サイズは 14px 未満を使わない。単位は rem でユーザー設定に追従 | 1.4.4 | `font.size.*` に 14 未満を定義しない |
| A8 | すべての入力欄にラベル。補足とエラーは `aria-describedby` で関連付ける | 1.3.1, 3.3.2 | FormField |
| A9 | 必須は「必須」と文字で示す（`*` だけにしない） | 3.3.2 | FormField / RadioGroup |
| A10 | エラーは「何が誤りで、どう直すか」を示し、送信時は最初のエラーへフォーカスを移す | 3.3.1, 3.3.3 | [05 文言](./05-writing.md)、Form の ValidationPattern ストーリー |
| A11 | 動的に出す通知だけ `role="status"` / `role="alert"` を付ける | 4.1.3 | NotificationBanner の `live` |
| A12 | `prefers-reduced-motion` で動きを止める | 2.3.3 | base.css |
| A13 | 強制カラーモード（Windows ハイコントラスト）で境界とフォーカスが消えない | 1.4.11 | 各 CSS の `@media (forced-colors: active)` |
| A14 | `:hover` は `@media (hover: hover)` の中に書く。hover で文字の太さ・大きさを変えない | — | `npm run check:css` |
| A15 | ストーリーはすべて axe の WCAG 2.2 AA ルールで違反ゼロ | — | Storybook addon-a11y（`test: 'error'`）＋ Vitest |

## キーボード操作

| 部品 | 操作 |
| --- | --- |
| Button | Tab で移動、Enter / Space で実行 |
| Link | Tab で移動、Enter で遷移 |
| Checkbox | Space で切り替え |
| RadioGroup | Tab でグループに入り、矢印キーで選択（ネイティブの振る舞い） |
| Accordion | Enter / Space で開閉（`details` / `summary`） |
| Select | ネイティブの `select` の操作 |

独自のキーボード操作（ロービングタブインデックスなど）が必要な部品を作る場合は、
[WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) のパターンに従い、ADR を書きます。

## 自動テストで見つからないもの（手動確認）

自動検査で見つかる問題は全体の一部です。新しい部品や大きな変更では、次を手で確認します。

- [ ] キーボードだけで最後まで操作できる。フォーカス順が見た目の順と一致する
- [ ] VoiceOver（macOS / iOS）または NVDA で、名前・役割・状態が読み上げられる
- [ ] ブラウザの文字サイズを 200% にしても、はみ出し・重なりがない
- [ ] 横幅 320px で横スクロールが出ない
- [ ] ダークテーマと強制カラーモードで境界・フォーカス・状態が判別できる
