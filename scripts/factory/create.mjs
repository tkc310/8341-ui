#!/usr/bin/env node
/**
 * デザインシステムファクトリー: このリポジトリ（8341-ui）をひな形に、新しいデザインシステムのリポジトリを作る。
 * 手順の全体（ヒアリング → 設定ファイル → このスクリプト → 生成後の仕上げ）は .claude/skills/ds-factory/SKILL.md。
 *
 *   node scripts/factory/create.mjs --config factory.config.json --out ../acme-design-system
 *
 * 設定ファイル（JSON）
 *   name        パッケージ名の元（例: acme-ui → acme-ui / acme-ui-tokens）
 *   prefix      CSS 変数・レジストリの名前空間などの接頭辞（例: acme → --acme-*, @acme, acme-base）
 *   repository  { owner, name } GitHub のリポジトリ（README・レジストリ・Pages の URL に使う）
 *   keyColor    { hue } か { hex } のどちらか。family（系統名。例: wakatake）、label（表示名）
 *
 * やること
 *   - git で追跡しているファイルだけをコピーする（node_modules・dist・ロックファイルは持ち込まない）
 *   - 8341-ui → name、8341 → prefix、indigo → keyColor.family、リポジトリの URL を置き換える
 *     （規格名の「JIS X 8341」は置き換えない）
 *   - palette.config.json のキーカラーの色相と、中立色（gray）の色相を keyColor に合わせる
 *   - ファクトリー専用のファイルと、<!-- factory:start --> 〜 <!-- factory:end -->（Makefile では # factory:start 〜 # factory:end）の範囲を取り除く
 *   - 改善ログを空にし、生成の記録を ADR に残す
 */
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const TEMPLATE = resolve(import.meta.dirname, '../..');
const TEMPLATE_NAME = '8341-ui';
const TEMPLATE_PREFIX = '8341';
const TEMPLATE_FAMILY = 'indigo';
const TEMPLATE_REPO = 'tkc310/8341ui';
const TEMPLATE_PAGES = 'tkc310.github.io/8341ui';
const OTHER_FAMILIES = ['teal', 'purple', 'red', 'orange', 'yellow', 'green', 'gray'];

/** 生成先に持ち込まないもの（ファクトリー自身と、生成し直すもの） */
const EXCLUDE = [/^scripts\/factory\//, /^\.claude\/skills\/ds-factory\//, /^docs\/factory\.md$/, /^pnpm-lock\.yaml$/];

const { values } = parseArgs({
  options: {
    config: { type: 'string' },
    out: { type: 'string' },
    force: { type: 'boolean', default: false },
  },
});

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

if (!values.config || !values.out) fail('--config と --out を指定してください');
const config = JSON.parse(readFileSync(resolve(values.config), 'utf8'));
const out = resolve(values.out);

// ---------------------------------------------------------------------------
// 設定の検証
// ---------------------------------------------------------------------------
const NAME = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
if (!NAME.test(config.name ?? '')) fail('name は英小文字・数字・ハイフンで指定してください（例: acme-ui）');
if (!NAME.test(config.prefix ?? '')) fail('prefix は英小文字・数字・ハイフンで指定してください（例: acme）');
if (!config.repository?.owner || !config.repository?.name)
  fail('repository.owner と repository.name を指定してください');
const family = config.keyColor?.family ?? 'brand';
if (!/^[a-z][a-z0-9-]*$/.test(family)) fail('keyColor.family は英小文字で始めてください（例: wakatake）');
if (OTHER_FAMILIES.includes(family)) fail(`keyColor.family に ${family} は使えません（他の色の系統名と重なります）`);
const hue = config.keyColor?.hue ?? (config.keyColor?.hex ? hexToOklchHue(config.keyColor.hex) : undefined);
if (typeof hue !== 'number' || Number.isNaN(hue))
  fail('keyColor.hue（0〜360）か keyColor.hex（#rrggbb）を指定してください');
if (existsSync(out) && readdirSync(out).length > 0 && !values.force) {
  fail(`${out} は空ではありません（上書きするなら --force）`);
}

/** sRGB の hex を OKLCH の色相（度）に変換する */
function hexToOklchHue(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) fail(`keyColor.hex の形式が正しくありません: ${hex}`);
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = Number.parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const mm = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.428592205 * mm + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * mm - 0.808675766 * s;
  const h = (Math.atan2(bb, a) * 180) / Math.PI;
  return Math.round((h + 360) % 360);
}

// ---------------------------------------------------------------------------
// 置き換え
// ---------------------------------------------------------------------------
const { owner, name: repoName } = config.repository;
function transform(text) {
  return text
    .replace(/<!-- factory:start -->[\s\S]*?<!-- factory:end -->\n?/g, '')
    .replace(/# factory:start\n[\s\S]*?# factory:end\n?/g, '')
    .replaceAll(TEMPLATE_PAGES, `${owner}.github.io/${repoName}`)
    .replaceAll(TEMPLATE_REPO, `${owner}/${repoName}`)
    .replace(new RegExp(`(?<!X )${TEMPLATE_NAME}`, 'g'), config.name)
    .replace(new RegExp(`(?<!X )${TEMPLATE_PREFIX}`, 'g'), config.prefix)
    .replace(new RegExp(`\\b${TEMPLATE_FAMILY}\\b`, 'g'), family);
}

const isText = (buf) => !buf.includes(0);
const git = (args) => execFileSync('git', args, { cwd: TEMPLATE, encoding: 'utf8' }).trim();
const files = git(['ls-files', '-z'])
  .split('\0')
  .filter((f) => f && !EXCLUDE.some((re) => re.test(f)));
const sha = git(['rev-parse', '--short', 'HEAD']);

mkdirSync(out, { recursive: true });
for (const file of files) {
  const src = join(TEMPLATE, file);
  // 作業ツリーで消したファイルは持ち込まない
  if (!lstatSync(src, { throwIfNoEntry: false })) continue;
  const dest = join(out, transform(file));
  mkdirSync(dirname(dest), { recursive: true });
  if (lstatSync(src).isSymbolicLink()) {
    symlinkSync(readlinkSync(src), dest);
    continue;
  }
  const buf = readFileSync(src);
  writeFileSync(dest, isText(buf) ? transform(buf.toString('utf8')) : buf);
}

// キーカラー
const palettePath = join(out, 'packages/tokens/src/palette.config.json');
const palette = JSON.parse(readFileSync(palettePath, 'utf8'));
palette.families[family] = {
  ...palette.families[family],
  hue,
  label: config.keyColor?.label ?? `${family} — キーカラー`,
};
palette.families.gray = { ...palette.families.gray, hue, label: '中立色（わずかにキーカラーへ寄せる）' };
writeFileSync(palettePath, `${JSON.stringify(palette, null, 2)}\n`);

// ファクトリーを呼ぶスクリプトは生成先では使えないので消す
const rootPkgPath = join(out, 'package.json');
const rootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'));
delete rootPkg.scripts['factory:create'];
writeFileSync(rootPkgPath, `${JSON.stringify(rootPkg, null, 2)}\n`);

// 改善ログを空にする
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(out, 'docs/improvement/log.md'),
  [
    '# 改善ログ',
    '',
    '1 改善 1 行。新しいものを上に追記します。「再発防止」には追加したチェック・テスト・ルールを書きます。',
    '',
    '| 日付 | 種別 | 内容 | 再発防止 |',
    '| --- | --- | --- | --- |',
    `| ${today} | 初版 | ${TEMPLATE_NAME}（${sha}）をひな形にデザインシステムファクトリーで作成 | — |`,
    '',
  ].join('\n'),
);

// 生成の記録（ADR）
const decisions = join(out, 'docs/decisions');
const numbers = readdirSync(decisions)
  .map((f) => Number.parseInt(f.slice(0, 4), 10))
  .filter((n) => !Number.isNaN(n));
const adrNumber = String(Math.max(...numbers) + 1).padStart(4, '0');
const adrFile = `${adrNumber}-generated-by-factory.md`;
writeFileSync(
  join(decisions, adrFile),
  [
    `# ${adrNumber} デザインシステムファクトリーで ${config.name} を作成する`,
    '',
    `- 日付: ${today}`,
    '- 状態: 採用',
    '',
    '## 背景',
    `${TEMPLATE_NAME}（${TEMPLATE_REPO}@${sha}）をひな形に、design-principles とヒアリングの結果から作成した。`,
    'これより前の ADR は、ひな形から引き継いだ判断である。',
    '',
    '## 決定',
    '',
    '```json',
    JSON.stringify({ ...config, keyColor: { ...config.keyColor, hue, family } }, null, 2),
    '```',
    '',
    '## 理由',
    'ヒアリングの記録は DESIGN.md の冒頭にある。',
    '',
    '## 影響・トレードオフ',
    'ひな形の更新は自動では取り込まれない。必要な変更は差分を見て手で取り込む。',
    '',
  ].join('\n'),
);
const readmePath = join(decisions, 'README.md');
writeFileSync(
  readmePath,
  readFileSync(readmePath, 'utf8').replace(
    /(\n\| \[\d{4}\][^\n]*\n)(?!\|)/,
    `$1| [${adrNumber}](./${adrFile}) | デザインシステムファクトリーで ${config.name} を作成 | 採用 |\n`,
  ),
);

// ひな形の見た目の性格（藍など）が残っている箇所を知らせる。生成後にスキルの手順で書き換える
let leftovers = '';
try {
  leftovers = execFileSync('grep', ['-rnE', '藍|Ai — |hue 265', '--include=*.md', '--include=*.mdx', '.'], {
    cwd: out,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
} catch {
  // 見つからないと grep は終了コード 1 を返す
}

console.log(`✔ ${out} に ${config.name} を作成しました（キーカラーの色相 ${hue}、系統名 ${family}）`);
console.log(`  記録: docs/decisions/${adrFile}`);
if (leftovers) {
  console.log('\nひな形の見た目の性格が残っている箇所（ds-factory スキルの手順 5 で書き換える）:');
  console.log(leftovers.split('\n').slice(0, 30).join('\n'));
}
console.log(`
次の手順:
  cd ${values.out}
  git init && make setup
  make palette && make generate
  make verify`);
