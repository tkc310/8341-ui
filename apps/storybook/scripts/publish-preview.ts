/**
 * ローカルでビルドした Storybook を、GitHub Pages（gh-pages ブランチ）の PR 用ディレクトリに置く。
 *
 *   https://<owner>.github.io/<repo>/pr-preview/pr-<番号>/
 *
 * 使い方（リポジトリのルートで）
 *   make storybook-preview              # ビルドして、今のブランチの PR に公開する
 *   make storybook-preview PR=12     # ビルド済みのものを PR #12 に公開する
 *   make storybook-preview-remove PR=12   # PR #12 のプレビューを消す
 *
 * - PR 番号を省くと、今のブランチから開いている PR を探す（gh の REST API を使う）
 * - gh-pages ブランチは一時的な git worktree で扱い、作業ツリーには触らない。強制 push はしない
 *   （main の Storybook と他の PR のプレビューが同じブランチにあるため）
 * - 手順の全体は .claude/skills/ds-storybook-preview/SKILL.md
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const BRANCH = 'gh-pages';
const UMBRELLA = 'pr-preview';
const STATIC_DIR = resolve(import.meta.dirname, '../storybook-static');

const { values } = parseArgs({
  options: {
    pr: { type: 'string' },
    remove: { type: 'boolean', default: false },
  },
});

const run = (cmd: string, args: string[], cwd?: string) =>
  execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const git = (args: string[], cwd?: string) => run('git', args, cwd);
const tryGit = (args: string[], cwd?: string) => {
  try {
    git(args, cwd);
    return true;
  } catch {
    return false;
  }
};

function repoSlug(): { owner: string; repo: string } {
  const url = git(['remote', 'get-url', 'origin']);
  const m = url.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
  if (!m?.[1] || !m[2]) throw new Error(`origin が GitHub のリポジトリではありません: ${url}`);
  return { owner: m[1], repo: m[2] };
}

function findPr(owner: string, repo: string, branch: string): number {
  const out = run('gh', [
    'api',
    `repos/${owner}/${repo}/pulls?head=${owner}:${branch}&state=open`,
    '--jq',
    '.[0].number',
  ]);
  const n = Number(out);
  if (!out || !Number.isInteger(n)) {
    throw new Error(
      `ブランチ ${branch} の開いている PR が見つかりません。先に PR を作るか、--pr で番号を渡してください`,
    );
  }
  return n;
}

const { owner, repo } = repoSlug();
const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
const pr = values.pr ? Number(values.pr) : findPr(owner, repo, branch);
const sha = git(['rev-parse', '--short', 'HEAD']);
const url = `https://${owner}.github.io/${repo}/${UMBRELLA}/pr-${pr}/`;

if (!values.remove) {
  if (!existsSync(join(STATIC_DIR, 'index.html'))) {
    throw new Error('storybook-static がありません。先に `make build-storybook` を実行してください');
  }
  // プレビューが PR の内容と食い違わないよう、未コミット・未 push の変更があれば知らせる（止めはしない）
  if (git(['status', '--porcelain'])) console.warn('⚠ 未コミットの変更を含んだビルドを公開します');
  if (
    tryGit(['fetch', '--quiet', 'origin', branch]) &&
    git(['rev-parse', 'HEAD']) !== git(['rev-parse', `origin/${branch}`])
  ) {
    console.warn(`⚠ HEAD が origin/${branch} と一致しません。push してから公開すると、PR の差分とプレビューが揃います`);
  }
}

const work = mkdtempSync(join(tmpdir(), 'sb-preview-'));
try {
  if (tryGit(['fetch', '--quiet', 'origin', `${BRANCH}:refs/remotes/origin/${BRANCH}`])) {
    git(['worktree', 'add', '--quiet', '--detach', work, `origin/${BRANCH}`]);
  } else {
    // 初回: 空の gh-pages ブランチを作る
    git(['worktree', 'add', '--quiet', '--detach', work]);
    git(['checkout', '--quiet', '--orphan', BRANCH], work);
    git(['rm', '-rf', '--quiet', '--ignore-unmatch', '.'], work);
  }

  const target = join(work, UMBRELLA, `pr-${pr}`);
  rmSync(target, { recursive: true, force: true });
  if (!values.remove) cpSync(STATIC_DIR, target, { recursive: true });
  // Jekyll に _ で始まるファイルを消させない
  writeFileSync(join(work, '.nojekyll'), '');

  git(['add', '-A'], work);
  if (!git(['status', '--porcelain'], work)) {
    console.log('変更なし（すでに同じ内容が公開されています）');
  } else {
    const message = values.remove ? `preview: remove PR #${pr}` : `preview: PR #${pr} (${branch}@${sha})`;
    git(['-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', message], work);
    // 他の PR のプレビューや main の配信と競合したら、取り込み直して再試行する
    let pushed = false;
    for (let i = 0; i < 3 && !pushed; i++) {
      pushed = tryGit(['push', '--quiet', 'origin', `HEAD:${BRANCH}`], work);
      if (!pushed) {
        git(['fetch', '--quiet', 'origin', BRANCH], work);
        git(['rebase', '--quiet', `origin/${BRANCH}`], work);
      }
    }
    if (!pushed) throw new Error(`${BRANCH} への push に失敗しました`);
  }
  console.log(
    values.remove ? `✔ PR #${pr} のプレビューを消しました` : `✔ ${url}\n  （Pages への反映に 1〜2 分かかります）`,
  );
} finally {
  tryGit(['worktree', 'remove', '--force', work]);
  rmSync(work, { recursive: true, force: true });
}
