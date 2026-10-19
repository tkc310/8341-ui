#!/usr/bin/env node
/**
 * 手元で行うリリース。権限のあるアカウント保有者が、自分の gh・npm のログインで実行する
 * （リポジトリにトークンやシークレットを置かない。ADR-0014）。手順の全体は docs/releasing.md。
 *
 *   pnpm release:version            # changeset を版に反映し、「版を上げる PR」を作る
 *   pnpm release:publish            # （その PR のマージ後、main で）タグ・GitHub Releases・版ごとのレジストリを作る
 *   pnpm release:publish --npm      # 上に加えて npm にも公開する（npm login 済みであること）
 *   pnpm release:publish --dry-run  # 何をするかだけ表示する
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const ROOT = resolve(import.meta.dirname, '..');
const PAGES_BRANCH = 'gh-pages';
const REGISTRY_DIR = join(ROOT, 'apps/storybook/public/r');

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    npm: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
  },
});
const DRY = values['dry-run'];

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();
/** 標準入出力をそのまま流す（npm の OTP の入力などに使う） */
const runLive = (cmd, args) => execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit' });
const git = (args, cwd = ROOT) => run('git', args, { cwd });
const tryGit = (args, cwd = ROOT) => {
  try {
    git(args, cwd);
    return true;
  } catch {
    return false;
  }
};
/** 変更を伴う操作。--dry-run のときは表示だけする */
function step(label, fn) {
  console.log(`${DRY ? '（dry-run）' : '→'} ${label}`);
  if (!DRY) fn();
}

function repoSlug() {
  const url = git(['remote', 'get-url', 'origin']);
  const m = url.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
  if (!m) fail(`origin が GitHub のリポジトリではありません: ${url}`);
  return { owner: m[1], repo: m[2] };
}

/** 公開するパッケージ（private でないもの）。先頭を「主のパッケージ」として扱う */
function publicPackages() {
  return readdirSync(join(ROOT, 'packages'))
    .map((dir) => ({ dir: join(ROOT, 'packages', dir), pkg: join(ROOT, 'packages', dir, 'package.json') }))
    .filter(({ pkg }) => existsSync(pkg))
    .map(({ dir, pkg }) => ({ dir, ...JSON.parse(readFileSync(pkg, 'utf8')) }))
    .filter((p) => !p.private)
    .sort((a, b) => a.name.length - b.name.length);
}

function requireCleanMain() {
  if (git(['status', '--porcelain'])) fail('未コミットの変更があります。コミットするか退避してから実行してください');
  if (git(['rev-parse', '--abbrev-ref', 'HEAD']) !== 'main') fail('main ブランチで実行してください');
  git(['fetch', '--quiet', 'origin', 'main', '--tags']);
  if (git(['rev-parse', 'HEAD']) !== git(['rev-parse', 'origin/main'])) {
    fail('main が origin/main と一致しません。git pull してから実行してください');
  }
}

/** CHANGELOG.md から、その版の節（## <版> から次の ## まで）を取り出す */
function releaseNotes(dir, version) {
  const path = join(dir, 'CHANGELOG.md');
  if (!existsSync(path)) return '';
  const lines = readFileSync(path, 'utf8').split('\n');
  const start = lines.findIndex((l) => l.trim() === `## ${version}`);
  if (start === -1) return '';
  const end = lines.findIndex((l, i) => i > start && l.startsWith('## '));
  return lines
    .slice(start + 1, end === -1 ? undefined : end)
    .join('\n')
    .trim();
}

/** リリースした版のレジストリを gh-pages の r/v<版>/ に置く（一時的な worktree で扱い、強制 push しない） */
function publishRegistrySnapshot(version) {
  const work = mkdtempSync(join(tmpdir(), 'release-registry-'));
  try {
    if (!tryGit(['fetch', '--quiet', 'origin', `${PAGES_BRANCH}:refs/remotes/origin/${PAGES_BRANCH}`])) {
      fail(`origin に ${PAGES_BRANCH} ブランチがありません（main への初回 push で CI が作ります）`);
    }
    git(['worktree', 'add', '--quiet', '--detach', work, `origin/${PAGES_BRANCH}`]);
    const target = join(work, 'r', `v${version}`);
    rmSync(target, { recursive: true, force: true });
    cpSync(REGISTRY_DIR, target, { recursive: true });
    writeFileSync(join(work, '.nojekyll'), '');
    git(['add', '-A'], work);
    if (!git(['status', '--porcelain'], work)) return;
    git(['-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', `release: registry v${version}`], work);
    for (let i = 0; i < 3; i++) {
      if (tryGit(['push', '--quiet', 'origin', `HEAD:${PAGES_BRANCH}`], work)) return;
      git(['fetch', '--quiet', 'origin', PAGES_BRANCH], work);
      git(['rebase', '--quiet', `origin/${PAGES_BRANCH}`], work);
    }
    fail(`${PAGES_BRANCH} への push に失敗しました`);
  } finally {
    tryGit(['worktree', 'remove', '--force', work]);
    rmSync(work, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// version: changeset を版に反映し、PR を作る
// ---------------------------------------------------------------------------
function version() {
  requireCleanMain();
  if (!readdirSync(join(ROOT, '.changeset')).some((f) => f.endsWith('.md') && f !== 'README.md')) {
    fail('未反映の changeset がありません（.changeset/*.md）');
  }
  const before = publicPackages()[0].version;
  const tmpBranch = `release/next-${Date.now()}`;
  step(`ブランチ ${tmpBranch} を作る`, () => git(['switch', '--quiet', '-c', tmpBranch]));
  step('pnpm changeset version（版の更新と CHANGELOG の追記）', () => runLive('pnpm', ['changeset', 'version']));
  if (DRY) return;
  const next = publicPackages()[0].version;
  if (next === before) fail('版が変わりませんでした');
  const branch = `release/v${next}`;
  git(['branch', '-m', branch]);
  git(['add', '-A']);
  git(['commit', '--quiet', '-m', `chore: リリース v${next}`]);
  git(['push', '--quiet', '-u', 'origin', branch]);
  const notes = publicPackages()
    .map((p) => `## ${p.name} ${next}\n\n${releaseNotes(p.dir, next)}`)
    .join('\n\n');
  const body = `v${next} をリリースする。マージ後に main で \`pnpm release:publish\` を実行する（docs/releasing.md）。\n\n${notes}`;
  const url = run('gh', ['pr', 'create', '--base', 'main', '--head', branch, '--title', `chore: リリース v${next}`, '--body', body]);
  console.log(`✔ 版を上げる PR を作りました: ${url}`);
}

// ---------------------------------------------------------------------------
// publish: タグ・GitHub Releases・版ごとのレジストリ（・npm）
// ---------------------------------------------------------------------------
function publish() {
  requireCleanMain();
  const packages = publicPackages();
  const ver = packages[0].version;
  const tags = packages.map((p) => `${p.name}@${p.version}`);
  const existing = git(['tag', '--list', ...tags]);
  if (existing) fail(`すでにタグがあります: ${existing.replace(/\n/g, ', ')}（この版はリリース済み）`);
  const { owner, repo } = repoSlug();

  step('ビルドとレジストリの生成（pnpm build・registry:build）', () => {
    runLive('pnpm', ['build']);
    runLive('pnpm', ['--filter', packages[0].name, 'registry:build']);
  });
  if (values.npm) {
    // changeset publish は npm に公開し、タグも作る。認証は手元の npm login（2 段階認証の OTP を求められる）
    step('npm に公開する（pnpm changeset publish）', () => runLive('pnpm', ['changeset', 'publish']));
  } else {
    step('タグを作る（pnpm changeset tag）', () => runLive('pnpm', ['changeset', 'tag']));
  }
  step(`タグを push する（${tags.join(', ')}）`, () => git(['push', '--quiet', 'origin', ...tags]));
  for (const [i, p] of packages.entries()) {
    const tag = `${p.name}@${p.version}`;
    step(`GitHub Release を作る（${tag}）`, () => {
      const file = join(mkdtempSync(join(tmpdir(), 'release-notes-')), 'notes.md');
      writeFileSync(file, releaseNotes(p.dir, p.version) || `${tag} をリリースしました。`);
      run('gh', [
        'release',
        'create',
        tag,
        '--repo',
        `${owner}/${repo}`,
        '--title',
        `${p.name} ${p.version}`,
        '--notes-file',
        file,
        '--verify-tag',
        `--latest=${i === 0}`,
      ]);
    });
  }
  step(`版ごとのレジストリを置く（https://${owner}.github.io/${repo}/r/v${ver}/）`, () => publishRegistrySnapshot(ver));
  console.log(DRY ? `✔ dry-run を終えました（v${ver}）` : `✔ v${ver} をリリースしました: https://github.com/${owner}/${repo}/releases`);
}

const command = positionals[0];
if (command === 'version') version();
else if (command === 'publish') publish();
else fail('使い方: node scripts/release.mjs <version|publish> [--npm] [--dry-run]');
