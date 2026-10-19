# 0015 依存と道具を最新に更新する（2026-10）

- 日付: 2026-10-19
- 状態: 採用

## 背景
初版から依存と道具の版を見直していなかった。TypeScript は 5.9、pnpm は 11、Node.js は 22 のままで、Testing Library・happy-dom・@vitejs/plugin-react・Figma Code Connect・GitHub Actions にもメジャー更新が出ていた。

## 決定
- 道具（`.tool-versions`）: Node.js 24.22.0（2026-10 時点の最新 LTS）、pnpm 12.14.0、GitHub CLI 2.102.0
- 依存（catalog）: TypeScript 7.0.2、@vitejs/plugin-react 6、happy-dom 21、@testing-library/jest-dom 7、@figma/code-connect 2、Storybook 10.6.2、Playwright 1.64 などを最新にする
- GitHub Actions: actions/checkout v7、actions/setup-node v7、pnpm/action-setup v6
- tsx は外す。スクリプトは Node.js の型除去（`node scripts/*.ts`）で動かす
- 更新の方針
  - Node.js は LTS の最新を使う（Current 版は LTS に入ってから）。`@types/node` は Node.js のメジャー版に合わせる（今は 24）
  - 公開から 1 日経っていない版は入れない（`minimumReleaseAge`）。catalog の下限をそれより新しい版にしない
  - 更新したら CI の `check`・`test`・パッケージのビルド・Storybook のビルドがすべて通ることを確かめる

## 理由
- TypeScript 7 は型検査が速く、Vite+ の型検査（oxlint-tsgolint）も 7 系で動いている。型定義の生成（tsdown / rolldown-plugin-dts）は 7.0 に対応し、dependency-cruiser と Storybook のビルドも 7.0 で通った
- Storybook の props 表の生成は既定の react-docgen（TypeScript を使わない方式）なので、7.0 を対象外にしている react-docgen-typescript の影響を受けない

## 影響・トレードオフ
- TypeScript 7.0 には安定した JavaScript API がまだなく、tsdown は「実験的」と警告する。型定義の出力は `check-dist` と CI のビルドで確かめる。問題が出たら 6.0 系（6.0.3）に戻すか、7.1 を待つ
- Storybook で react-docgen-typescript に切り替える場合は、TypeScript 7.1 以上が要る
- Node.js 26 が LTS に入ったら（2026-10 末の予定）、26 への更新を検討する
