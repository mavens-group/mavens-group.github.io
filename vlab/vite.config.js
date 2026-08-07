import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/vlab/',
  server: {
    proxy: {
      '/vlab/api': 'http://127.0.0.1:8787',
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
