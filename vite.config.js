import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ejar.salasah.sa',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/frappe': {
        target: 'https://ejar.salasah.sa',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/frappe/, '')
      }
    }
  }
}) 