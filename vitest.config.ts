import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      include: [
        'src/modules/travel-catalog/domain/**/*.ts',
        'src/modules/travel-catalog/application/**/*.ts',
        'src/modules/travel-catalog/infrastructure/ArticleMapper.ts',
        'src/modules/travel-catalog/infrastructure/PostgresArticleRepository.ts',
        'app/actions/**/*.ts',
        'lib/utils.ts',
        'hooks/use-mobile.ts',
        'components/ui/**/*.tsx',
        'src/modules/travel-catalog/presentation/**/*.tsx',
        'src/modules/admin-auth/**/*.ts',
        'src/modules/admin-auth/**/*.tsx',
        'src/modules/admin-management/**/*.ts',
        'src/modules/admin-management/**/*.tsx',
      ],
      exclude: [
        'src/modules/travel-catalog/infrastructure/seed.ts',
        'src/modules/travel-catalog/domain/IArticleRepository.ts',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        'test/**',
      ],
    },
  },
});
