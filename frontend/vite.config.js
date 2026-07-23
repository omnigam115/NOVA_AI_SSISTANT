import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the NOVA AI Assistant frontend.
// The dev server runs on port 5173 and proxies API calls are handled
// via the VITE_API_BASE_URL environment variable instead of a proxy,
// so the frontend can point at any backend origin without code changes.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
})
