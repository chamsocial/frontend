import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

const dir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: process.env.BUILD_PATH || 'build',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(dir, 'src'),
    },
  },
  server: {
    port: 4074,
    open: true,
  },
});
