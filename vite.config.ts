import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// SINGLE=1 gera um único index.html com tudo embutido (para publicar como página avulsa).
// Sem a variável, é um build normal do Vite, pronto para Vercel/Netlify.
const single = process.env.SINGLE === '1'

export default defineConfig({
  plugins: [react(), tailwindcss(), ...(single ? [viteSingleFile()] : [])],
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  build: { cssCodeSplit: !single, assetsInlineLimit: single ? 100_000_000 : 4096 },
})
