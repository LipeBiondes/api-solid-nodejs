import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    workspace: [
      {
        plugins: [tsconfigPaths()],
        test: {
          include: ['src/http/controllers/e2e/*.spec.ts'],
          name: 'e2e',
          environment: 'node',
          sequence: {
            shuffle: true,
            concurrent: false,
          },
          setupFiles: ['src/lib/setup.ts'],
        },
      },
      {
        plugins: [tsconfigPaths()],
        test: {
          include: ['src/use-cases/unit/*.spec.ts'],
          name: 'unit',
          environment: 'node',
        },
      },
    ],
  },
});
