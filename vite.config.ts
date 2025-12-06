import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '../../',
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 9003, // [2025-11-26] - Updated to match PORT_ALLOCATION_STANDARD.md
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
})
