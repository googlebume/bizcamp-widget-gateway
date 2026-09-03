import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const vendorBackend = path.resolve(
  import.meta.dirname,
  'vendor/bizcamp-backend',
)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@bizcamp-backend': vendorBackend,
    },
    dedupe: ['react', 'react-dom', 'convex', '@convex-dev/auth'],
  },
  optimizeDeps: {
    include: ['@convex-dev/auth/react', 'convex/react'],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        'widget-demo': path.resolve(import.meta.dirname, 'widget-demo.html'),
      },
    },
  },
})
