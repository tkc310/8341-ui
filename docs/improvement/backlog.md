# 改善バックログ

改善候補の一覧です。Issue があればリンクします。優先度の決め方は `docs/rulebook/06-improvement-loop.md` を参照。
着手したら `- [x]` にし、完了したら `log.md` に 1 行記録してここから消します。

## アクセシビリティ

- [ ] 全ストーリーを NVDA / VoiceOver で読み上げ確認する（自動テストでは名前・状態の自然さが分からない）
- [ ] Accordion の summary 内に見出しを置いたときの読み上げを主要スクリーンリーダーで確認し、必要なら構造を見直す

## 原則・ルール

- [ ] `tkc310/agents-playground` の `docs/design-principles` をルールブック（01 デザイン原則）に統合する（初版時はアクセス権がなく未反映）

## コンポーネント

- [ ] Table（ソート・横スクロール時の見出し固定）
- [ ] Dialog（`dialog` 要素ベース。フォーカストラップと戻り先）
- [ ] Tabs（APG のタブパターン）
- [ ] SkipLink（本文へ移動）
- [ ] ErrorSummary（送信時のエラー一覧。現在は NotificationBanner の組み合わせで代用）
- [ ] Pagination
- [ ] 日付入力（年・月・日の 3 分割入力）

## 仕組み

- [ ] Storybook の VRT（ライト / ダーク / 強制カラーのスクリーンショット比較）を CI に追加する
- [ ] Figma Variables との同期（tokens.json → Figma）
- [ ] 利用プロジェクトでの使用状況を集計し、未使用トークン・未使用 props を検出する
