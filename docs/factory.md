# このリポジトリの位置づけとデザインシステムファクトリー

## 位置づけ

このリポジトリには二つの使い方がある。

1. **デザインシステムとして使う**
   8341-ui は、そのままプロダクトで使えるデザインシステムである。トークン（W3C DTCG）、コンポーネント（Base UI + Tailwind CSS v4）、Storybook、ルールブック、DESIGN.md、改善ループを持つ。shadcn のレジストリでコードを取り込む（[README](../README.md) の「使う」）。

2. **デザインシステムファクトリーとして使う**
   画面設計のルール（[design-principles](./design-principles/README.md)）とユーザーへのヒアリングの結果から、**新しいデザインシステムのリポジトリ**を作る。8341-ui はそのひな形になる。ファクトリーは AI エージェントのスキル（`ds-factory`）として動く。

どちらの使い方でも、画面設計の判断は `docs/design-principles/` を正とする。このリポジトリで見つけたルールのギャップは、ここを直して、デザインシステムとファクトリーの両方に反映させる。

```
docs/design-principles/ ──（ルール）──┬──▶ 8341-ui（このリポジトリのデザインシステム）
                                      │
ヒアリング ──（前提）──▶ ds-factory ──┴──▶ 新しいデザインシステム（別リポジトリ）
                          │
                          └─ ひな形: 8341-ui（scripts/factory/create.mjs が複製して書き換える）
```

## 推奨する AI エージェント

推奨は Claude Code。Cursor と Codex でも、同じ指示とスキルを読めるようにしている（シンボリックリンクで入口をそろえている）。置き場所と各エージェントの読み込み方は [ai-agents.md](./ai-agents.md)。

## デザインシステムファクトリー

### 呼び出し方

エージェントに「新しいデザインシステムを作りたい」と頼むか、スキルを直接呼ぶ。

- Claude Code・Cursor: `/ds-factory`
- Codex: `$ds-factory`、またはスキルの一覧から選ぶ

### 流れ

1. **ルールを読む**: `design-principles` スキルの「新規作成」モード（`mode-1-init.md`）に従う
2. **ヒアリング**: [hearing.md](./design-principles/hearing.md) の項目に、ファクトリー固有の項目（共有の基盤か専用か、名前、接頭辞、キーカラー、フォント、アクセシビリティ目標、テーマ、リポジトリ、配布方法）を足して、一度にまとめて聞く
3. **設定ファイル**: 回答を JSON にまとめる
4. **生成**: `node scripts/factory/create.mjs --config <設定> --out <出力先>`
   - git で追跡しているファイルを複製し、名前・接頭辞・キーカラーの系統名・リポジトリの URL を置き換える
   - キーカラーの色相（hex から変換も可）を `palette.config.json` に入れる
   - ファクトリー専用のファイルと、文書中の `<!-- factory:start -->` 〜 `<!-- factory:end -->` を取り除く
   - 改善ログを空にし、生成の記録を ADR に残す
5. **仕上げ**（生成先で）: 依存の導入、パレットとトークンの再生成、コントラストの確認、見た目の性格（キーカラーの名前・説明）の書き換え、プロダクトの前提を DESIGN.md に記入、`make verify`
6. **公開**: ユーザーの承認を得てから GitHub にリポジトリを作る

詳しい手順は [`.claude/skills/ds-factory/SKILL.md`](../.claude/skills/ds-factory/SKILL.md)。

### 生成されるもの・されないもの

| 生成先に入る | 生成先に入らない |
| --- | --- |
| トークン・コンポーネント・Storybook・検査・CI・改善ループ | ファクトリー（`scripts/factory/`、`ds-factory` スキル、この文書） |
| design-principles とそのスキル | 8341-ui の改善ログ（空から始める） |
| ルールブック・ADR（引き継いだ判断として残る） | ロックファイル（生成先で `make install` して作る） |

### 設定ファイルの例

```json
{
  "name": "acme-ui",
  "prefix": "acme",
  "repository": { "owner": "acme-inc", "name": "acme-design-system" },
  "keyColor": { "hex": "#2f7d5b", "family": "wakatake", "label": "若竹 Wakatake — キーカラー" }
}
```

この設定で生成すると、パッケージは `acme-ui` と `acme-ui-tokens`、CSS 変数は `--acme-*`、レジストリは `@acme/button` のようになる。

### ファクトリーを直す

- 置き換え漏れや、生成後の手作業が多い手順を見つけたら、`scripts/factory/create.mjs` か `ds-factory` スキルを直す
- 8341-ui に入れた改善は、それ以降に生成するデザインシステムに引き継がれる。生成済みのデザインシステムには自動では入らない
