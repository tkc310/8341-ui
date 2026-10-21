# モード 1: 新規作成（新しいデザインシステム / DESIGN.md）

`design-principles` スキルの本体（[SKILL.md](./SKILL.md)）でヒアリングを終え、このモードを選んだときに読む。

**目的**: これから作るプロジェクトの DESIGN.md を書く、または新しいデザインシステムを定義する。

## 読む順序

1. `references/README.md` - 全体の構造と読み順
2. `references/ui-orientation.md` - 画面の方向性（オブジェクト指向 UI かタスク指向 UI か）を、ドメインと対象ユーザーから決める
3. `references/services/README.md` - 画面の目的に合う特化ルールを選ぶ
4. 選んだ特化ルールだけ（`references/services/admin.md`・`internal.md`・`saas.md`・`consumer.md` のどれか）
5. `references/principles.md` - 1〜4 が書いていない判断を補う
6. `references/wcag-for-designers.md` - 必須の達成基準を確認する

## 成果物

DESIGN.md に次を含める。

- プロダクトの UI の方向性（オブジェクト指向 UI かタスク指向 UI か）と選択理由
- 画面領域ごとの UI の方向性（一つのプロダクトに両方の画面があるときは領域ごとに書く）
- 画面領域ごとのサービス種別（管理画面、社内向けツール、SaaS、toC）
- 採用したルール（UI の方向性 → 特化ルール → 原則 → WCAG の順）
- トークン名とコンポーネント名の対応
- 必須ルールを外した項目がある場合、その理由

## 共有の基盤の場合

複数のプロダクトで共有する基盤のデザインシステムでは、UI の方向性とサービス種別は基盤では決めず、各プロダクトの DESIGN.md で決める。基盤の DESIGN.md には、原則の各ルールとトークン・コンポーネントの対応表、テーマごとの WCAG の確認結果、プロダクト側の DESIGN.md の雛形を含める。手順は `references/README.md` の「複数のプロダクトで共有する基盤のデザインシステムを作る」に従う。
