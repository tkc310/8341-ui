/**
 * リポジトリ直下の DESIGN.md の自動生成ブロック（<!-- auto:NAME --> 〜 <!-- /auto:NAME -->）を
 * トークンとコンポーネント一覧から再生成する。手書き部分には触れない。
 * 実行: pnpm --filter tkc310-ui-tokens design-md（--check で差分検出のみ）
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tailwindName, utilityExample } from './lib/tailwind.ts';
import { type DtcgColor, type DtcgDimension, REPO_ROOT, THEMES, cssVarName, resolvedTokens } from './lib/tokens.ts';

const CHECK = process.argv.includes('--check');
const path = resolve(REPO_ROOT, 'DESIGN.md');

const byTheme = Object.fromEntries(THEMES.map((t) => [t, resolvedTokens(t)]));
const light = byTheme.light ?? [];
const dark = new Map((byTheme.dark ?? []).map((t) => [t.name, t]));
const pick = (prefix: string) => light.filter((t) => t.name.startsWith(prefix));
const esc = (s = '') => s.replace(/\|/g, '\\|');
const short = (v: unknown) =>
  typeof v === 'string' ? v.replace(/^\{color\.primitive\.|\}$/g, '').replace(/^\{|\}$/g, '') : '';

function show(type: string, v: unknown): string {
  if (type === 'color') {
    const c = v as DtcgColor;
    return c.alpha !== undefined && c.alpha < 1 ? `${c.hex} / ${c.alpha}` : (c.hex ?? '');
  }
  if (type === 'dimension') {
    const d = v as DtcgDimension;
    return `${d.value}${d.unit}`;
  }
  if (type === 'duration') {
    const d = v as { value: number; unit: string };
    return `${d.value}${d.unit}`;
  }
  if (type === 'cubicBezier') return `cubic-bezier(${(v as number[]).join(', ')})`;
  if (type === 'shadow') return `${(v as unknown[]).length} 層の影`;
  return String(v);
}

const blocks: Record<string, () => string> = {
  'semantic-colors': () => {
    const head = '| token | Tailwind | CSS 変数 | light | dark | 用途 |\n| --- | --- | --- | --- | --- | --- |';
    const rows = pick('color.')
      .filter((t) => t.layer === 'semantic')
      .map((t) => {
        const d = dark.get(t.name);
        const tw = utilityExample(tailwindName(t.path));
        return `| \`${t.name}\` | ${tw ? `\`${tw}\`` : '—'} | \`${cssVarName(t.name)}\` | \`${show('color', t.resolved)}\` ${short(t.value)} | \`${show('color', d?.resolved)}\` ${short(d?.value)} | ${esc(t.description)} |`;
      });
    return [head, ...rows].join('\n');
  },
  'primitive-colors': () => {
    const families = [...new Set(pick('color.primitive.').map((t) => t.path[2] as string))].filter(
      (f) => !['white', 'black'].includes(f),
    );
    const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200'];
    const head = `| family | ${steps.join(' | ')} |\n| --- |${' --- |'.repeat(steps.length)}`;
    const get = (f: string, s: string) => light.find((t) => t.name === `color.primitive.${f}.${s}`);
    const rows = families.map(
      (f) => `| ${f} | ${steps.map((s) => `\`${show('color', get(f, s)?.resolved)}\``).join(' | ')} |`,
    );
    return [head, ...rows].join('\n');
  },
  typography: () => {
    const head =
      '| style | Tailwind | size | line-height | weight | letter-spacing | 用途 |\n| --- | --- | --- | --- | --- | --- | --- |';
    const styles = [...new Set(pick('text.').map((t) => t.path[1] as string))];
    const prop = (s: string, p: string) => light.find((t) => t.name === `text.${s}.${p}`);
    const rows = styles.map((s) => {
      const size = prop(s, 'font-size');
      const mono = String(prop(s, 'font-family')?.value).includes('mono');
      return `| ${s} | \`text-${s}\`${mono ? ' `font-mono`' : ''} | ${show('dimension', size?.resolved)} | ${String(prop(s, 'line-height')?.resolved)} | ${String(prop(s, 'font-weight')?.resolved)} | ${String(prop(s, 'letter-spacing')?.resolved)}em | ${esc(light.find((t) => t.path[1] === s)?.description ?? '')} |`;
    });
    return [head, ...rows].join('\n');
  },
  dimensions: () => {
    const head = '| token | Tailwind | CSS 変数 | 値 | 用途 |\n| --- | --- | --- | --- | --- |';
    const rows = ['space.', 'size.', 'radius.', 'border-width.', 'focus.', 'shadow.', 'motion.', 'z.']
      .flatMap(pick)
      .map((t) => {
        const tw = utilityExample(tailwindName(t.path));
        return `| \`${t.name}\` | ${tw ? `\`${tw}\`` : '—'} | \`${cssVarName(t.name)}\` | \`${esc(show(t.type, t.resolved))}\` | ${esc(t.description)} |`;
      });
    return [head, ...rows].join('\n');
  },
  components: () => {
    const dir = resolve(REPO_ROOT, 'packages/ui/src/components');
    return readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
      .map((d) => d.name)
      .sort()
      .map((n) => `- \`${n}\` — \`packages/ui/src/components/${n}/\``)
      .join('\n');
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
    console.error(
      '✖ DESIGN.md がトークンと一致していません。pnpm --filter tkc310-ui-tokens design-md を実行してください',
    );
    process.exit(1);
  }
  console.log('✔ DESIGN.md はトークンと一致しています');
} else {
  writeFileSync(path, md);
  console.log('✔ DESIGN.md');
}
