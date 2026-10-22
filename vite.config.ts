import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react-swc';

// base './' so the built files load from file:// inside Electron
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: { alias: { src: path.resolve(__dirname, 'src') } },
  server: { port: 5173 },
  test: { environment: 'node' },
} as any);
