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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), htmlFromConfig()],
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
