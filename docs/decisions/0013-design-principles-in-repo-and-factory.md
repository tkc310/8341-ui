# 0013 design-principles を取り込み、デザインシステムファクトリーとして位置づける

- 日付: 2026-10-19
- 状態: 採用（0007 のルールの置き場所を変更）

## 背景
画面設計のルール（design-principles）は `tkc310/agents-playground` の `docs/design-principles/` にあり、このリポジトリからは外部リンクで参照していた。
ルールとデザインシステムが別のリポジトリにあると、ルールの変更とトークン・コンポーネントの対応表がずれやすい。また、このリポジトリを、design-principles とヒアリングから新しいデザインシステムを作る道具としても使いたい。

## 決定
- design-principles（ルール本文、スキル、init / adjust / review の各モード）をこのリポジトリに取り込む
  - ルール本文: `docs/design-principles/`（正本）
  - スキル: `.claude/skills/design-principles/`（`references/` は `docs/design-principles/` へのシンボリックリンク）、`design-init` / `design-adjust` / `design-review`
- リポジトリ内のリンクは、取り込んだパスを参照する。ただし、他のリポジトリにコピーして使う雛形（`templates/PRODUCT-DESIGN.md`）と、Storybook で表示する文書は、このリポジトリの GitHub 上のパスを URL で参照する
- このリポジトリを「デザインシステム」と「デザインシステムファクトリー」の二つの位置づけにする（`docs/factory.md`）
  - ファクトリーは `ds-factory` スキルと `scripts/factory/create.mjs`。8341-ui をひな形に、名前・接頭辞・キーカラー・リポジトリを置き換えた新しいリポジトリを作る
- 推奨エージェントは Claude Code。Cursor と Codex でも使えるよう、正本を 1 か所に置いてシンボリックリンクで入口をそろえる（`docs/ai-agents.md`）
  - `CLAUDE.md` → `AGENTS.md`、`.agents/skills` → `.claude/skills`

## 理由
- ルールと対応表を同じリポジトリに置けば、ルールの変更と部品への影響を一つの PR で扱える
- ファクトリーのひな形を、実際に検査を通して運用しているデザインシステムそのものにすれば、生成物の品質がひな形の改善とともに上がる
- 指示とスキルの正本を一つにすれば、エージェントごとの内容のずれが起きない

## 影響・トレードオフ
- `tkc310/agents-playground` の `docs/design-principles/` とは別々に更新されうる。今後はこのリポジトリを正とし、あちらには正本が移ったことを示す
- シンボリックリンクを使うため、Windows では `core.symlinks` の設定か WSL が要る
- 生成済みのデザインシステムには、ひな形の改善は自動で入らない
