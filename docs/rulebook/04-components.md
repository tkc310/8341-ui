# 04 コンポーネント

## 技術

| 役割                       | 使うもの                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| 振る舞い・アクセシビリティ | Base UI v1（`@base-ui/react`）。ネイティブ要素で足りるもの（a、h1〜h6、hr 相当以外）は Base UI を使う |
| スタイル                   | Tailwind CSS v4 のクラス（semantic トークンのものだけ）                                               |
| バリアント                 | tailwind-variants v3 の `tv()`。**必ず `@/lib/tv` から import する**                                  |
| 配布                       | shadcn 方式（`registry.json`）と npm パッケージ（`vp pack`）                                          |

## ファイル構成

```
packages/ui/src/components/ui/Button/
├── index.tsx           # 本体＝公開 API（他のコンポーネントはここ経由で参照する）
├── index.test.tsx      # 単体テスト（happy-dom）
├── index.stories.tsx   # Storybook（状態ごとのストーリーと play 関数）
└── index.figma.ts      # Figma Code Connect（テンプレート形式）
```

ディレクトリ名は PascalCase。専用のフック（`useXxx.ts`）と子コンポーネント（入れ子のディレクトリ）も同じ場所に置く。詳しくは [コンポーネント構造規則](../../packages/ui/src/components/COMPONENT_STRUCTURE.md)。VRT はコンポーネントを横断するため `src/components/gallery.vrt.test.tsx` に集約している。

## 実装の規約

### import

- shadcn で配布したときと同じパスで書く: 他のコンポーネントは `@/components/ui/{Name}/index`、共通処理は `@/lib/{name}`
- 同じコンポーネントのディレクトリの中（子・フック）は相対パス。他のコンポーネントを相対パスで参照しない（`make check` が error にする）
- 他のコンポーネントの `index.tsx` 以外（子・フック）を参照しない（dependency-cruiser が error にする）

### React と Base UI

- Base UI の部品を包むときは、その部品の props を `ComponentProps<typeof Base.Part>` で受け取り、`...rest` で渡す
- 別の要素にしたいときは Base UI の `render` prop を使う（`asChild` は無い）。`<button>` 以外にするなら `nativeButton={false}`
- `'use client'` は、フック・コンテキスト・イベントハンドラを作るファイルだけに付ける（Base UI の部品自体には付いている）。React のフック（`use*`）を呼んでいるのに付いていないファイルはクラス監査が error にする（イベントハンドラだけのファイルは検出できないので、レビューで確かめる）。出力から消えていないかは `check-dist` が確かめる
- `Button` の既定は `type="button"`
- 見た目のバリエーションは `variant`、大きさは `size`、色調は `tone` という名前に揃える
- アクセシブルな名前に関わる props（`label`、`legend`、`title`、`summary`）は必須にする
- 文言の既定値は日本語で持ち、props で上書きできるようにする（例: `Link` の `newTabLabel`）

### スタイル

- `tv()` の `slots` / `variants` / `compoundVariants` で書き、利用者の `className` は最後に渡して上書きできるようにする
- 状態は Base UI の data 属性で装飾する（`data-[checked]:`、`data-[invalid]:`、`data-[disabled]:`、`data-[highlighted]:`、`data-[panel-open]:`）
- **フォーカスは `focus-ring`**（`@/lib/focus` の `focusRing`）。Base UI は `data-focus-visible` を付けないため `:focus-visible` で描く
- 見た目が 44px 未満の操作対象には `tap-target`
- 無効状態に hover を効かせないよう `enabled:hover:` を使う（Tailwind v4 の `hover:` は自動で `@media (hover: hover)` に入る）
- 強制カラーモードは `forced-colors:` で補う
- 論理プロパティのクラスを使う（`ps-*`、`ms-*`、`border-s-*`）
- クラス名を動的に組み立てない（`` `text-${size}` `` は Tailwind が検出できない）。variants に列挙する

## 完了の定義（Definition of Done）

- [ ] semantic トークンのクラスだけで書かれている（`make check` が error 0）
- [ ] すべての状態（default / hover / active / focus / disabled / invalid など）のストーリーがある
- [ ] ライトとダークの両方で見た目を確認した（Storybook の「並べて表示」）
- [ ] addon-a11y の違反がゼロ（ストーリーテストで検査される）
- [ ] キーボード操作を play 関数かテストで検証している
- [ ] [02 アクセシビリティ](./02-accessibility.md) の手動確認項目を実施した
- [ ] 主たる関数の JSDoc の 1 文目に「何をする部品か」を書いた（レジストリの説明になる）
- [ ] `src/index.ts` から export し、`make registry` でレジストリを更新した
- [ ] 振る舞いのテストを `index.test.tsx` に書いた
- [ ] Figma のコンポーネントがあれば `index.figma.ts` を書いた
- [ ] changeset を追加した（`make changeset`）

## 部品の選び方

| やりたいこと               | 使うもの                              | 使わないもの             |
| -------------------------- | ------------------------------------- | ------------------------ |
| 処理を実行する             | Button                                | Link                     |
| ページを移動する           | Link（カード全体なら Card の `href`） | Button                   |
| 2〜6 個から 1 つ選ぶ       | RadioGroup                            | Select                   |
| 7 個以上から 1 つ選ぶ      | Select                                | RadioGroup               |
| オン / オフ、複数選択      | Checkbox                              | トグルスイッチ（未提供） |
| ページ上部の重要なお知らせ | NotificationBanner                    | Tag                      |
| 一覧の項目の状態           | Tag（アイコン付き）                   | 色だけの点               |
| よくある質問など折りたたみ | Accordion + AccordionItem             | 独自のディスクロージャ   |
| 要素の縦横の間隔           | Stack                                 | 個別の margin            |
| フォームの送信と検証       | Base UI の Form + FormField           | 独自の検証の仕組み       |
