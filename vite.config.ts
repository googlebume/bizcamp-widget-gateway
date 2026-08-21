import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const widgetRoot = path.resolve(import.meta.dirname, '../react-widget-bizcamp')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@bizcamp-widget': path.resolve(widgetRoot, 'src'),
      '@bizcamp-backend': path.resolve(widgetRoot, 'convex'),
    },
    dedupe: ['react', 'react-dom', 'convex', '@convex-dev/auth'],
  },
  optimizeDeps: {
    include: ['@convex-dev/auth/react', 'convex/react'],
  },
  server: {
    fs: {
      allow: [path.resolve(import.meta.dirname), widgetRoot],
    },
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
