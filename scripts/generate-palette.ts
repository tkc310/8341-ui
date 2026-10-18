/**
 * tokens/palette.config.json から tokens/primitive/color.json を生成する。
 * 実行: npm run tokens:palette
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { contrastRatio, oklchToHex } from './lib/color.ts';

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
const config: PaletteConfig = JSON.parse(
  readFileSync(resolve(root, 'tokens/palette.config.json'), 'utf8'),
);

const out: Record<string, unknown> = {};
for (const [name, fam] of Object.entries(config.families)) {
  const scale: Record<string, unknown> = {
    $description: fam.label,
  };
  config.steps.forEach((step, i) => {
    const L = Math.min(config.lightness[i] + (fam.lightnessShift ?? 0), 0.99);
    const hex = oklchToHex(L, config.chroma[i] * fam.chromaScale, fam.hue);
    scale[String(step)] = {
      $value: hex,
      $description: `白背景 ${contrastRatio(hex, '#ffffff').toFixed(2)}:1`,
    };
  });
  out[name] = scale;
}

const doc = {
  $description:
    'Primitive colors. 自動生成ファイル — 直接編集せず tokens/palette.config.json を変更すること。',
  color: {
    $type: 'color',
    primitive: {
      white: { $value: '#ffffff' },
      black: { $value: '#000000' },
      ...out,
    },
  },
};

writeFileSync(
  resolve(root, 'tokens/primitive/color.json'),
  `${JSON.stringify(doc, null, 2)}\n`,
);
console.log('✔ tokens/primitive/color.json を生成しました');
