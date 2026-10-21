# モード 2: 既存の調整（既存 DS / DESIGN.md の調整）

`design-principles` スキルの本体（[SKILL.md](./SKILL.md)）でヒアリングを終え、このモードを選んだときに読む。

**目的**: 既にあるデザインシステムや DESIGN.md を見直す。トークンやコンポーネントを追加・変更する。

## 読む順序

1. 既存の DESIGN.md または設計資料（調整する領域に関係する節から）
2. `references/README.md` - 読み順の確認
3. `references/ui-orientation.md` - 画面の方向性が適切か確認する（ドメインと対象ユーザーが変わった場合は見直す）
4. 調整が必要な領域に関係する特化ルールだけ（`references/services/` から該当するもの）
5. `references/principles.md` の該当する節だけ
6. `references/wcag-for-designers.md` の該当する達成基準だけ

## 成果物

- UI の方向性の確認結果（変更がある場合は新しい方向性と理由）
- 追加・変更したトークンとコンポーネントの定義
- 必須ルールを外した場合の理由の追記
- 既存ルールとの整合性の確認結果
