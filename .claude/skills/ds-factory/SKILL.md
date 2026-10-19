---
name: ds-factory
description: 新しいデザインシステムを作るときに使う（デザインシステムファクトリー）。design-principles とヒアリングの結果から、このリポジトリをひな形に別リポジトリのデザインシステムを生成し、トークン・文書・検査まで仕上げる。
---

# デザインシステムファクトリー

このリポジトリ（8341-ui）をひな形にして、**新しいデザインシステムのリポジトリ**を作る。
画面設計の判断は `design-principles` スキル（`docs/design-principles/`）に従い、プロダクト固有の前提はユーザーへのヒアリングで決める。
位置づけと全体像は `docs/factory.md`。

生成されるもの: 同じスタック（Base UI・Tailwind v4・DTCG トークン・Storybook・検査・改善ループ・design-principles）を持ち、名前・接頭辞・キーカラー・見た目の性格・DESIGN.md が新しいプロダクトに合わせて書き換わったリポジトリ。

## 手順

### 1. ルールを読む

- `design-principles` スキルを読み込み、「モード 1: 新規作成」に従う
- 共有の基盤にする場合は `docs/design-principles/README.md` の「複数のプロダクトで共有する基盤のデザインシステムを作る」も読む

### 2. ヒアリングする

`docs/design-principles/hearing.md` の項目に、次のファクトリー固有の項目を足して**一度にまとめて**聞く。
Claude Code では AskUserQuestion を使う。使えないエージェント（Cursor・Codex など）では、番号付きの短い質問リストをテキストで出す。
リポジトリや会話から分かることは聞かない。回答は要約して確認してから進む。

| # | 項目 | 選択肢・既定 |
| --- | --- | --- |
| 1 | 位置づけ | 複数プロダクトで共有する基盤 / 特定のプロダクト専用 |
| 2 | （専用のときのみ）サービス種別・対象ユーザー・ドメイン・UI の方向性・対象デバイス | hearing.md のとおり |
| 3 | 名前（パッケージ名の元） | 例: `acme-ui` → `acme-ui`、`acme-ui-tokens` |
| 4 | 接頭辞（CSS 変数・レジストリの名前空間） | 例: `acme` → `--acme-*`、`@acme/button` |
| 5 | キーカラー | ブランドカラーの hex、または OKLCH の色相。系統名（英小文字。例: `wakatake`）と表示名（例: 若竹 Wakatake） |
| 6 | フォント・その他のブランド制約 | 既定はひな形のまま（Noto Sans JP 系） |
| 7 | アクセシビリティ目標 | WCAG 2.2 AA（既定）/ AAA |
| 8 | テーマ | ライト＋ダーク（既定）/ ライトのみ |
| 9 | リポジトリ | GitHub の owner と リポジトリ名、ローカルの出力先ディレクトリ |
| 10 | 配布 | shadcn のレジストリのみ（既定）/ npm にも公開 |

注意:
- キーカラーの色相が状態色（赤 25・橙 50・黄 90・緑 155）に近いと、状態色と区別しにくい。近いときはユーザーに伝え、キーカラーか状態色の色相をずらす案を出す
- 接頭辞と名前は英小文字・数字・ハイフンのみ

### 3. 設定ファイルを書く

ヒアリングの結果を JSON にする（置き場所は作業用の一時ディレクトリ。このリポジトリにはコミットしない）。

```json
{
  "name": "acme-ui",
  "prefix": "acme",
  "repository": { "owner": "acme-inc", "name": "acme-design-system" },
  "keyColor": { "hex": "#2f7d5b", "family": "wakatake", "label": "若竹 Wakatake — キーカラー" }
}
```

`keyColor` は `hex` の代わりに `hue`（0〜360）でもよい。

### 4. 生成する

```bash
make factory CONFIG=<設定ファイル> OUT=<出力先>
```

- git で追跡しているファイルだけがコピーされる。未コミットの変更を含めたいときは先にコミットする
- 名前・接頭辞・系統名・リポジトリの URL が置き換わり、キーカラーの色相が `palette.config.json` に入る
- 最後に「ひな形の見た目の性格が残っている箇所」と「次の手順」が表示される

### 5. 生成先で仕上げる

以降は生成先のディレクトリで行う。

1. **依存とトークン**: `git init && make setup`（道具の版は `.tool-versions`） → `make palette` → `make tokens` → `design-md` → `tw-merge` → `make registry`
2. **コントラスト**: `make check`。不足があれば `semantic/light.tokens.json` / `dark.tokens.json` の段階番号を調整する。`contrast.rules.json` の基準は緩めない。AAA を選んだ場合は、文字の基準を 7:1 に上げる
3. **見た目の性格**: 4 で表示された箇所を、新しいキーカラーと性格で書き換える（DESIGN.md の冒頭、`docs/rulebook/01-principles.md` の「見た目の性格」、README の冒頭と特長、README のバナー `docs/assets/banner-*.svg` の色）。ひな形の ADR（0002 など）は「引き継いだ判断」として残し、変えた判断は新しい ADR に書く
4. **プロダクトの前提**:
   - 共有の基盤 → DESIGN.md の「UI の方向性とサービス種別は各プロダクトで決める」をそのまま使う
   - 専用 → `templates/PRODUCT-DESIGN.md` を元に、ヒアリング結果（プロダクト概要・画面領域ごとの方向性とサービス種別・採用したルール・外した必須とその理由）を DESIGN.md の冒頭に書く。特化ルールの「トークン」節に挙がる値（表の行高、主操作のサイズなど）をトークンとコンポーネントに反映する
5. **作者とライセンス**: `package.json` の `author`、`LICENSE` の著作権者を、新しいデザインシステムの持ち主に書き換える。`packages/*/CHANGELOG.md` の初回リリースの説明も新しいシステムに合わせる
6. **フォント**: 指定があれば `packages/tokens/src/primitive/typography.tokens.json` の font-family を変える
7. **ライトのみ**を選んだ場合: ひな形はライト＋ダーク前提。ダークを外す変更は影響が大きいので、範囲（resolver の theme、dark.tokens.json、Storybook の切り替え）をユーザーに示して確認してから行い、ADR に残す
8. **npm にも公開**を選んだ場合: `docs/releasing.md` のとおり、アカウント保有者が `npm login` したうえで `make release-publish NPM=1` を実行すると伝える（トークンは発行しない）
9. **確認**: `make verify && make build-storybook`。Storybook をライト・ダークで開き、キーカラー・フォーカス表示・状態色を目で確かめる

### 6. 公開する（ユーザーの承認を得てから）

- コミットし、ユーザーが承認したら GitHub にリポジトリを作って push する（例: `gh repo create <owner>/<name> --public --source . --push`）
- GitHub Pages（Settings > Pages を `gh-pages` ブランチに）と、main の保護（README の手順）をユーザーに案内する

### 7. 報告する

生成したリポジトリの場所、ヒアリングの要約、ひな形から変えた点、外した必須とその理由、残っている作業を短く伝える。

## このリポジトリ側の改善

- 生成で困った点（置き換え漏れ、手作業が多い手順）は、`scripts/factory/create.mjs` かこのスキルを直す PR にする
- 画面設計のルールのギャップは `docs/design-principles/` を直す（`design-principles` スキルの「ルールへのフィードバック」）

## やってはいけないこと

- ヒアリングを飛ばして既定値だけで生成する（共有の基盤か専用かで DESIGN.md の書き方が変わる）
- 生成先で `contrast.rules.json` や WCAG の必須を緩めてチェックを通す
- ユーザーの承認なしに GitHub にリポジトリを作る・公開する
