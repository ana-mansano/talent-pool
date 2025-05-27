import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true // Isso força o Vite a usar a porta 3000 ou falhar
  }
}) 