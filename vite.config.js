import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Proxy Roblox omni-search API (avoids CORS in development)
      '/roblox-api': {
        target: 'https://apis.roblox.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/roblox-api/, ''),
      },
      // Proxy Roblox thumbnails API
      '/roblox-thumbnails': {
        target: 'https://thumbnails.roblox.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/roblox-thumbnails/, ''),
      },
    },
  },
})
