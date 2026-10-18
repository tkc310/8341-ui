type ClassValue = string | false | null | undefined;

/** 真値のクラス名だけを結合する */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
