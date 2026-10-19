# ロゴとバナー

## ロゴ「藍日」

日の丸を藍（`blue.700` `#385db8`）で描き、このシステムのフォーカス表示と同じ二重のリング（内側 `yellow.300` `#e7c567`、外側 `gray.1200` `#1a1b1d`）で囲んだ形です。「日本語の UI」と「誰でもキーボードで操作できる（フォーカスが見える）」を表します。

| ファイル | 用途 |
| --- | --- |
| `logo-light.svg` / `logo-dark.svg` | 明るい背景 / 暗い背景用（ダークは円 `blue.300` `#a8c4fe`、外側 `gray.50` `#f6f7f7`） |
| `logo.svg` | OS のライト / ダークに SVG 内で追従する版 |
| `../../apps/storybook/public/favicon.svg` | Storybook のファビコン（`logo.svg` と同じ） |
| `../../apps/storybook/public/logo.svg` | Storybook のサイドバー（マーク＋文字。`.storybook/manager.ts` で指定） |
| `logo-1024.png` | ロゴの PNG（1024px・背景なし）。SVG を使えない場所に |
| `icon-1024.png` | アイコンの PNG（1024px・白地にロゴを 72% で配置）。アバター・アプリアイコン・SNS などの正方形の枠に |
| `../../apps/storybook/public/favicon.ico` | SVG のファビコンを使えないブラウザ向け（16 / 32 / 48px） |
| `../../apps/storybook/public/apple-touch-icon.png`・`icon-192.png`・`icon-512.png` | ホーム画面に追加したときのアイコン（白地。`manifest.webmanifest`・`.storybook/manager-head.html` で指定） |
| `banner-light.svg` / `banner-dark.svg` | README と Storybook「はじめに」の冒頭。右側はロゴの輪を拡大して薄く敷いた飾り |

## 画像の作り方

PNG と ICO は `logo-light.svg` から書き出す（ブラウザで SVG を描画して PNG に、16 / 32 / 48px の PNG をまとめて ICO に）。白地のアイコンは 512 の正方形の中央にロゴを 72% で置いたもの。ロゴを変えたら、これらも書き出し直す。

## 使い方

- 色はトークンの値だけを使う。縦横比を変えない、リングを省かない、影や輪郭線を足さない
- 周りに円の半径の 1/4 以上の余白をとる。16px でも判別できるが、それより小さくしない
- 色を変えるときはリング（フォーカスの色）と円（プライマリ）の対応を保ち、背景とのコントラストを 3:1 以上にする

## デザインシステムファクトリーで作ったシステムでは

ロゴは 8341-ui 固有です。新しいシステムのロゴに差し替えるか、ファイル（PNG・ICO・`manifest.webmanifest` を含む）と `manager.ts` の `brandImage`、`manager-head.html` のリンクを削除してください（`ds-factory` スキルの手順 3）。
