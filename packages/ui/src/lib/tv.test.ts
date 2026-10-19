import { describe, expect, it } from 'vite-plus/test';
import { cn } from './tv';

describe('cn（クラス統合）', () => {
  it('文字色と文字サイズのトークンを別のものとして残す', () => {
    expect(cn('text-fg', 'text-body-md')).toBe('text-fg text-body-md');
    expect(cn('text-body-sm', 'text-body-md')).toBe('text-body-md');
    expect(cn('p-inset-md', 'p-inset-lg')).toBe('p-inset-lg');
  });
});
