# 開発ガイド

8341-ui の開発手順をまとめる。運用（CI・Pages・GitHub の設定）は [docs/operations.md](./docs/operations.md)、リリースは [docs/releasing.md](./docs/releasing.md)。
AI エージェントで開発するときも、この手順と [AGENTS.md](./AGENTS.md) の「守ること」に従う。

## 前提

使う道具と版は、リポジトリ直下の [`.tool-versions`](./.tool-versions) に書いている。CI も同じ版を使う。

| 道具 | 版（`.tool-versions`） | 用途 |
| --- | --- | --- |
| Node.js | 24.22.0（LTS） | ビルド・テスト・スクリプトの実行 |
| pnpm | 12.14.0 | 依存の管理（workspaces / catalog） |
| GitHub CLI（`gh`） | 2.102.0 | Storybook のプレビューの公開、リリース、PR の操作 |
| Git | 指定なし | シンボリックリンクを扱える設定にする（Windows は下の注意） |
| make | 指定なし | コマンドの入口（macOS・Linux には標準で入っている。Windows は WSL を使う） |

Playwright のブラウザ、Storybook、Vite+ などは pnpm の依存として入るので、個別に入れる必要はない。

## 導入手順

### 1. 版管理ツールを入れる

`.tool-versions` を読める版管理ツールを使う。おすすめは [mise](https://mise.jdx.dev/)（asdf でもよい）。

```bash
# macOS（Homebrew）
brew install mise
# その他の環境: https://mise.jdx.dev/getting-started.html

# シェルで有効にする（zsh の例。bash は ~/.bashrc に bash を指定）
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc && exec zsh
```

asdf を使う場合は、プラグインを先に入れる。

```bash
asdf plugin add nodejs
asdf plugin add pnpm
asdf plugin add github-cli
```

### 2. リポジトリを取得して道具を入れる

```bash
git clone https://github.com/tkc310/8341-ui.git
cd 8341-ui
make tools          # mise（なければ asdf）で .tool-versions の版を入れる
node -v             # v24.22.0
pnpm -v             # 12.14.0
gh --version        # 2.102.0
```

版管理ツールを使わない場合は、上の表の版を手で入れる（pnpm は `corepack enable && corepack prepare pnpm@12.14.0 --activate` でも入る）。

### 3. 依存を入れて動かす

```bash
make install        # 依存を入れる（prepare でトークンもビルドされる）
make dev            # Storybook（http://localhost:6006）
make verify         # 動作確認（check と test）
```

2 と 3 は `make setup`（`make tools` と `make install`）でまとめて行える。

### 4. GitHub CLI にログインする（プレビューの公開・リリースをする人）

```bash
gh auth login
```

### Windows の場合

シンボリックリンク（`CLAUDE.md`、スキル）を使うため、開発者モードを有効にして `git config --global core.symlinks true` を設定してから clone するか、WSL の中で作業する（[docs/ai-agents.md](./docs/ai-agents.md)）。

### 道具の版を上げる

`.tool-versions` を書き換えて PR を出す。CI もその版で動くので、`check` と `test` が通れば上げてよい。依存のパッケージは `pnpm outdated -r` で古いものを確かめ、`pnpm-workspace.yaml` の catalog の版を上げる（方針は [ADR-0015](./docs/decisions/0015-dependency-update-2026-10.md)）。Node のメジャー版を上げるときは、`package.json` の `devEngines` も合わせる。

## よく使うコマンド

コマンドはすべて `make` で実行する。`make` だけで一覧が出る（定義は [`Makefile`](./Makefile)。中身は pnpm のスクリプトを呼ぶだけ）。

| コマンド | やること |
| --- | --- |
| `make setup` | 初回の準備（`make tools` と `make install`） |
| `make dev` | Storybook を起動する |
| `make check` | fmt・lint（型情報つき）・型、生成物の鮮度、コントラスト、クラス監査、依存の向き |
| `make test` | 単体テスト（happy-dom）と、全ストーリーの実ブラウザ描画・axe |
| `make verify` | `check` と `test` をまとめて実行する（PR を出す前に） |
| `make test-vrt` | 見た目の回帰テスト（手動） |
| `make test-e2e` | e2e（320px・200%・強制カラー・ドキュメントの表示。手動） |
| `make browsers` | テスト用のブラウザ（Playwright の Chromium）を入れる |
| `make build` | トークン → コンポーネント（ESM・型・CSS） |
| `make build-storybook` | Storybook とレジストリをビルドする |
| `make generate` | 生成物をまとめて更新する（tokens・design-md・tw-merge・registry） |
| `make tokens` / `palette` / `design-md` / `tw-merge` / `figma` / `registry` | 生成物を個別に更新する |
| `make audit` | 健康診断レポートを作る（`reports/audit.md`） |
| `make storybook-preview` | PR 用の Storybook を Pages に公開する（`PR=番号` で指定も可） |
| `make changeset` | 変更内容を記録する（公開パッケージを変えたとき） |
| `make release-version` / `make release-publish` | リリース（[docs/releasing.md](./docs/releasing.md)） |
| `make clean` | ビルドの成果物を消す |

pnpm のスクリプト（`pnpm check` など）を直接実行しても同じ結果になる。ターゲットを足すときは、`Makefile` に `## 説明` を付けて一覧に出るようにする。

## 変更の流れ

1. **ブランチを切る**: `feat/…`・`fix/…`・`docs/…`・`chore/…` のように、変更の種類を頭に付ける
2. **変更する**: 下の「変更の種類ごとの手順」に従う
3. **確かめる**: `make verify`。見た目を変えたら `make test-vrt` も
4. **記録する**:
   - 公開パッケージ（`8341-ui`・`8341-ui-tokens`）を変えたら `make changeset`（[版の決め方](./docs/releasing.md#版の決め方)）
   - 改善なら `docs/improvement/log.md` に 1 行
   - 値や方針を変えたら `docs/decisions/` に ADR
5. **PR を出す**: PR テンプレートのチェックリストを埋める。見た目が変わるなら、`make storybook-preview` で公開したプレビューのリンクを添える（`ds-storybook-preview` スキル）
6. **マージ**: `check` と `test` が通ったら squash マージする。マージ後のブランチは `Branch cleanup` が消す

## コミットメッセージと PR タイトル

コミットメッセージは [Conventional Commits 1.0.0](https://www.conventionalcommits.org/ja/v1.0.0/) に従う。人間も AI エージェントも同じです。

```
<種類>[(<範囲>)][!]: <変更の要約>

[本文: 何をなぜ変えたか]

[フッター: BREAKING CHANGE: … / Refs: #12 など]
```

- **種類**（英小文字）:

  | 種類 | 使うとき |
  | --- | --- |
  | `feat` | 機能・コンポーネント・トークンの追加、利用者から見える振る舞いの変更 |
  | `fix` | 不具合・アクセシビリティ違反の修正 |
  | `docs` | 文書だけの変更（README・ADR・ルールブック・design-principles など） |
  | `style` | 整形だけの変更（動作も見た目も変わらない） |
  | `refactor` | 振る舞いを変えないコードの整理 |
  | `perf` | 性能の改善 |
  | `test` | テストの追加・修正 |
  | `build` | ビルド・依存・パッケージ設定の変更 |
  | `ci` | GitHub Actions の変更 |
  | `chore` | 上のどれにも当たらない雑務（道具の版上げ、生成物の更新など） |
  | `revert` | 取り消し（本文に取り消したコミットのハッシュを書く） |

- **範囲**（任意）: 変えた場所を英小文字で。例: `button`・`select` などコンポーネント名、`tokens`・`storybook`・`registry`・`factory`・`release`
- **破壊的変更**: 種類の後ろに `!` を付け（例: `feat(tokens)!: …`）、フッターに `BREAKING CHANGE: 何が変わり、利用者は何をすればよいか` を書く。changeset も major（0.x の間は minor）にする
- **要約**: 日本語で、何をしたかを 1 行（目安 50 字以内）。文末に句点を付けない
- **本文**: 日本語で、何をなぜ変えたかを書く（どう変えたかはコードを見ればわかる）

例:

```
feat(tooltip): Tooltip を追加
fix(select): 選択肢の名前が先頭の項目で読み上げられる不具合を直す
docs: コミットメッセージの規約を書く
feat(tokens)!: color.bg.subtle を color.surface.subtle に改名

BREAKING CHANGE: クラス bg-bg-subtle は bg-surface-subtle に置き換える
```

main へは squash マージするため、**PR のタイトルが main のコミットメッセージになります**。PR のタイトルも同じ形式で書いてください。changeset の説明（CHANGELOG に載る文）はこれとは別に、利用者向けに書きます（[docs/releasing.md](./docs/releasing.md)）。

## 変更の種類ごとの手順

### トークンを変える

```bash
# 値を変える: packages/tokens/src/{primitive,semantic}/*.tokens.json
# キーカラーを変える: packages/tokens/src/palette.config.json → 次で primitive を再生成
make palette
make tokens       # CSS 変数・Tailwind テーマ・Figma JSON
make design-md   # DESIGN.md の表
make tw-merge    # クラス統合の設定
make check
```

- semantic カラーを足したら、`packages/tokens/src/contrast.rules.json` に組み合わせを足す
- ライトとダークでキーをそろえる（CI が検査する）

### コンポーネントを足す・変える

`packages/ui/src/components/ui/<Name>/`（ディレクトリ名は PascalCase）に次をそろえる。構造と import の規則は [コンポーネント構造規則](./packages/ui/src/components/COMPONENT_STRUCTURE.md)（`make check` が検査する）。

| ファイル | 中身 |
| --- | --- |
| `index.tsx` | 本体（そのまま公開 API）。Base UI の部品と `tv`（`@/lib/tv`）で書く。フックを使うなら先頭に `'use client'` |
| `index.test.tsx` | 振る舞いの単体テスト（happy-dom） |
| `index.stories.tsx` | ストーリー。操作があるなら play 関数で振る舞いを検査する |
| `index.figma.ts` | Code Connect（Figma のコンポーネントがある場合） |
| `useXxx.ts`・`<Child>/` | そのコンポーネント専用のフック・子コンポーネント（必要なら） |

- semantic トークンの Tailwind クラスだけを使う（任意値では `var(--8341-*)`）
- ほかのコンポーネントは `@/components/ui/<Name>/index` で import する（相対パスにしない）
- 追加・削除したら `make registry` でレジストリを更新する
- 使い方の規約は [docs/rulebook/04-components.md](./docs/rulebook/04-components.md)、アクセシビリティは [02-accessibility.md](./docs/rulebook/02-accessibility.md)

### 画面設計のルールを変える

`docs/design-principles/` を直す。トークンやコンポーネントへの影響は [docs/rulebook/01-principles.md](./docs/rulebook/01-principles.md) の対応表で辿る。

## AI エージェントで開発する

Claude Code を推奨とし、Cursor と Codex でも同じスキルを使える（[docs/ai-agents.md](./docs/ai-agents.md)）。
どのスキルをいつ使うかは [docs/skills.md](./docs/skills.md) を読む。スキルを足す・直すときも、同じ文書の「必要なときだけ読み込む仕組み」に従う。

## 質問・提案・不具合

- 改善の提案や不具合は、Issue テンプレート「改善提案」で起票する
- 脆弱性は Issue に書かず、[SECURITY.md](./SECURITY.md) の手順で知らせる
