/**
 * 依存ゼロのカラー計算ユーティリティ。
 * - OKLCH → sRGB(hex) 変換（ガマット外は彩度を下げて収める）
 * - WCAG 2.x の相対輝度とコントラスト比
 */

type RGB = [number, number, number];

function oklchToLinearSrgb(L: number, C: number, h: number): RGB {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (c: RGB) => c.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

function encode(v: number): number {
  const x = Math.min(Math.max(v, 0), 1);
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
}

/**
 * sRGB の色域に収まるまで彩度を 0.002 刻みで下げた OKLCH と、その hex を返す。
 * 返す components は oklch() で描いたときに hex と同じ色になる（色域内のため）。
 */
export function gamutMapOklch(L: number, C: number, h: number) {
  let c = C;
  while (c > 0 && !inGamut(oklchToLinearSrgb(L, c, h))) c -= 0.002;
  c = Math.max(c, 0);
  const rgb = oklchToLinearSrgb(L, c, h).map((v) => Math.round(encode(v) * 255));
  const hex = `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  const round = (n: number, d: number) => Number(n.toFixed(d));
  return { components: [round(L, 4), round(c, 4), c === 0 ? 0 : round(h, 2)] as [number, number, number], hex };
}

function parseColor(input: string): { rgb: RGB; alpha: number } {
  const hex = input.trim().toLowerCase();
  const m = hex.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/);
  if (m) {
    const n = m[1] ?? '000000';
    return {
      rgb: [0, 2, 4].map((i) => Number.parseInt(n.slice(i, i + 2), 16) / 255) as RGB,
      alpha: m[2] ? parseInt(m[2], 16) / 255 : 1,
    };
  }
  const r = hex.match(/^rgba?\(([^)]+)\)$/);
  if (r) {
    const parts = (r[1] ?? '')
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    const [red = 0, green = 0, blue = 0] = parts;
    return {
      rgb: [red / 255, green / 255, blue / 255],
      alpha: parts[3] ?? 1,
    };
  }
  throw new Error(`Unsupported color: ${input}`);
}

/** 半透明色を背景に合成した不透明色を返す */
function composite(fg: string, bg: string): RGB {
  const f = parseColor(fg);
  const b = parseColor(bg);
  return f.rgb.map((v, i) => v * f.alpha + (b.rgb[i] ?? 0) * (1 - f.alpha)) as RGB;
}

function luminance(rgb: RGB): number {
  const [r, g, b] = rgb.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)) as RGB;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x のコントラスト比。前景が半透明なら背景に合成してから計算する。 */
export function contrastRatio(fg: string, bg: string): number {
  const a = luminance(composite(fg, bg));
  const b = luminance(parseColor(bg).rgb);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}
