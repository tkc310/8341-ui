/**
 * DTCG 形式（$value / $type / $description）のトークンを読み込み、参照を解決する。
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const ROOT = resolve(import.meta.dirname, '../..');
export const PREFIX = 'tkc';

export type Theme = 'light' | 'dark';
type Json = Record<string, unknown>;

export interface FlatToken {
  path: string[];
  name: string; // dot path
  type: string;
  value: unknown; // 生の値（参照を含みうる）
  description?: string;
  layer: 'primitive' | 'semantic';
  themed: boolean; // テーマごとに値が変わるか
}

const read = (p: string): Json =>
  JSON.parse(readFileSync(resolve(ROOT, p), 'utf8')) as Json;

export const SOURCES = {
  primitive: [
    'tokens/primitive/color.json',
    'tokens/primitive/typography.json',
    'tokens/primitive/dimension.json',
  ],
  base: 'tokens/semantic/base.json',
  themes: {
    light: 'tokens/semantic/color.light.json',
    dark: 'tokens/semantic/color.dark.json',
  } satisfies Record<Theme, string>,
};

function flatten(
  node: Json,
  layer: FlatToken['layer'],
  themed: boolean,
  path: string[] = [],
  inheritedType?: string,
  out: FlatToken[] = [],
): FlatToken[] {
  const type = (node.$type as string | undefined) ?? inheritedType;
  if ('$value' in node) {
    out.push({
      path,
      name: path.join('.'),
      type: type ?? 'unknown',
      value: node.$value,
      description: node.$description as string | undefined,
      layer,
      themed,
    });
    return out;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$') || typeof v !== 'object' || v === null) continue;
    flatten(v as Json, layer, themed, [...path, k], type, out);
  }
  return out;
}

export function loadTokens() {
  const primitive = SOURCES.primitive.flatMap((f) =>
    flatten(read(f), 'primitive', false),
  );
  const base = flatten(read(SOURCES.base), 'semantic', false);
  const themes = Object.fromEntries(
    (Object.keys(SOURCES.themes) as Theme[]).map((t) => [
      t,
      flatten(read(SOURCES.themes[t]), 'semantic', true),
    ]),
  ) as Record<Theme, FlatToken[]>;
  return { primitive, base, themes };
}

const REF = /^\{([^}]+)\}$/;

export function isRef(v: unknown): v is string {
  return typeof v === 'string' && REF.test(v);
}

export function refName(v: string): string {
  return (v.match(REF) as RegExpMatchArray)[1];
}

/** 参照を最終値まで解決する（循環・未定義はエラー） */
export function createResolver(all: FlatToken[]) {
  const map = new Map(all.map((t) => [t.name, t]));
  const resolveValue = (v: unknown, seen: string[] = []): unknown => {
    if (isRef(v)) {
      const name = refName(v);
      if (seen.includes(name))
        throw new Error(`循環参照: ${[...seen, name].join(' → ')}`);
      const t = map.get(name);
      if (!t) throw new Error(`未定義のトークンを参照しています: {${name}}`);
      return resolveValue(t.value, [...seen, name]);
    }
    if (Array.isArray(v)) return v.map((x) => resolveValue(x, seen));
    if (v && typeof v === 'object')
      return Object.fromEntries(
        Object.entries(v).map(([k, x]) => [k, resolveValue(x, seen)]),
      );
    return v;
  };
  return { map, resolveValue };
}

export const cssVarName = (name: string) =>
  `--${PREFIX}-${name.replace(/\./g, '-')}`;
