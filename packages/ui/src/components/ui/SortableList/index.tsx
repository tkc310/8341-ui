'use client';

import { type ReactNode, useId, useState } from 'react';
import { Button } from '@/components/ui/Button/index';
import { Icon } from '@/components/ui/Icon/index';
import { focusRing } from '@/lib/focus';
import { tv } from '@/lib/tv';
import { moveItemTo, useSortable } from './useSortable';

export { moveItemTo } from './useSortable';

export const sortableListVariants = tv({
  slots: {
    root: 'flex flex-col gap-stack-sm',
    description: 'm-0 text-body-sm text-fg-subtle',
    list: 'm-0 flex list-none flex-col gap-stack-sm p-0',
    row: [
      'flex min-w-0 flex-col rounded-md border border-border bg-surface',
      'transition-transform duration-(--8341-motion-duration-base) ease-standard',
      'forced-colors:border-[CanvasText]',
    ],
    line: 'flex min-w-0 items-center gap-gap-sm px-inset-sm py-inset-sm',
    iconButton: [
      focusRing,
      'tap-target inline-flex size-control-sm shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0',
      'hover:bg-key-subtle active:bg-key-subtle-hover',
    ],
    handle: 'cursor-grab touch-none text-icon active:cursor-grabbing',
    toggle: 'text-icon-key',
    // 桁数が変わっても項目名の位置を揃える
    number: 'min-w-[2ch] shrink-0 text-end text-body-md font-bold text-fg-subtle tabular-nums',
    content: 'min-w-0 flex-1 text-body-md break-words text-fg',
    actions: 'flex flex-wrap justify-end gap-gap-sm border-t border-border-subtle px-inset-sm py-inset-sm',
  },
  variants: {
    dragging: {
      true: { row: 'relative z-(--8341-z-dropdown) border-border-key shadow-2' },
    },
  },
});

export interface SortableListMessages {
  /** 一覧の上の操作の説明。つまみの説明として読み上げられる */
  description: string;
  /** つまみの名前 */
  handle: (name: string) => string;
  /** 行の操作を開くボタンの名前 */
  actions: (name: string) => string;
  moveUp: string;
  moveDown: string;
  remove: string;
  /** 動かしたあとの読み上げ */
  moved: (name: string, position: number, count: number) => string;
  /** 外したあとの読み上げ */
  removed: (name: string) => string;
}

const MESSAGES: SortableListMessages = {
  description:
    '左のつまみをドラッグするか、つまみにフォーカスして上下の矢印キーで並べ替えます。右のボタンからも動かせます。',
  handle: (name) => `${name}を並べ替える`,
  actions: (name) => `${name}の操作`,
  moveUp: '上へ',
  moveDown: '下へ',
  remove: '外す',
  moved: (name, position, count) => `${name}を${count}件中${position}番目に動かしました`,
  removed: (name) => `${name}を外しました`,
};

export interface SortableListProps<T> {
  /** 一覧の名前（必須）。順番つきリストの名前として読み上げられる */
  label: string;
  items: readonly T[];
  /** 項目を見分けるキー。並べ替えても変わらない値 */
  getKey: (item: T) => string;
  /** 項目の名前。つまみや操作のボタンの名前になる */
  getLabel: (item: T) => string;
  /** 並べ替えた・外したあとの並び */
  onChange: (next: T[]) => void;
  /** 行の中身。既定は getLabel の文字 */
  renderItem?: (item: T, index: number) => ReactNode;
  /** 渡すと、行の操作に「外す」が出る（onChange にも外したあとの並びが渡る） */
  onRemove?: (item: T) => void;
  /** 行の先頭に順番の数字を出す */
  numbered?: boolean;
  /** 文言の上書き（既定は日本語） */
  messages?: Partial<SortableListMessages>;
  className?: string;
}

/**
 * ドラッグとキーボードで並べ替えられる順番つきリスト。
 * 行の左のつまみをポインタでドラッグするか、つまみにフォーカスして上下の矢印キーで動かす。
 * ドラッグできない人のために、右の開閉ボタンから「上へ」「下へ」（と「外す」）も出す（WCAG 2.5.7）。
 */
export function SortableList<T>({
  label,
  items,
  getKey,
  getLabel,
  onChange,
  renderItem,
  onRemove,
  numbered = true,
  messages,
  className,
}: SortableListProps<T>) {
  const m = { ...MESSAGES, ...messages };
  const id = useId();
  const keys = items.map(getKey);
  const [announcement, setAnnouncement] = useState('');
  const { dragging, handleProps, rowRef, move, focusAfterChange } = useSortable({
    keys,
    onMove: (from, to) => {
      const item = items[from];
      onChange(moveItemTo(items, from, to));
      if (item !== undefined) setAnnouncement(m.moved(getLabel(item), to + 1, items.length));
    },
  });
  const remove = (index: number) => {
    const item = items[index];
    if (item === undefined) return;
    // 外した行の操作は消えるので、フォーカスを隣の行のつまみへ移す
    focusAfterChange(keys[index + 1] ?? keys[index - 1]);
    onChange(items.filter((_, i) => i !== index));
    onRemove?.(item);
    setAnnouncement(m.removed(getLabel(item)));
  };
  const s = sortableListVariants();
  const descriptionId = `${id}-description`;
  return (
    <div className={s.root({ className })}>
      <p id={descriptionId} className={s.description()}>
        {m.description}
      </p>
      <ol aria-label={label} className={s.list()}>
        {items.map((item, index) => {
          const key = keys[index] ?? String(index);
          return (
            <SortableRow
              key={key}
              panelId={`${id}-actions-${index}`}
              name={getLabel(item)}
              index={index}
              count={items.length}
              numbered={numbered}
              dragging={dragging === key}
              rowRef={rowRef(key)}
              handle={handleProps(key)}
              describedBy={descriptionId}
              messages={m}
              onMove={(delta) => move(index, index + delta)}
              onRemove={onRemove ? () => remove(index) : undefined}
            >
              {renderItem ? renderItem(item, index) : getLabel(item)}
            </SortableRow>
          );
        })}
      </ol>
      <div role="status" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}

interface RowProps {
  panelId: string;
  name: string;
  index: number;
  count: number;
  numbered: boolean;
  dragging: boolean;
  rowRef: (element: HTMLLIElement | null) => void;
  handle: ReturnType<ReturnType<typeof useSortable>['handleProps']>;
  describedBy: string;
  messages: SortableListMessages;
  onMove: (delta: -1 | 1) => void;
  onRemove: (() => void) | undefined;
  children: ReactNode;
}

function SortableRow({
  panelId,
  name,
  index,
  count,
  numbered,
  dragging,
  rowRef,
  handle,
  describedBy,
  messages: m,
  onMove,
  onRemove,
  children,
}: RowProps) {
  const [open, setOpen] = useState(false);
  const s = sortableListVariants({ dragging });
  return (
    <li ref={rowRef} className={s.row()}>
      <div className={s.line()}>
        <button
          type="button"
          aria-label={m.handle(name)}
          aria-describedby={describedBy}
          className={s.iconButton({ className: s.handle() })}
          {...handle}
        >
          <GripIcon />
        </button>
        {numbered && (
          <span className={s.number()} aria-hidden="true">
            {index + 1}
          </span>
        )}
        <div className={s.content()}>{children}</div>
        <button
          type="button"
          aria-label={m.actions(name)}
          aria-expanded={open}
          aria-controls={panelId}
          className={s.iconButton({ className: s.toggle() })}
          onClick={() => setOpen(!open)}
        >
          <Icon name="chevron-down" className={open ? 'rotate-180' : undefined} />
        </button>
      </div>
      <div id={panelId} hidden={!open} className={s.actions()}>
        <Button
          size="sm"
          variant="secondary"
          aria-label={`${name}を${m.moveUp}`}
          disabled={index === 0}
          onClick={() => onMove(-1)}
        >
          {m.moveUp}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          aria-label={`${name}を${m.moveDown}`}
          disabled={index === count - 1}
          onClick={() => onMove(1)}
        >
          {m.moveDown}
        </Button>
        {onRemove && (
          <Button size="sm" variant="tertiary" aria-label={`${name}を${m.remove}`} onClick={onRemove}>
            {m.remove}
          </Button>
        )}
      </div>
    </li>
  );
}

/** 縦に 2 列 3 段の点。つかんで動かせることを示す */
function GripIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-icon-md fill-current">
      {[9, 15].flatMap((x) => [6, 12, 18].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.6} />))}
    </svg>
  );
}
