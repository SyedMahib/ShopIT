import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const rootDir = new URL('.', import.meta.url).pathname

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: 'react', replacement: path.resolve(rootDir, 'node_modules/react') },
      { find: 'react-dom', replacement: path.resolve(rootDir, 'node_modules/react-dom') },
      {
        find: 'lucide-react',
        replacement: path.resolve(rootDir, 'node_modules/lucide-react/dist/esm/lucide-react.mjs'),
      },
    ],
  },
  server: {
    proxy: {
      // Forward API calls to the Express backend during development
      '/api': 'http://localhost:3000',
    },
  },
})
