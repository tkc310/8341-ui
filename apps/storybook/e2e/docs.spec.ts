import { expect, test } from '@playwright/test';

interface IndexEntry {
  id: string;
  type: string;
  importPath: string;
}

test.describe('ドキュメント（MDX）', () => {
  test('「はじめに」の表が表として描画される（GFM が有効）', async ({ page, request }) => {
    const index = (await (await request.get('/index.json')).json()) as { entries: Record<string, IndexEntry> };
    const entry = Object.values(index.entries).find((e) => e.importPath.endsWith('Introduction.mdx'));
    expect(entry).toBeDefined();
    await page.goto(`/iframe.html?id=${entry?.id}&viewMode=docs`);
    await expect(page.getByRole('table').first()).toBeVisible();
    // 表として解釈されないと、区切り行がそのまま文字として出る
    await expect(page.getByText('| --- |')).toHaveCount(0);
  });
});
