import { defineConfig } from 'vite';
import { renderSeo } from './src/seo.js';

export default defineConfig({
  base: process.env.BASE_PATH || '/gandia/',
  plugins: [{ name: 'static-seo', transformIndexHtml: { order: 'pre', handler: renderSeo } }],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  build: { target: 'es2022', sourcemap: false },
});
