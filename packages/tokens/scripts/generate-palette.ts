/**
 * src/palette.config.json から src/primitive/color.tokens.json を生成する。
 * 色は DTCG 2025.10 の色オブジェクト（colorSpace: oklch）で持ち、sRGB の hex を代替値として添える。
 * 彩度は sRGB の色域に収まるまで下げてあるので、oklch() と hex は同じ色になる。
 * 実行: pnpm --filter 8341-ui-tokens palette
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { contrastRatio, gamutMapOklch } from './lib/color.ts';

interface Family {
  label: string;
  hue: number;
  chromaScale: number;
  lightnessShift?: number;
}
interface PaletteConfig {
  steps: number[];
  lightness: number[];
  chroma: number[];
  families: Record<string, Family>;
}

const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(readFileSync(resolve(root, 'src/palette.config.json'), 'utf8')) as PaletteConfig;

const color = (components: [number, number, number], hex: string) => ({ colorSpace: 'oklch', components, hex });

const primitive: Record<string, unknown> = {
  white: { $value: color([1, 0, 0], '#ffffff') },
  black: { $value: color([0, 0, 0], '#000000') },
};

for (const [name, fam] of Object.entries(config.families)) {
  const scale: Record<string, unknown> = { $description: fam.label };
  config.steps.forEach((step, i) => {
    const L = Math.min((config.lightness[i] ?? 0) + (fam.lightnessShift ?? 0), 0.99);
    const { components, hex } = gamutMapOklch(L, (config.chroma[i] ?? 0) * fam.chromaScale, fam.hue);
    scale[String(step)] = {
      $value: color(components, hex),
      $description: `白背景 ${contrastRatio(hex, '#ffffff').toFixed(2)}:1`,
    };
  });
  primitive[name] = scale;
}

const doc = {
  $schema: 'https://www.designtokens.org/schemas/2025.10/format.json',
  $description: 'Primitive colors. 自動生成ファイル — 直接編集せず src/palette.config.json を変更すること。',
  color: { $type: 'color', primitive },
};

writeFileSync(resolve(root, 'src/primitive/color.tokens.json'), `${JSON.stringify(doc, null, 2)}\n`);
console.log('✔ src/primitive/color.tokens.json を生成しました');
