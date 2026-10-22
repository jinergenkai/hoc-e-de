import { defineConfig } from 'vite';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react-swc';

// base './' so the built files load from file:// inside Electron
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default defineConfig({
  base: './',
  plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  resolve: { alias: { src: path.resolve(__dirname, 'src') } },
  server: { port: 5173 },
  test: { environment: 'node' },
} as any);
