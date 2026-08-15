import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/polyfill.js', './tests/setup.ts'],
    exclude: ['**/node_modules/**', '**/.next/**'],
    // Heavy component tests (charts, task details, admin pages) can exceed the
    // default 5s under full-suite parallel load — raise the per-test cap.
    testTimeout: 20000,
    pool: 'threads',
    maxWorkers: '100%',
    minWorkers: 2,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        lines: 70,
      },
      include: [
        'utils/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/node_modules/**',
        '**/.next/**',
        'lib/apiData.ts',
        'lib/templatesData.ts',
        'lib/roadmapData.ts',
        'lib/devGuides.ts',
        'lib/auth/authOptions.ts',
        'lib/prisma.ts',
        'lib/api/server.ts',
        'lib/api/fetcher.ts',
        'lib/axios.ts',
        'lib/email.ts',
        'lib/error/**',
      ],
    },
    env: {
  API_BASE_URL: 'http://localhost:5000',
  NEXT_PUBLIC_API_URL: 'http://localhost:5000',
  NODE_ENV: 'test',
},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})