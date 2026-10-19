# コンポーネント構造規則

React コンポーネントのファイル名とディレクトリ構造。コンポーネントを作る・変えるときはこの規則に従う。
[yorozuya の規則](https://github.com/tkc310/yorozuya/blob/main/src/components/COMPONENT_STRUCTURE.md)を、デザインシステム（部品の配布）向けに取り込んだもの。`make check`（`scripts/check-structure.ts` と dependency-cruiser）で検査する。

## ファイル名規則

コンポーネントのディレクトリ名は **先頭大文字のパスカルケース（PascalCase）**。

- ✅ `src/components/ui/Button/`、`src/components/ui/FormField/`
- ❌ `src/components/ui/button/`（小文字）、`src/components/ui/form-field/`（ケバブケース）

例外: レジストリの名前は URL に使うためケバブケース（`npx shadcn add @8341/form-field`）。ディレクトリ名から自動で作る（`scripts/generate-registry.ts`）。

## 置き場所

| ディレクトリ | 置くもの |
| --- | --- |
| `src/components/ui/` | どの画面でも使う共通部品。このパッケージのコンポーネントはすべてここ |
| `src/components/`（直下） | コンポーネントを横断するテスト（`*.vrt.test.tsx`）とこの文書だけ |
| `src/lib/` | `tv` / `cn` / フォーカス表示など、コンポーネントが共有する処理 |
| `src/test/` | テスト用の道具（`@/test/*`）。本体からは import しない |

アプリ側の規則にある `layouts/`（全画面に共通する枠）と `features/`（1 ページ分の機能）は、このパッケージには置かない。8341-ui を使うプロダクトが自分のリポジトリに置く。

`ui/` に置くのは、shadcn で配布したときに利用側の `components/ui/` の下へ同じ形で入るため（`src/components/ui/Button/index.tsx` → 利用側の `components/ui/Button/index.tsx`）。

## ディレクトリ構造（コロケーション）

関連するファイルは同じディレクトリに置く。**ディレクトリ階層からコンポーネントのスコープが判断できる** ようにする。

### 基本構成

```
Button/
├── index.tsx           # コンポーネント本体（公開 API）
├── index.test.tsx      # 単体テスト（happy-dom）
├── index.stories.tsx   # Storybook（状態ごとのストーリーと play 関数）
├── index.figma.ts      # Figma Code Connect（Figma のコンポーネントがある場合）
└── useHookName.ts      # カスタムフック（必要に応じて）
```

置いてよいファイルはこの 5 種類（とフックのテスト `useXxx.test.ts`）だけ。

### 親子関係の表現

そのコンポーネント専用の子コンポーネントは、ディレクトリを入れ子にする。

```
Card/
├── index.tsx           # 親コンポーネント
├── index.stories.tsx
└── CardMedia/          # Card 専用の子コンポーネント
    ├── index.tsx
    └── index.stories.tsx
```

- 子は親の配下からだけ使う。ほかのコンポーネントが使うようになったら、`src/components/ui/` の直下に引き上げて独立したコンポーネントにする
- 親と一緒に使う小さな部品（`AccordionItem`、`Radio` など）は、子のディレクトリに分けず親の `index.tsx` から export してよい（利用側は 1 つの import で揃う）

## Import 規則

| 参照先 | 書き方 | 例 |
| --- | --- | --- |
| 同じコンポーネントのディレクトリの中（子・フック） | 相対パス | `import { useCount } from './useCount';`、`import { CardMedia } from './CardMedia/index';` |
| ほかのコンポーネント | `@/components/ui/<Name>/index` | `import { Icon } from '@/components/ui/Icon/index';` |
| 共通処理 | `@/lib/<name>` | `import { tv } from '@/lib/tv';` |
| テスト用の道具 | `@/test/<name>` | `import { expectNoA11yViolations } from '@/test/a11y';` |

- ほかのコンポーネントを相対パス（`../Icon/index`）で import しない。shadcn がこの alias を利用側の設定に書き換え、レジストリの依存（`registryDependencies`）も import から作るため
- 3 階層以上さかのぼる相対パス（`../../../`）は使わない
- ほかのコンポーネントの `index.tsx` 以外（子・フック）を import しない（dependency-cruiser の `components-via-public-api`）

## 公開 API

`index.tsx` に本体を書き、そのまま公開 API にする（再エクスポート用の `index.ts` は作らない）。パッケージ全体のエントリ（`src/index.ts`）から `export *` する。

```ts
// src/components/ui/Button/index.tsx
export function Button(props: ButtonProps) {
  // ...
}

// src/index.ts
export * from './components/ui/Button/index';
```

npm で使うときは、ディレクトリ名でコンポーネントごとに import できる（`import { Button } from '8341-ui/Button'`）。

## チェックリスト

コンポーネントを作る・変えるときに確認する。

- [ ] ディレクトリ名はパスカルケースになっているか
- [ ] コンポーネント本体は `index.tsx` になっているか
- [ ] テストは `index.test.tsx`、ストーリーは `index.stories.tsx`、Code Connect は `index.figma.ts` になっているか
- [ ] カスタムフックは `useXxx.ts` という名前になっているか
- [ ] 関連ファイルが同じディレクトリに置かれているか（子コンポーネントは入れ子）
- [ ] ほかのコンポーネントを `@/components/ui/<Name>/index` で import しているか（相対パス・深い相対パスを使っていないか）
- [ ] `src/index.ts` から export し、`make registry` でレジストリを更新したか

## 参考

- yorozuya のコンポーネント構造規則: https://github.com/tkc310/yorozuya/blob/main/src/components/COMPONENT_STRUCTURE.md
- shadcn のレジストリ（ファイルの置き場所）: https://ui.shadcn.com/docs/registry
- ADR-0016: [コンポーネントのディレクトリ構造](../../../../docs/decisions/0016-component-structure.md)
