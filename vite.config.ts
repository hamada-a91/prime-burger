import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { websiteConfig } from './src/config/website.config'

function htmlFromConfig() {
  return {
    name: 'html-from-config',
    transformIndexHtml(html: string) {
      return html
        .replaceAll('%LANG%', websiteConfig.site.language)
        .replaceAll('%TITLE%', websiteConfig.site.name)
        .replaceAll('%DESCRIPTION%', websiteConfig.site.description)
        .replaceAll('%FAVICON%', websiteConfig.site.logo.favicon)
        .replaceAll('%THEME_COLOR%', `hsl(${websiteConfig.tokens.colors.primary})`)
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
