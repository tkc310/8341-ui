import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vite-plus/test';

// globals を使わない設定のため、RTL の自動クリーンアップが働かない。テストごとに DOM を片付ける
afterEach(() => cleanup());
