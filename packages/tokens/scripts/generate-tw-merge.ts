/**
 * Tailwind のクラス統合（tailwind-variants 内蔵の tailwind-merge）に、8341-ui 独自のテーマ名を登録する設定を生成する。
 *
 * 登録しないと、たとえば `text-fg text-body-md` の `text-body-md` が色クラスと誤認され、
 * 後から書いた方だけが残って文字色が消える。
 *
 * 出力: packages/ui/src/lib/tw-merge-config.ts（コミットする。--check で差分検出）
 * 実行: make tw-merge
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tailwindName } from './lib/tailwind.ts';
import { REPO_ROOT, resolvedTokens } from './lib/tokens.ts';

const OUT = resolve(REPO_ROOT, 'packages/ui/src/lib/tw-merge-config.ts');
const CHECK = process.argv.includes('--check');

const theme: Record<string, Set<string>> = {
  text: new Set(),
  shadow: new Set(),
  spacing: new Set(),
  container: new Set(),
  radius: new Set(),
  'font-weight': new Set(),
};
for (const t of resolvedTokens('light')) {
  const name = tailwindName(t.path);
  const m = name?.match(/^--(text|shadow|spacing|container|radius|font-weight)-(.+)$/);
  if (!m || m[2]?.includes('--')) continue;
  theme[m[1] as string]?.add(m[2] as string);
}

const body = Object.entries(theme)
  .map(([k, v]) => `      ${k.includes('-') ? `'${k}'` : k}: [${[...v].map((x) => `'${x}'`).join(', ')}],`)
  .join('\n');

const content = `/* このファイルは packages/tokens/scripts/generate-tw-merge.ts が生成します。直接編集しないでください。 */
/**
 * tailwind-variants のクラス統合に登録する 8341-ui 独自のテーマ名。
 * これが無いと \`text-fg text-body-md\` の文字色が消えるなど、クラスの競合判定を誤る。
 */
export const twMergeConfig = {
  extend: {
    theme: {
${body}
    },
  },
} as const;
`;

if (CHECK) {
  let current = '';
  try {
    current = readFileSync(OUT, 'utf8');
  } catch {}
  if (current !== content) {
    console.error('✖ packages/ui/src/lib/tw-merge-config.ts が古くなっています。make tw-merge を実行してください');
    process.exit(1);
  }
  console.log('✔ tw-merge-config.ts はトークンと一致しています');
} else {
  writeFileSync(OUT, content);
  console.log('✔ packages/ui/src/lib/tw-merge-config.ts');
}
