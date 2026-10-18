import { expect, test } from '@playwright/test';

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test.describe('フォーム', () => {
  test('キーボードだけで入力し、送信時のエラーから最初の誤りへ移れる', async ({ page }) => {
    await page.goto(story('components-form--validation-pattern'));
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox', { name: /氏名/ })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: '送信する' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('textbox', { name: /氏名/ })).toBeFocused();
    await page.keyboard.type('山田 太郎');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toContainText('送信しました');
  });

  test('Select は矢印キーで選べる', async ({ page }) => {
    await page.goto(story('components-form--select-box'));
    const trigger = page.getByRole('combobox', { name: /都道府県/ });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(trigger).not.toContainText('選択してください');
  });
});

test.describe('レイアウト', () => {
  test('幅 320px で横スクロールが出ない（WCAG 1.4.10）', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(story('components-form--text-field-states'));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });

  test('文字サイズ 200% でも内容が切れない（WCAG 1.4.4）', async ({ page }) => {
    await page.goto(story('components-notificationbanner--tones'));
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll('h2, p, li')].some((el) => el.scrollWidth > (el as HTMLElement).clientWidth + 1),
    );
    expect(clipped).toBe(false);
  });
});
