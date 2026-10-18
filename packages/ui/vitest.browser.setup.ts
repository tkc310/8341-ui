/* VRT（ブラウザモード）でだけ CSS を読み込む */
import './src/styles/test.css';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vite-plus/test';

afterEach(() => cleanup());
