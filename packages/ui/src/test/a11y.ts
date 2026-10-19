import axe from 'axe-core';
import { expect } from 'vite-plus/test';

/** happy-dom ではレイアウトと色を計算できないため、構造（ARIA・ラベル）の規則だけを検査する */
export async function expectNoA11yViolations(container: HTMLElement) {
  const result = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}
