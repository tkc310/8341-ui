'use client';

import { type KeyboardEvent, type PointerEvent, useLayoutEffect, useRef, useState } from 'react';

/** 行の縦の位置と高さ。ドラッグを始めたときに測る */
export interface Slot {
  top: number;
  height: number;
}

/** 並びの中の 1 つを、離れた位置へ一度に動かす。範囲の外を指したら元の並びを返す */
export function moveItemTo<T>(items: readonly T[], from: number, to: number): T[] {
  if (from < 0 || from >= items.length || to < 0 || to >= items.length) return [...items];
  const next = [...items];
  const [moved] = next.splice(from, 1);
  if (moved !== undefined) next.splice(to, 0, moved);
  return next;
}

/** 動かしている行の中央が、ほかの行の中央をいくつ越えたかで、入る位置を決める */
export function dropIndex(slots: readonly Slot[], from: number, dy: number): number {
  const dragged = slots[from];
  if (dragged === undefined) return from;
  const center = dragged.top + dragged.height / 2 + dy;
  return slots.filter((slot, index) => index !== from && slot.top + slot.height / 2 < center).length;
}

/** 入る位置を空けるために、ほかの行を縦にずらす量。動かしている行の高さと行の間の分だけ詰める */
export function shiftOf(slots: readonly Slot[], from: number, to: number, index: number): number {
  const dragged = slots[from];
  const [first, second] = slots;
  if (dragged === undefined || index === from) return 0;
  const gap = first !== undefined && second !== undefined ? second.top - (first.top + first.height) : 0;
  const step = dragged.height + gap;
  if (from < index && index <= to) return -step;
  if (to <= index && index < from) return step;
  return 0;
}

// 位置は style 属性ではなく CSSOM で動かす。CSP の style-src はインラインの style 属性を止めるが、スクリプトからの変更は止めない
const translate = (element: HTMLElement | undefined, y: number) => {
  if (element !== undefined) element.style.transform = y === 0 ? '' : `translateY(${y}px)`;
};

type Drag = { key: string; from: number; startY: number; slots: Slot[] };

export interface HandleProps {
  ref: (element: HTMLButtonElement | null) => void;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * つまみのドラッグと上下の矢印キーでの並べ替え。
 * - ドラッグ中は行を指に付けて動かし、ほかの行は入る位置を空けるようにずらす。並びは離したときに一度で決める
 * - 並びが変わったら、前の見た目の位置から新しい位置へ動かす（FLIP）。動きを減らす設定ではテーマの規則で止まる
 * - 矢印キーで動かしたあとも、フォーカスは動かした行のつまみに残す
 */
export function useSortable({ keys, onMove }: { keys: readonly string[]; onMove: (from: number, to: number) => void }) {
  const rows = useRef(new Map<string, HTMLElement>());
  const handles = useRef(new Map<string, HTMLButtonElement>());
  const before = useRef<Map<string, number> | undefined>(undefined);
  const refocus = useRef<string | undefined>(undefined);
  const drag = useRef<Drag | undefined>(undefined);
  const [dragging, setDragging] = useState<string | undefined>(undefined);

  const measure = (): Slot[] =>
    keys.map((key) => {
      const rect = rows.current.get(key)?.getBoundingClientRect();
      return { top: rect?.top ?? 0, height: rect?.height ?? 0 };
    });

  useLayoutEffect(() => {
    const tops = before.current;
    before.current = undefined;
    if (tops !== undefined) {
      for (const [key, element] of rows.current) {
        const top = tops.get(key);
        element.style.transition = 'none';
        translate(element, top === undefined ? 0 : top - element.getBoundingClientRect().top);
        // 前の位置を一度描かせてから、遷移を戻して新しい位置へ動かす
        void element.offsetHeight;
        element.style.transition = '';
        translate(element, 0);
      }
    }
    // 行の DOM が並べ替わるとフォーカスが外れることがあるので、動かした行のつまみへ戻す
    if (refocus.current !== undefined) handles.current.get(refocus.current)?.focus();
    refocus.current = undefined;
  }, [keys]);

  /** 並びを変える。FLIP のために、変える前の位置を覚えておく */
  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= keys.length) return;
    const slots = measure();
    before.current = new Map(keys.map((key, index) => [key, slots[index]?.top ?? 0]));
    onMove(from, to);
  };

  const follow = (current: Drag, clientY: number) => {
    const dy = clientY - current.startY;
    const to = dropIndex(current.slots, current.from, dy);
    keys.forEach((key, index) => {
      translate(rows.current.get(key), key === current.key ? dy : shiftOf(current.slots, current.from, to, index));
    });
    return to;
  };

  const release = () => {
    for (const element of rows.current.values()) {
      element.style.transition = '';
      translate(element, 0);
    }
    drag.current = undefined;
    setDragging(undefined);
  };

  const handleProps = (key: string): HandleProps => ({
    ref: (element) => {
      if (element === null) handles.current.delete(key);
      else handles.current.set(key, element);
    },
    onPointerDown: (event) => {
      if (event.button !== 0) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      drag.current = { key, from: keys.indexOf(key), startY: event.clientY, slots: measure() };
      const element = rows.current.get(key);
      // 動かしている行だけは遅れずに指に付ける
      if (element !== undefined) element.style.transition = 'none';
      setDragging(key);
    },
    onPointerMove: (event) => {
      if (drag.current?.key === key) follow(drag.current, event.clientY);
    },
    onPointerUp: (event) => {
      const current = drag.current;
      if (current?.key !== key) return;
      const to = follow(current, event.clientY);
      release();
      move(current.from, to);
    },
    onPointerCancel: release,
    onKeyDown: (event) => {
      const delta = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0;
      if (delta === 0) return;
      event.preventDefault();
      const from = keys.indexOf(key);
      refocus.current = key;
      move(from, from + delta);
    },
  });

  const rowRef = (key: string) => (element: HTMLElement | null) => {
    if (element === null) rows.current.delete(key);
    else rows.current.set(key, element);
  };

  /** 次に並びが変わったあと、この行のつまみへフォーカスを移す（外した行の隣へ移すときなど） */
  const focusAfterChange = (key: string | undefined) => {
    refocus.current = key;
  };

  return { dragging, handleProps, rowRef, move, focusAfterChange };
}
