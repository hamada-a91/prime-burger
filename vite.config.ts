import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { websiteConfig } from './src/config/website.config'

function htmlFromConfig() {
  return {
    name: 'html-from-config',
    transformIndexHtml(html: string) {
      return html
        .replaceAll('%TITLE%', websiteConfig.site.name)
        .replaceAll('%THEME_COLOR%', websiteConfig.site.themeColor)
    },
  }
}

// Frontend und API laufen lokal auf verschiedenen Ports. Der Proxy macht beides same-origin,
// damit relative URLs (/api, /storage) funktionieren und kein CORS nötig ist.
const backend = process.env.BACKEND_URL || 'http://localhost:8000'
const apiProxy = {
  '/api': { target: backend, changeOrigin: true },
  '/sanctum': { target: backend, changeOrigin: true },
  '/storage': { target: backend, changeOrigin: true },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), htmlFromConfig()],
  server: {
    host: true,
    port: 5173,
    // Lieber abbrechen als still auf 5174/5175 ausweichen (Backend-CORS/Sanctum kennen nur feste Ports).
    strictPort: true,
    // Erlaubt Tunnel-Hosts (ngrok, trycloudflare) für Demos.
    allowedHosts: true,
    proxy: apiProxy,
  },
  // `vite preview` liefert den Produktions-Build samt Proxy: die Basis für den Demo-Tunnel (npm run demo).
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: true,
    proxy: apiProxy,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
