// CSS の副作用 import（import './x.css'）を型検査で許可する。中身はビルドツールが処理する
declare module '*.css';
