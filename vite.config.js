import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api to the Express backend so the session cookie stays same-origin in dev.
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, strictPort: true, proxy: { '/api': { target: 'http://localhost:4000', changeOrigin: true } } },
});
