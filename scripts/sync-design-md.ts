/**
 * DESIGN.md の自動生成ブロック（<!-- auto:NAME --> 〜 <!-- /auto:NAME -->）をトークンから再生成する。
 * 手書き部分には触れない。
 * 実行: npm run tokens:build に含まれる。--check で差分検出のみ。
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT } from './lib/tokens.ts';

interface Token {
  name: string;
  cssVar: string;
  type: string;
  layer: string;
  themed: boolean;
  value: unknown;
  ref?: unknown;
  description?: string;
}

const CHECK = process.argv.includes('--check');
const path = resolve(ROOT, 'DESIGN.md');
const { tokens } = JSON.parse(readFileSync(resolve(ROOT, 'src/tokens/tokens.json'), 'utf8')) as { tokens: Token[] };
const pick = (prefix: string) => tokens.filter((t) => t.name.startsWith(prefix));
const short = (r: unknown) => (typeof r === 'string' ? r.replace('color.primitive.', '') : '');
const esc = (s = '') => s.replace(/\|/g, '\\|');

const blocks: Record<string, () => string> = {
  'primitive-colors': () => {
    const families = [...new Set(pick('color.primitive.').map((t) => t.name.split('.')[2]))].filter(
      (f) => !['white', 'black'].includes(f),
    );
    const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200'];
    const head = `| family | ${steps.join(' | ')} |\n| --- |${' --- |'.repeat(steps.length)}`;
    const rows = families.map(
      (f) => `| ${f} | ${steps.map((s) => `\`${tokens.find((t) => t.name === `color.primitive.${f}.${s}`)?.value}\``).join(' | ')} |`,
    );
    return [head, ...rows].join('\n');
  },
  'semantic-colors': () => {
    const head = '| token | CSS 変数 | light | dark | 用途 |\n| --- | --- | --- | --- | --- |';
    const rows = pick('color.')
      .filter((t) => t.layer === 'semantic')
      .map((t) => {
        const v = t.value as { light: string; dark: string };
        const r = (t.ref ?? {}) as { light?: string; dark?: string };
        return `| \`${t.name}\` | \`${t.cssVar}\` | \`${v.light}\` ${short(r.light)} | \`${v.dark}\` ${short(r.dark)} | ${esc(t.description)} |`;
      });
    return [head, ...rows].join('\n');
  },
  typography: () => {
    const head = '| style | class | size | line-height | weight | letter-spacing | 用途 |\n| --- | --- | --- | --- | --- | --- | --- |';
    const rows = pick('text.')
      .filter((t) => t.type === 'typography')
      .map((t) => {
        const v = t.value as Record<string, unknown>;
        const name = t.name.replace('text.', '');
        return `| ${name} | \`.dsm-text-${name}\` | ${v.fontSize} | ${v.lineHeight} | ${v.fontWeight} | ${v.letterSpacing} | ${esc(t.description)} |`;
      });
    return [head, ...rows].join('\n');
  },
  dimensions: () => {
    const head = '| token | CSS 変数 | 値 | 用途 |\n| --- | --- | --- | --- |';
    const rows = ['space.', 'size.', 'radius.', 'border-width.', 'focus.', 'shadow.', 'motion.', 'z.']
      .flatMap(pick)
      .filter((t) => t.layer === 'semantic' && !t.name.startsWith('color.'))
      .map((t) => {
        const v = t.themed ? (t.value as { light: unknown }).light : t.value;
        const val = Array.isArray(v) ? `cubic-bezier(${v.join(', ')})` : String(v);
        return `| \`${t.name}\` | \`${t.cssVar}\` | \`${esc(val)}\` | ${esc(t.description)} |`;
      });
    return [head, ...rows].join('\n');
  },
  components: () => {
    const dir = resolve(ROOT, 'src/components');
    const names = readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
      .map((d) => d.name)
      .sort();
    return names.map((n) => `- \`${n}\` — \`src/components/${n}/\``).join('\n');
  },
};

let md = readFileSync(path, 'utf8');
const original = md;
for (const [name, gen] of Object.entries(blocks)) {
  const re = new RegExp(`(<!-- auto:${name} -->)[\\s\\S]*?(<!-- /auto:${name} -->)`);
  if (!re.test(md)) throw new Error(`DESIGN.md に <!-- auto:${name} --> ブロックがありません`);
  md = md.replace(re, `$1\n${gen()}\n$2`);
}

if (CHECK) {
  if (md !== original) {
    console.error('✖ DESIGN.md がトークンと一致していません。npm run tokens:build を実行してください');
    process.exit(1);
  }
  console.log('✔ DESIGN.md はトークンと一致しています');
} else {
  writeFileSync(path, md);
  console.log('✔ DESIGN.md');
}
