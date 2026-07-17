import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The @msbc/data-layer axios instance has no baseURL, so it sends requests to
// the SAME origin using relative paths like "/api/v1/doctors". This proxy
// forwards anything starting with /api to the Express backend on port 4000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
