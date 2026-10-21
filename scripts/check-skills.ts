/**
 * エージェントのスキル（.claude/skills/）が「必要なときだけ読み込む仕組み」（docs/skills.md）を守っているかを検査する。
 * 実行: make check（node scripts/check-skills.ts）。依存ゼロ
 *
 * error
 *   frontmatter   … SKILL.md の frontmatter が無い、name がディレクトリ名と違う、description が無い・1024 字を超える
 *   catalog       … docs/skills.md の一覧に載っていないスキルがある（一覧のリンクの先が無いものも）
 *   body-size     … SKILL.md の本体が上限（空白を除いて 2,000 字）を超える。段階ごとの文書に分ける
 *   broken-link   … スキルの中の相対リンク・パスの参照先が無い
 *   orphan        … スキルのディレクトリにあるのに、どこからも参照されない文書（読まれることが無い）
 */
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SKILLS = resolve(ROOT, '.claude/skills');
const CATALOG = resolve(ROOT, 'docs/skills.md');
const BODY_LIMIT = 2000;
const DESCRIPTION_LIMIT = 1024;

interface Finding {
  rule: string;
  file: string;
  message: string;
}
const findings: Finding[] = [];
const add = (rule: string, file: string, message: string) =>
  findings.push({ rule, file: relative(ROOT, file), message });

const count = (s: string) => s.replace(/\s+/g, '').length;

/** 文書の中の参照: Markdown のリンクと、`./x.md`・`../x/y.md`・`references/x.md` のようなコード表記のパス */
function references(text: string): string[] {
  const out: string[] = [];
  const withoutFences = text.replace(/```[\s\S]*?```/g, '');
  for (const m of withoutFences.matchAll(/\]\(([^)\s]+)\)/g)) out.push(m[1] ?? '');
  for (const m of withoutFences.matchAll(/`((?:\.{1,2}\/|references\/)[^`\s]+?\.md)`/g)) out.push(m[1] ?? '');
  for (const m of withoutFences.matchAll(/`([\w-]+\.md)`/g)) out.push(m[1] ?? '');
  return out.filter((r) => r && !/^[a-z]+:/i.test(r) && !r.startsWith('#'));
}

const skillDirs = readdirSync(SKILLS).filter((d) => lstatSync(join(SKILLS, d)).isDirectory());
const catalog = existsSync(CATALOG) ? readFileSync(CATALOG, 'utf8') : '';
if (!catalog) add('catalog', CATALOG, 'docs/skills.md がありません');

for (const name of skillDirs) {
  const dir = join(SKILLS, name);
  const skillFile = join(dir, 'SKILL.md');
  if (!existsSync(skillFile)) {
    add('frontmatter', dir, 'SKILL.md がありません');
    continue;
  }
  const text = readFileSync(skillFile, 'utf8');
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    add('frontmatter', skillFile, 'frontmatter（--- で囲んだ name と description）がありません');
    continue;
  }
  const field = (k: string) => fm[1]?.match(new RegExp(`^${k}:\\s*(.*)$`, 'm'))?.[1]?.trim() ?? '';
  if (field('name') !== name)
    add('frontmatter', skillFile, `name（${field('name') || '無し'}）をディレクトリ名 ${name} にそろえてください`);
  const description = field('description');
  if (!description) add('frontmatter', skillFile, 'description に「いつ使うか」を書いてください');
  else if (description.length > DESCRIPTION_LIMIT)
    add('frontmatter', skillFile, `description が ${description.length} 字です。${DESCRIPTION_LIMIT} 字以内に`);

  const body = text.slice(fm[0].length);
  const size = count(body);
  if (size > BODY_LIMIT)
    add(
      'body-size',
      skillFile,
      `本体が ${size} 字です（上限 ${BODY_LIMIT} 字、空白を除く）。詳細を段階ごとの文書に分けて、その段階からリンクしてください（docs/skills.md）`,
    );

  if (catalog && !catalog.includes(`.claude/skills/${name}/SKILL.md`))
    add('catalog', CATALOG, `スキル ${name} が一覧に載っていません。表に 1 行足してください`);

  // スキルの中の文書（references/ のシンボリックリンクの先は design-principles の正本なので対象外）
  const docs = readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => join(dir, f));
  const referenced = new Set<string>();
  for (const file of docs) {
    for (const ref of references(readFileSync(file, 'utf8'))) {
      const target = resolve(dirname(file), ref.split('#')[0] ?? '');
      // 単独のファイル名（`hearing.md` など）は、同じディレクトリに無ければリポジトリ内の別の文書の名前とみなして検査しない
      const bare = !ref.includes('/');
      if (!existsSync(target)) {
        if (!bare) add('broken-link', file, `参照先がありません: ${ref}`);
        continue;
      }
      referenced.add(target);
    }
  }
  for (const file of docs)
    if (file !== skillFile && !referenced.has(file))
      add('orphan', file, 'どの文書からも参照されていません。読むべき段階の手順からリンクしてください');
}

// 一覧のリンク切れ
for (const ref of references(catalog)) {
  const target = resolve(dirname(CATALOG), ref.split('#')[0] ?? '');
  if (ref.includes('/') && !existsSync(target)) add('broken-link', CATALOG, `参照先がありません: ${ref}`);
}

if (findings.length) {
  for (const f of findings) console.error(`✖ [${f.rule}] ${f.message}（${f.file}）`);
  console.error(`\n✖ スキルの検査: ${findings.length} 件`);
  process.exit(1);
}
console.log(`✔ スキルの検査: ${skillDirs.length} スキル（本体 ${BODY_LIMIT} 字以内・一覧・リンク）`);
