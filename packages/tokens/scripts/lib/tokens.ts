/**
 * DTCG 2025.10 のトークンを Resolver 文書（src/tkc310-ui.resolver.json）に従って読み込み、
 * テーマ（modifier の context）ごとに参照を解決する。依存ゼロ。
 *
 * CSS / Tailwind への変換は Style Dictionary v5（scripts/build.ts）が行う。
 * Style Dictionary v5 は Resolver モジュールに未対応のため、このモジュールが
 * 「どのファイルをどの順で読むか」を Style Dictionary にも渡す。
 * コントラスト検査・DESIGN.md 同期・Figma 書き出しもこのモジュールの解決結果を使う。
 */
import { readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

export const ROOT = resolve(import.meta.dirname, '../..');
export const SRC = resolve(ROOT, 'src');
export const REPO_ROOT = resolve(ROOT, '../..');
export const PREFIX = 'tkc';
export const RESOLVER = resolve(SRC, 'tkc310-ui.resolver.json');

type Json = Record<string, unknown>;

export interface DtcgColor {
  colorSpace: string;
  components: (number | 'none')[];
  alpha?: number;
  hex?: string;
}
export interface DtcgDimension {
  value: number;
  unit: 'px' | 'rem';
}

export interface FlatToken {
  path: string[];
  /** ドット区切りの名前（例: color.text.default） */
  name: string;
  type: string;
  /** 生の値（参照を含みうる） */
  value: unknown;
  description?: string;
  layer: 'primitive' | 'semantic';
  /** テーマ（modifier）によって値が変わるか */
  themed: boolean;
  /** 定義しているファイル（src からの相対パス） */
  file: string;
}

interface Source {
  $ref: string;
}
interface ResolverDoc {
  sets: Record<string, { sources: Source[] }>;
  modifiers: Record<string, { contexts: Record<string, Source[]>; default?: string }>;
  resolutionOrder: Source[];
}

const readJson = (p: string): Json => JSON.parse(readFileSync(p, 'utf8')) as Json;

export const resolverDoc = readJson(RESOLVER) as unknown as ResolverDoc;

/** modifier `theme` の context 名（light / dark） */
export const THEMES = Object.keys(resolverDoc.modifiers.theme?.contexts ?? {});
export type Theme = string;

function flattenFile(file: string, layer: FlatToken['layer'], themed: boolean): FlatToken[] {
  const out: FlatToken[] = [];
  const walk = (node: Json, path: string[], inheritedType?: string) => {
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
        file: relative(SRC, file),
      });
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$') || typeof v !== 'object' || v === null) continue;
      walk(v as Json, [...path, k], type);
    }
  };
  walk(readJson(file), []);
  return out;
}

/**
 * Resolver の resolutionOrder に従って、ある context（{ theme: 'dark' } など）の source ファイル一覧を返す。
 * 後のファイルほど優先される。
 */
export function sourceFiles(inputs: Record<string, string> = {}): { file: string; kind: 'set' | 'modifier'; name: string }[] {
  const files: { file: string; kind: 'set' | 'modifier'; name: string }[] = [];
  for (const { $ref } of resolverDoc.resolutionOrder) {
    const [, kind, name] = $ref.match(/^#\/(sets|modifiers)\/(.+)$/) ?? [];
    if (!kind || !name) throw new Error(`未対応の $ref: ${$ref}`);
    if (kind === 'sets') {
      for (const s of resolverDoc.sets[name]?.sources ?? []) files.push({ file: resolve(SRC, s.$ref), kind: 'set', name });
    } else {
      const mod = resolverDoc.modifiers[name];
      if (!mod) throw new Error(`未定義の modifier: ${name}`);
      const context = inputs[name] ?? mod.default;
      if (!context || !mod.contexts[context]) throw new Error(`modifier ${name} の context が不正: ${context}`);
      for (const s of mod.contexts[context]) files.push({ file: resolve(SRC, s.$ref), kind: 'modifier', name });
    }
  }
  return files;
}

/** 指定テーマで読み込むトークンの一覧（後勝ちで重複を除いた結果） */
export function loadTokens(theme: Theme = resolverDoc.modifiers.theme?.default ?? 'light'): FlatToken[] {
  const map = new Map<string, FlatToken>();
  for (const { file, kind, name } of sourceFiles({ theme })) {
    const layer = name === 'primitive' ? 'primitive' : 'semantic';
    for (const t of flattenFile(file, layer, kind === 'modifier')) map.set(t.name, t);
  }
  return [...map.values()];
}

const REF = /^\{([^}]+)\}$/;
export const isRef = (v: unknown): v is string => typeof v === 'string' && REF.test(v);
export const refName = (v: string) => (v.match(REF) as RegExpMatchArray)[1] as string;

/** 参照を最終値まで解決する（循環・未定義はエラー） */
export function createResolver(all: FlatToken[]) {
  const map = new Map(all.map((t) => [t.name, t]));
  const resolveValue = (v: unknown, seen: string[] = []): unknown => {
    if (isRef(v)) {
      const name = refName(v);
      if (seen.includes(name)) throw new Error(`循環参照: ${[...seen, name].join(' → ')}`);
      const t = map.get(name);
      if (!t) throw new Error(`未定義のトークンを参照しています: {${name}}`);
      return resolveValue(t.value, [...seen, name]);
    }
    if (Array.isArray(v)) return v.map((x) => resolveValue(x, seen));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolveValue(x, seen)]));
    return v;
  };
  return { map, resolveValue };
}

/** 解決済みの全トークン（テーマ別） */
export function resolvedTokens(theme: Theme) {
  const all = loadTokens(theme);
  const { resolveValue } = createResolver(all);
  return all.map((t) => ({ ...t, resolved: resolveValue(t.value) }));
}

export const cssVarName = (name: string) => `--${PREFIX}-${name.replace(/\./g, '-')}`;

/** DTCG 色オブジェクトを #rrggbb / rgba() へ（コントラスト計算・Figma 用） */
export function colorToHex(c: DtcgColor): string {
  if (!c.hex) throw new Error(`hex の無い色はこのツールでは扱えません: ${JSON.stringify(c)}`);
  return c.hex;
}

export function colorToCssRgba(c: DtcgColor): string {
  const hex = colorToHex(c);
  if (c.alpha === undefined || c.alpha === 1) return hex;
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${c.alpha})`;
}

export function dimensionToString(d: DtcgDimension): string {
  return `${d.value}${d.unit}`;
}

export const relFromRepo = (p: string) => relative(REPO_ROOT, p);
export const srcDir = (p: string) => dirname(p);
