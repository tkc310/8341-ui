# 生成先での仕上げ（ds-factory の手順 5）

以降は生成先のディレクトリで行う。

1. **依存とトークン**: `git init && make setup`（道具の版は `.tool-versions`） → `make palette` → `make generate`
2. **コントラスト**: `make check`。不足があれば `semantic/light.tokens.json` / `dark.tokens.json` の段階番号を調整する。`contrast.rules.json` の基準は緩めない。AAA を選んだ場合は、文字の基準を 7:1 に上げる
3. **見た目の性格**: 生成時に表示された箇所を、新しいキーカラーと性格で書き換える（DESIGN.md の冒頭、`docs/rulebook/01-principles.md` の「見た目の性格」、README の冒頭と特長、README のバナー `docs/assets/banner-*.svg` の色）。ロゴとアイコン（`docs/assets/logo*`・`icon-*`、`apps/storybook/public/` の favicon・アイコン・`logo.svg`）は 8341-ui 固有なので、新しいシステムのロゴに差し替えるか、削除して `.storybook/manager.ts` の `brandImage` と `manager-head.html` のリンクを外す（`docs/assets/README.md`）。ひな形の ADR（0002 など）は「引き継いだ判断」として残し、変えた判断は新しい ADR に書く
4. **プロダクトの前提**:
   - 共有の基盤 → DESIGN.md の「UI の方向性とサービス種別は各プロダクトで決める」をそのまま使う
   - 専用 → `templates/PRODUCT-DESIGN.md` を元に、ヒアリング結果（プロダクト概要・画面領域ごとの方向性とサービス種別・採用したルール・外した必須とその理由）を DESIGN.md の冒頭に書く。特化ルールの「トークン」節に挙がる値（表の行高、主操作のサイズなど）をトークンとコンポーネントに反映する
5. **作者とライセンス**: `package.json` の `author`、`LICENSE` の著作権者を、新しいデザインシステムの持ち主に書き換える。`packages/*/CHANGELOG.md` の初回リリースの説明も新しいシステムに合わせる
6. **フォント**: 指定があれば `packages/tokens/src/primitive/typography.tokens.json` の font-family を変える
7. **ライトのみ**を選んだ場合: ひな形はライト＋ダーク前提。ダークを外す変更は影響が大きいので、範囲（resolver の theme、dark.tokens.json、Storybook の切り替え）をユーザーに示して確認してから行い、ADR に残す
8. **npm にも公開**を選んだ場合: `docs/releasing.md` のとおり、アカウント保有者が `npm login` したうえで `make release-publish NPM=1` を実行すると伝える（トークンは発行しない）
9. **確認**: `make verify && make build-storybook`。Storybook をライト・ダークで開き、キーカラー・フォーカス表示・状態色を目で確かめる
