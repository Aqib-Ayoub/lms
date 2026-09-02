import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Required for Docker: bind to all interfaces so the container port
    // mapping (5173:5173) can reach the Vite dev server.
    host: true,
    // Polling is needed for hot-module-replacement to work reliably
    // when the source code is mounted as a Docker volume on Linux/macOS.
    watch: {
      usePolling: true,
    },
  },
});
