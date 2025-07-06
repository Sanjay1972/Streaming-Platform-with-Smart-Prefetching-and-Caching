import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,          // you can change port if needed
    open: true,          // auto-open browser
  },
  resolve: {
    alias: {
      '@': '/src',       // allows you to use `@/components/...`
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,     // helpful for debugging production builds
  },
});
