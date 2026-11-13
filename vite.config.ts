import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base relativo: la build funziona su qualunque hosting statico (anche in sottocartella).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2022', chunkSizeWarningLimit: 1500 },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
