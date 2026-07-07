import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // react-force-graph-3d's stack must share a single THREE instance —
    // two copies render a silently black scene
    dedupe: ['three'],
  },
  server: {
    host: true, // expose on LAN so the phone can reach it over home WiFi
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5175',
    },
  },
})
