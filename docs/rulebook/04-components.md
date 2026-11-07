# 04 コンポーネント

## 技術

| 役割                       | 使うもの                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| 振る舞い・アクセシビリティ | Base UI v1（`@base-ui/react`）。ネイティブ要素で足りるもの（a、h1〜h6、hr 相当以外）は Base UI を使う |
| スタイル                   | Tailwind CSS v4 のクラス（semantic トークンのものだけ）                                               |
| バリアント                 | tailwind-variants v3 の `tv()`。**必ず `@/lib/tv` から import する**                                  |
| 配布                       | shadcn 方式（`registry.json`）と npm パッケージ（`vp pack`）                                          |

## ファイル構成

`packages/ui/src/components/ui/<PascalCase>/index.tsx` に本体を置き、テスト・ストーリー・Code Connect・専用のフックと子コンポーネントを同じディレクトリに置く。置いてよいファイルと import の規則は [コンポーネント構造規則](../../packages/ui/src/components/COMPONENT_STRUCTURE.md)（`make check` が検査する）。VRT はコンポーネントを横断するため `src/components/gallery.vrt.test.tsx` に集約している。

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
- 状態は Base UI の data 属性で装飾する（`data-[checked]:`、`data-[invalid]:`、`data-[disabled]:`、`data-[highlighted]:`、`data-[panel-open]:`、`data-[starting-style]:`）
- **フォーカスは `focus-ring`**（`@/lib/focus` の `focusRing`）。Base UI は `data-focus-visible` を付けないため `:focus-visible` で描く
- 見た目が 44px 未満の操作対象には `tap-target`
- 無効状態に hover と押した見た目を効かせないよう `not-disabled:hover:`・`not-disabled:active:` を使う。`enabled:` は `<a>` に当たらず、ボタンの見た目（`buttonVariants`）をリンクに当てたときに何も出なくなる（クラス監査の `enabled-variant`）
- `hover:` を付けたら、同じ見た目かそれより濃い見た目を `active:` にも付ける。Tailwind v4 の `hover:` は自動で `@media (hover: hover)` に入り、タッチでは出ないので、押したことは `active:` だけが伝える（クラス監査の `hover-without-active`）
- ラベルの文字を押して操作する部品（Checkbox・Radio・Switch）は、ラベルに `group/*` を付け、`group-active/*:` で四角・丸・トラックにも押した見た目を出す
- 強制カラーモードは `forced-colors:` で補う
- 論理プロパティのクラスを使う（`ps-*`、`ms-*`、`border-s-*`）
- クラス名を動的に組み立てない（`` `text-${size}` `` は Tailwind が検出できない）。variants に列挙する
- 見た目に欠かせない値を `style` 属性に頼らない。既定の値はクラスで持ち、`style` は利用者が値を指定したときだけ出す（下の「CSP の下で使う」）。動かす値（ドラッグ中の位置など）はスクリプトから CSSOM（`element.style.transform = …`）で変える

## CSP の下で使う

利用側が `style-src` に `'unsafe-inline'` を入れない CSP を掛けると、サーバーで描画した HTML の `style` 属性は止まる（スクリプトから CSSOM で変えた値は止まらない）。部品はそれでも崩れないように作る。

| 出どころ | 何が起きるか | 部品の側の対処 |
| --- | --- | --- |
| Base UI の Checkbox・Radio・Switch が隣に描くネイティブ入力（`aria-hidden`）の `style` | 見えないはずの入力が表示される | ラベルの `hide-native-input`（theme.css）でクラスからも隠す |
| Base UI の Accordion の閉じたパネルの `--accordion-panel-height:auto;…` | 違反が報告される（開閉の動きの初期値だけで、表示は崩れない） | なし（利用側でハッシュを許すか、報告を受け入れる） |
| Skeleton の `width` / `height` | 指定した大きさにならない | 既定の大きさはクラスで持つ。CSP を掛けるなら `className`（`w-*`・`h-*`）で指定する |

利用側で違反の報告まで消したいときは、`'unsafe-inline'` ではなく `'unsafe-hashes'` と値ごとのハッシュで許す（`'sha256-…'` は style 属性の文字列そのものから作る。ルーターなど部品以外が出す style も同じ扱い）。ハッシュは依存の更新で変わりうるので、テストで文字列から計算して確かめる。

フォームの検証にスキーマのライブラリを使うときは、`eval` / `new Function` を使わないものを選ぶ。Zod 4 は `z.object()` を作るときに JIT のため `new Function` を試し、`script-src` に `'unsafe-eval'` が無いと違反が報告される（動作は続く）。`z.config({ jitless: true })` はスキーマを作るどの import よりも先に要るので、Valibot など eval を使わないものの方が扱いやすい。

## 完了の定義（Definition of Done）

- [ ] semantic トークンのクラスだけで書かれている（`make check` が error 0）
- [ ] すべての状態（default / hover / active / focus / disabled / invalid など）のストーリーがある
- [ ] ライトとダークの両方で見た目を確認した（Storybook の「並べて表示」）
- [ ] addon-a11y の違反がゼロ（ストーリーテストで検査される）
- [ ] キーボード操作を play 関数かテストで検証している
- [ ] [02 アクセシビリティ](./02-accessibility.md) の手動確認項目を実施した
- [ ] 主たる関数の JSDoc の 1 文目に「何をする部品か」を書いた（レジストリの説明になる）
- [ ] [コンポーネント構造規則](../../packages/ui/src/components/COMPONENT_STRUCTURE.md) のチェックリストを満たした（`src/index.ts` からの export と `make registry` を含む）
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
| 送信して反映するオン / オフ、複数選択 | Checkbox                   | Switch                   |
| 押した瞬間に反映する設定   | Switch                                | Checkbox                 |
| ページ上部の重要なお知らせ | NotificationBanner                    | Tag                      |
| 一覧の項目の状態           | Tag（アイコン付き）                   | 色だけの点               |
| よくある質問など折りたたみ | Accordion + AccordionItem             | 独自のディスクロージャ   |
| 要素の縦横の間隔           | Stack                                 | 個別の margin            |
| 画面に重ねて入力・確認させる | Dialog（`title` 必須）               | 独自のモーダル           |
| 取り消せない操作の前に確かめる | AlertDialog（`title`・`confirmLabel` 必須） | Dialog、`window.confirm` |
| 読み込み・保存の最中       | Spinner（ボタンの中は Button の `loading`） | 文言の無い回転アイコン |
| 中身の形が分かる読み込み   | Skeleton ＋ 領域の `aria-busy`        | 空白のまま待たせる       |
| 幅が限られた 1 行の文字    | Truncate（表の列・一覧の項目名）      | 本文の省略               |
| フォームの送信と検証       | Base UI の Form + FormField           | 独自の検証の仕組み       |
