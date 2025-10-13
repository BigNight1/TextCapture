import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5176,
    allowedHosts: [
      'localhost',
      '.ngrok.io',
      '.ngrok-free.app',
      '.ngrok.app'
    ],
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none'
    }
  }
})
