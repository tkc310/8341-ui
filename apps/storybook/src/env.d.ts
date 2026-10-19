// CSS の副作用 import（import './x.css'）を型検査で許可する。中身はビルドツールが処理する
declare module '*.css';

// 画像の import（import src from './x.svg'）は URL の文字列になる
declare module '*.svg' {
  const src: string;
  export default src;
}
