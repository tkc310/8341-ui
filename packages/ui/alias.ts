import { resolve } from 'node:path';

const src = resolve(import.meta.dirname, 'src');

/**
 * shadcn 方式の import パス（@/components/ui/*, @/lib/*）をリポジトリ内の実体に向ける。
 * packages/ui と apps/storybook の vite.config.ts で共有する（tsconfig の paths と同じ対応）。
 */
export const alias = [
  { find: /^@\/components\/ui\/(.*)$/, replacement: `${src}/components/$1` },
  { find: /^@\/lib\/(.*)$/, replacement: `${src}/lib/$1` },
];
