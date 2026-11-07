import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { SortableList } from './index';

type Step = { id: string; name: string; owner: string };
const STEPS: Step[] = [
  { id: 'draft', name: '下書きを作る', owner: '担当者' },
  { id: 'review', name: '内容をレビューする', owner: 'チームリーダー' },
  { id: 'legal', name: '法務の確認を受ける（契約書・利用規約・個人情報の取り扱いを含む）', owner: '法務部' },
  { id: 'approve', name: '承認する', owner: '部長' },
  { id: 'publish', name: '公開する', owner: '担当者' },
];

function Example({ removable = true, detailed = false }: { removable?: boolean; detailed?: boolean }) {
  const [items, setItems] = useState(STEPS);
  return (
    <SortableList
      label="承認の手順"
      items={items}
      getKey={(step) => step.id}
      getLabel={(step) => step.name}
      onChange={setItems}
      onRemove={removable ? () => {} : undefined}
      renderItem={
        detailed
          ? (step) => (
              <span className="flex flex-col">
                <span>{step.name}</span>
                <span className="text-body-sm text-fg-subtle">{step.owner}</span>
              </span>
            )
          : undefined
      }
    />
  );
}

const meta = {
  title: 'Components/SortableList',
  component: SortableList,
  parameters: {
    docs: {
      description: {
        component:
          'ドラッグとキーボードで並べ替えられる順番つきリスト。左のつまみをドラッグする（行は指に付いて動き、ほかの行は入る位置を空ける）か、つまみにフォーカスして上下の矢印キーで動かす。ドラッグできない人のために、右の開閉ボタンから「上へ」「下へ」「外す」も出す（WCAG 2.5.7）。並びが変わると行は前の位置から新しい位置へ動き（動きを減らす設定では止まる）、動かした位置を読み上げる。',
      },
    },
  },
  args: {
    label: '承認の手順',
    items: STEPS,
    getKey: (s: Step) => s.id,
    getLabel: (s: Step) => s.name,
    onChange: () => {},
  },
  render: () => <Example />,
} satisfies Meta<typeof SortableList<Step>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = canvas.getByRole('button', { name: '下書きを作るを並べ替える' });
    handle.focus();
    await userEvent.keyboard('{ArrowDown}');
    const rows = within(canvas.getByRole('list', { name: '承認の手順' })).getAllByRole('listitem');
    await expect(rows[1]).toHaveTextContent('下書きを作る');
    await expect(canvas.getByRole('button', { name: '下書きを作るを並べ替える' })).toHaveFocus();
    // 開閉ボタンから上へ戻す
    await userEvent.click(canvas.getByRole('button', { name: '下書きを作るの操作' }));
    await userEvent.click(canvas.getByRole('button', { name: '下書きを作るを上へ' }));
    await expect(
      within(canvas.getByRole('list', { name: '承認の手順' })).getAllByRole('listitem')[0],
    ).toHaveTextContent('下書きを作る');
  },
};

/** renderItem で行の中身を組み立てる。外す操作が要らなければ onRemove を渡さない */
export const CustomContent: Story = {
  render: () => <Example removable={false} detailed />,
};
