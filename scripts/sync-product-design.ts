/**
 * プロダクト用 DESIGN.md の雛形（templates/PRODUCT-DESIGN.md）の <!-- auto:principles --> を、
 * docs/design-principles/ から生成する。載せるのは判断の順序・ルールの強さ・各ルールの「必須」だけ（コードから読み取れない考え方）。
 * 雛形は shadcn のレジストリ（@8341/design-md）で、利用側のリポジトリ直下に DESIGN.md として置かれる。
 *
 * 実行: make design-md（--check で差分検出。make check から呼ぶ）
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DP = 'docs/design-principles';
const TEMPLATE = resolve(ROOT, 'templates/PRODUCT-DESIGN.md');
const CHECK = process.argv.includes('--check');

const read = (rel: string) => readFileSync(resolve(ROOT, DP, rel), 'utf8');

/** 見出し（# の数と文言が一致）から、同じか上の段の次の見出しまで */
function section(md: string, level: number, title: string): string {
  const lines = md.split('\n');
  const start = lines.findIndex((l) => l === `${'#'.repeat(level)} ${title}`);
  if (start < 0) throw new Error(`見出し「${title}」が見つかりません`);
  const end = lines.findIndex((l, i) => i > start && new RegExp(`^#{1,${level}} `).test(l));
  return lines.slice(start + 1, end < 0 ? undefined : end).join('\n');
}

/** 「**必須**」の直後の箇条書き（空行を挟まずに続くもの） */
function required(text: string): string[] {
  const lines = text.split('\n');
  const start = lines.indexOf('**必須**');
  if (start < 0) return [];
  const out: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('- ')) out.push(line);
    else if (line.trim() || out.length) break;
  }
  return out;
}

/** 最初の表（見出し行を含む） */
function table(text: string): string {
  return text
    .split('\n')
    .filter((l) => l.startsWith('|'))
    .join('\n');
}

/** 相対リンクを、利用側のリポジトリでのパス（docs/design-principles/…）の表記にする */
function relink(text: string, from: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (all, label: string, href: string) => {
    if (/^[a-z]+:/i.test(href) || href.startsWith('#')) return all;
    const path = normalize(join(DP, dirname(from), href.split('#')[0] ?? ''));
    return `${label}（\`${path}\`）`;
  });
}

function build(): string {
  const readme = read('README.md');
  const orientation = read('ui-orientation.md');
  const services = read('services/README.md');
  const principles = read('principles.md');

  const rules = table(section(principles, 2, '適用ルール'))
    .split('\n')
    .slice(2)
    .map((row) => row.split('|').map((c) => c.trim()))
    .map(([, name = '', decides = '']) => ({ name, decides }));

  const out = [
    `8341-ui の design-principles から生成した要約（手で直さない）。各ルールの「必須」だけを載せる。推奨・レビュー項目・理由は \`${DP}/\` の該当する節を読む。`,
    '',
    '### 判断の順序とルールの強さ',
    '',
    `1. UI の方向性（\`${DP}/ui-orientation.md\`）`,
    `2. サービス別の特化ルール（\`${DP}/services/\`）。原則と食い違う判断は特化ルールを採る`,
    `3. ウェブデザインの原則（\`${DP}/principles.md\`）。1 と 2 が書いていない判断に使う`,
    `4. WCAG 2.2 の達成基準（\`${DP}/wcag-for-designers.md\`）。必須は 1〜3 のどれからも緩めない`,
    '',
    table(section(readme, 2, 'ルールの強さ')),
    '',
    '### UI の方向性',
    '',
    ...required(section(orientation, 3, 'ドメインとユーザーによる判断')).map((l) => relink(l, 'ui-orientation.md')),
    '',
    '### サービス別の特化ルール',
    '',
    relink(table(section(services, 2, 'どの文書を使うか')), 'services/README.md'),
    '',
    '### ウェブデザインの原則（必須）',
  ];
  for (const { name, decides } of rules) {
    const bullets = required(section(principles, 3, name));
    if (!bullets.length) throw new Error(`原則「${name}」に必須がありません`);
    out.push('', `#### ${name}`, '', `${decides}。`, '', ...bullets.map((l) => relink(l, 'principles.md')));
  }
  return out.join('\n');
}

const current = readFileSync(TEMPLATE, 'utf8');
const re = /(<!-- auto:principles -->)[\s\S]*?(<!-- \/auto:principles -->)/;
if (!re.test(current)) throw new Error('templates/PRODUCT-DESIGN.md に <!-- auto:principles --> がありません');
const next = current.replace(re, `$1\n${build()}\n$2`);

if (CHECK) {
  if (next !== current) {
    console.error('✖ templates/PRODUCT-DESIGN.md の原則が古くなっています。make design-md を実行してください');
    process.exit(1);
  }
  console.log('✔ templates/PRODUCT-DESIGN.md の原則は docs/design-principles と一致しています');
} else {
  writeFileSync(TEMPLATE, next);
  console.log('✔ templates/PRODUCT-DESIGN.md（auto:principles）');
}
