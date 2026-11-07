import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { expectNoA11yViolations } from '@/test/a11y';
import { SortableList } from './index';

type Step = { id: string; name: string };
const STEPS: Step[] = [
  { id: 'a', name: '下書き' },
  { id: 'b', name: 'レビュー' },
  { id: 'c', name: '承認' },
];

function Harness({ onRemove }: { onRemove?: (step: Step) => void }) {
  const [items, setItems] = useState(STEPS);
  return (
    <SortableList
      label="手順"
      items={items}
      getKey={(step) => step.id}
      getLabel={(step) => step.name}
      onChange={setItems}
      onRemove={onRemove}
    />
  );
}

const names = () =>
  within(screen.getByRole('list', { name: '手順' }))
    .getAllByRole('listitem')
    .map((row) => within(row).getAllByRole('button')[0]?.getAttribute('aria-label'));

describe('SortableList', () => {
  it('順番つきリストに名前が付き、つまみに名前と操作の説明が付く', async () => {
    const { container } = render(<Harness />);
    expect(screen.getByRole('list', { name: '手順' }).tagName).toBe('OL');
    const handle = screen.getByRole('button', { name: '下書きを並べ替える' });
    expect(handle).toHaveAccessibleDescription(/上下の矢印キー/);
    await expectNoA11yViolations(container);
  });

  it('つまみで上下の矢印キーを押すと動き、フォーカスはつまみに残り、動いた位置を読み上げる', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const handle = screen.getByRole('button', { name: '下書きを並べ替える' });
    handle.focus();
    await user.keyboard('{ArrowDown}');
    expect(names()).toEqual(['レビューを並べ替える', '下書きを並べ替える', '承認を並べ替える']);
    expect(screen.getByRole('button', { name: '下書きを並べ替える' })).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('下書きを3件中2番目に動かしました');
    // 端を越える動きは何もしない
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(names()[0]).toBe('下書きを並べ替える');
  });

  it('開閉ボタンで行の操作を出し、上へ・下へで動かせる（ドラッグできない人の代わりの操作）', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const toggle = screen.getByRole('button', { name: '承認の操作' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: '承認を上へ' })).toBeNull();
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: '承認を下へ' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: '承認を上へ' }));
    expect(names()).toEqual(['下書きを並べ替える', '承認を並べ替える', 'レビューを並べ替える']);
  });

  it('onRemove を渡すと外せ、フォーカスは隣の行のつまみへ移る', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Harness onRemove={onRemove} />);
    await user.click(screen.getByRole('button', { name: 'レビューの操作' }));
    await user.click(screen.getByRole('button', { name: 'レビューを外す' }));
    expect(onRemove).toHaveBeenCalledWith(STEPS[1]);
    expect(names()).toEqual(['下書きを並べ替える', '承認を並べ替える']);
    await waitFor(() => expect(screen.getByRole('button', { name: '承認を並べ替える' })).toHaveFocus());
    expect(screen.getByRole('status')).toHaveTextContent('レビューを外しました');
  });

  it('onRemove が無ければ外すボタンを出さない', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: '下書きの操作' }));
    expect(screen.queryByRole('button', { name: '下書きを外す' })).toBeNull();
  });

  it('つまみをドラッグして離した位置へ一度に動かす', () => {
    render(<Harness />);
    const rows = within(screen.getByRole('list', { name: '手順' })).getAllByRole('listitem');
    // happy-dom は配置を計算しないので、行の位置を与える（高さ 40、間 8）
    rows.forEach((row, i) => {
      row.getBoundingClientRect = () => ({ top: i * 48, height: 40 }) as DOMRect;
    });
    const handle = screen.getByRole('button', { name: '承認を並べ替える' });
    fireEvent.pointerDown(handle, { button: 0, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientY: 20, pointerId: 1 });
    // ドラッグ中は並びを変えず、行を指に付けて動かす
    expect(names()[2]).toBe('承認を並べ替える');
    expect(rows[2]?.style.transform).toBe('translateY(-80px)');
    fireEvent.pointerUp(handle, { clientY: 0, pointerId: 1 });
    expect(names()).toEqual(['承認を並べ替える', '下書きを並べ替える', 'レビューを並べ替える']);
  });

  it('文言を上書きできる', () => {
    render(
      <SortableList
        label="Steps"
        items={STEPS}
        getKey={(step) => step.id}
        getLabel={(step) => step.name}
        onChange={() => {}}
        messages={{ handle: (name) => `Reorder ${name}`, actions: (name) => `Actions for ${name}` }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Reorder 承認' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actions for 承認' })).toBeInTheDocument();
  });
});
