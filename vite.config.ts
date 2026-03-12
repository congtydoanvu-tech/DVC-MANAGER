import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false // Cho phép Vite đọc file ở thư mục gốc
    }
  }
})
