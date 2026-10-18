import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    name: 'tokens',
    environment: 'node',
    include: ['scripts/**/*.test.ts'],
  },
});
