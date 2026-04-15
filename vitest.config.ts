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
    pool: 'vmForks',
    env: {
  API_BASE_URL: 'http://localhost:5000',
  NEXT_PUBLIC_API_URL: 'http://localhost:5000',
},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})