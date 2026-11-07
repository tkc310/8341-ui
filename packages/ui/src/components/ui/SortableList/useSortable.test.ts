import { describe, expect, it } from 'vite-plus/test';
import { dropIndex, moveItemTo, shiftOf, type Slot } from './useSortable';

// 高さ 40、行の間 8 の 4 行
const slots: Slot[] = [0, 48, 96, 144].map((top) => ({ top, height: 40 }));

describe('moveItemTo', () => {
  it('離れた位置へ一度に動かす', () => {
    expect(moveItemTo(['a', 'b', 'c', 'd'], 3, 0)).toEqual(['d', 'a', 'b', 'c']);
    expect(moveItemTo(['a', 'b', 'c', 'd'], 0, 2)).toEqual(['b', 'c', 'a', 'd']);
  });

  it('範囲の外を指したら元の並びを返す', () => {
    expect(moveItemTo(['a', 'b'], 0, 2)).toEqual(['a', 'b']);
    expect(moveItemTo(['a', 'b'], -1, 0)).toEqual(['a', 'b']);
  });
});

describe('dropIndex', () => {
  it('動かしている行の中央が越えた行の数で、入る位置を決める', () => {
    expect(dropIndex(slots, 0, 0)).toBe(0);
    expect(dropIndex(slots, 0, 30)).toBe(0);
    expect(dropIndex(slots, 0, 50)).toBe(1);
    expect(dropIndex(slots, 0, 150)).toBe(3);
    expect(dropIndex(slots, 3, -150)).toBe(0);
  });
});

describe('shiftOf', () => {
  it('入る位置を空けるよう、間の行を 1 行分（高さ＋行の間）ずらす', () => {
    // 0 番目を 2 番目へ: 1・2 番目が上へ詰める
    expect([0, 1, 2, 3].map((i) => shiftOf(slots, 0, 2, i))).toEqual([0, -48, -48, 0]);
    // 3 番目を 1 番目へ: 1・2 番目が下へずれる
    expect([0, 1, 2, 3].map((i) => shiftOf(slots, 3, 1, i))).toEqual([0, 48, 48, 0]);
  });
});
