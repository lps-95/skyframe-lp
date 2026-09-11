import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath } from 'node:url'

const single = process.env.SINGLE === '1'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const configured = env.SITE_URL?.trim()
  let siteUrl = ''
  if (configured) {
    const url = new URL(configured)
    if (url.protocol !== 'https:' || url.search || url.hash || url.username || url.password) {
      throw new Error('SITE_URL deve ser uma URL HTTPS pública, sem parâmetros ou fragmentos.')
    }
    siteUrl = url.href.endsWith('/') ? url.href : url.href + '/'
  }
  const xml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  return {
    plugins: [
      react(), tailwindcss(), ...(single ? [viteSingleFile()] : []),
      {
        name: 'skyframe-seo',
        transformIndexHtml() {
          return siteUrl ? [
            { tag: 'link', attrs: { rel: 'canonical', href: siteUrl }, injectTo: 'head' as const },
            { tag: 'meta', attrs: { property: 'og:url', content: siteUrl }, injectTo: 'head' as const },
          ] : []
        },
        generateBundle() {
          if (!siteUrl) this.warn('SITE_URL ausente: configure o domínio para gerar canonical e sitemap.')
          this.emitFile({
            type: 'asset', fileName: 'robots.txt',
            source: 'User-agent: *\nAllow: /\n' + (siteUrl ? 'Sitemap: ' + siteUrl + 'sitemap.xml\n' : ''),
          })
          if (siteUrl) this.emitFile({
            type: 'asset', fileName: 'sitemap.xml',
            source: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + xml(siteUrl) + '</loc></url></urlset>',
          })
        },
      },
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: { cssCodeSplit: !single, assetsInlineLimit: single ? 100_000_000 : 4096 },
  }
})
