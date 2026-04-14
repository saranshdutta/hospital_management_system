import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // All /api/* calls → backend; direct calls also work via CORS
      '/auth':      { target: 'http://localhost:8000', changeOrigin: true },
      '/medicines': { target: 'http://localhost:8000', changeOrigin: true },
      '/orders':    { target: 'http://localhost:8000', changeOrigin: true },
      '/patients':  { target: 'http://localhost:8000', changeOrigin: true },
      '/hospitals': { target: 'http://localhost:8000', changeOrigin: true },
      '/admin':     { target: 'http://localhost:8000', changeOrigin: true },
      '/health':    { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
