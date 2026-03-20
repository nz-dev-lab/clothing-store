import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: 'src/bulk-order/main.tsx',
      name: 'BulkOrder',
      fileName: () => 'bulk-order.js',
      formats: ['iife'],
    },
    outDir: 'assets/js',
    emptyOutDir: false,
  },
})
