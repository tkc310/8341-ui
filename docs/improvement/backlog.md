# 改善バックログ

改善候補の一覧です。Issue があればリンクします。優先度の決め方は `docs/rulebook/06-improvement-loop.md` を参照。
着手したら `- [x]` にし、完了したら `log.md` に 1 行記録してここから消します。

## アクセシビリティ

- [ ] 全ストーリーを NVDA / VoiceOver で読み上げ確認する（自動テストでは名前・状態の自然さが分からない）
- [ ] Accordion の summary 内に見出しを置いたときの読み上げを主要スクリーンリーダーで確認し、必要なら構造を見直す

## 原則・ルール

- [ ] 取り込んだ design-principles（#27 の反映後の版）と 01 章の対応表を照合し、ずれを直す
- [ ] design-principles の推奨「入力の誤りは欄を離れた時点で知らせる」を FormField の検証パターンとして提供するか決める

## コンポーネント

- [ ] Table（ソート・横スクロール時の見出し固定、識別子の等幅）— 特化ルール「管理画面」
- [ ] AlertDialog（Base UI。取り消せない操作の確認）— 原則「誤りと撤回」の確認の段。入力用の Dialog は提供済み
- [ ] EmptyState（「データが無い」「条件に一致しない」「権限がない」の書き分け）— 特化ルール「管理画面」
- [ ] Progress / Toast（Base UI）— 原則「状態と応答」
- [ ] 汎用の Tooltip（Base UI。1.4.13 の解除・ホバー・持続を満たすか確認）・Combobox — 原則「再認」。Truncate は省略した全文の表示だけに使う
- [ ] Tabs・Menu（Base UI）
- [ ] SkipLink（本文へ移動）— WCAG 2.4.1
- [ ] ErrorSummary（送信時のエラー一覧と最初の誤りへのフォーカス移動。現在は NotificationBanner の組み合わせで代用）— WCAG 3.3.1
- [ ] Pagination
- [ ] 日付入力（年・月・日の 3 分割入力）

## 仕組み

- [ ] VRT の対象を全ストーリーに広げる（現在は代表のギャラリーだけ）
- [ ] shadcn CLI で `registry:base` の書き方（config の入れ子かトップレベルか）を確かめる
- [ ] Code Connect を残りのコンポーネントにも書き、Figma のノード ID を埋める
- [ ] Style Dictionary が DTCG の Resolver に対応したら、自前の読み込み処理を置き換える
- [ ] Figma Variables の取り込みを実際のファイルで確かめ、手順をルールブックに書く
- [ ] 利用プロジェクトでの使用状況を集計し、未使用トークン・未使用 props を検出する
