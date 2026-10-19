## 変更内容

<!-- 何を、なぜ変えたか -->

## Storybook プレビュー

<!-- 見た目が変わる PR は、ローカルで `make storybook-preview` を実行し、変わったストーリーへのリンク（ライト / ダーク）をここに書く。
     手順: .claude/skills/ds-storybook-preview/SKILL.md。見た目が変わらない PR は「なし」とだけ書く -->
<!-- storybook-preview:start -->
なし
<!-- storybook-preview:end -->

## 完了の定義

- [ ] `make check` と `make test` が通る
- [ ] changeset を追加した（`make changeset`。利用者に影響が無い変更なら不要）
- [ ] ライト / ダークの両方で見た目を確認した（見た目が変わる場合は上の Storybook プレビューを添えた）
- [ ] キーボードで操作でき、フォーカス表示が見える
- [ ] 新しい semantic カラーを足した場合、`tokens/contrast.rules.json` に組み合わせを足した
- [ ] 値や方針を変えた場合、`docs/decisions/` に ADR を足した

## 改善ループ

- [ ] `docs/improvement/log.md` に 1 行追記した
- 再発防止として追加したもの: <!-- チェック / テスト / ルール / なし（理由） -->
