# 0019 8341-ui を使うプロダクトに DESIGN.md と design-principles をレジストリで配る

- 日付: 2026-10-23
- 状態: 採用

## 背景
UI の方向性とサービス種別は各プロダクトの DESIGN.md で決める（ADR-0007）。しかし 8341-ui の部品を shadcn で取り込んだプロダクトには、原則もプロダクト用 DESIGN.md も届かなかった。雛形 `templates/PRODUCT-DESIGN.md` を手でコピーし、原則は GitHub のリンクで読む前提で、プロダクト側のエージェントは原則を参照できなかった。ファクトリーで作ったデザインシステムには原則が入るのに、部品を使うだけのプロダクトには入らない差があった。

## 決定
- shadcn のレジストリに `@8341/design-md`（`registry:file`）を足す。`npx shadcn@latest add @8341/design-md` で、リポジトリ直下に `DESIGN.md`、`docs/design-principles/` に原則の全文が置かれる（`target` の `~` はプロジェクトのルート）
- プロダクト用 DESIGN.md には **コードから読み取れない設計の考え方だけ** を書く。プロダクトの前提、画面領域ごとの UI の方向性とサービス種別、このプロダクトで大事にすること、外した必須とその理由、8341-ui に足したものの理由。トークンの値や部品の一覧は書かない（コードが正）
- DESIGN.md の「デザイン原則」は `<!-- auto:principles -->` にし、`scripts/sync-product-design.ts` が `docs/design-principles/` から判断の順序・ルールの強さ・UI の方向性と各原則の「必須」を生成する。`make check` で鮮度を検査する
- 配るファイルは `packages/ui/scripts/build-registry-assets.ts`（旧 `build-registry-css.ts`）が `registry-assets/` に作る。原則の文書からは `<!-- factory:start -->` 〜 `<!-- factory:end -->` を取り除く（利用側はファクトリーではない）
- 配る原則のファイル一覧は `generate-registry.ts` が `docs/design-principles/` から作り、`registry.json` の `--check` で追従させる

## 理由
- 部品の取り込みと同じ shadcn の仕組みに乗せれば、プロダクト側の手順が 1 行増えるだけで済み、版を固定したレジストリ（`r/v<版>/`）で原則の版もそろう
- トークンや部品の仕様を DESIGN.md に写すと、コードと二重管理になり古くなる。コードから読み取れない判断の軸だけを置けば、DESIGN.md は短く保て、エージェントが毎回読んでも負担が小さい（ADR-0018）
- 原則の必須の要約を生成にすれば、原則を直したときにプロダクト用の雛形が古くならない

## 影響・トレードオフ
- 原則の更新を取り込むと DESIGN.md が上書きになる。手順（作業用のブランチで取り込み、`auto` の範囲と `docs/design-principles/` だけを採用する）を DESIGN.md の末尾に書いた
- npm パッケージで使う場合は、この仕組みは使えない（shadcn のレジストリだけ）。必要になったら別の配り方を検討する
- 原則の必須は要約で、推奨・レビュー項目・理由は `docs/design-principles/` の全文を読む
