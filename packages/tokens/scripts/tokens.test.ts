import { describe, expect, it } from 'vite-plus/test';
import { checkThemeKeys, runContrast } from './check-contrast.ts';
import { contrastRatio, gamutMapOklch } from './lib/color.ts';
import { tailwindName } from './lib/tailwind.ts';
import { THEMES, resolvedTokens } from './lib/tokens.ts';

describe('color', () => {
  it('WCAG のコントラスト比を計算する', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#767676', '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('色域外の OKLCH は彩度を下げて sRGB に収める', () => {
    const { components, hex } = gamutMapOklch(0.6, 0.4, 265);
    expect(components[1]).toBeLessThan(0.4);
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('tokens', () => {
  it('Resolver の theme modifier に light と dark がある', () => {
    expect(THEMES).toEqual(['light', 'dark']);
  });

  it('テーマ間で semantic のキーが一致する', () => {
    expect(checkThemeKeys()).toEqual([]);
  });

  it('すべての参照が解決できる', () => {
    for (const theme of THEMES) expect(() => resolvedTokens(theme)).not.toThrow();
  });

  it('コントラスト規則をすべて満たす', () => {
    const failed = runContrast().filter((r) => !r.pass);
    expect(failed).toEqual([]);
  });

  it('色はすべて DTCG 2025.10 の色オブジェクトで hex の代替値を持つ', () => {
    for (const t of resolvedTokens('light').filter((x) => x.type === 'color')) {
      expect(t.resolved).toMatchObject({
        colorSpace: expect.any(String),
        components: expect.any(Array),
        hex: expect.stringMatching(/^#[0-9a-f]{6}$/),
      });
    }
  });
});

describe('tailwind', () => {
  it('semantic トークンを Tailwind の名前空間に対応づける', () => {
    expect(tailwindName(['color', 'text', 'default'])).toBe('--color-fg');
    expect(tailwindName(['color', 'bg', 'key-hover'])).toBe('--color-key-hover');
    expect(tailwindName(['color', 'primitive', 'indigo', '700'])).toBeNull();
    expect(tailwindName(['text', 'body-md', 'line-height'])).toBe('--text-body-md--line-height');
    expect(tailwindName(['size', 'content-max'])).toBe('--container-content');
  });

  it('Tailwind の変数名が重複しない', () => {
    const names = resolvedTokens('light')
      .map((t) => tailwindName(t.path))
      .filter(Boolean);
    expect(new Set(names).size).toBe(names.length);
  });
});
