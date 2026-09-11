# Skyframe — landing page

Identidade conforme o **Manual de Identidade Visual · 2026**
(grafite #0B0E13 · azul meia-noite #16233F · branco gelo #F5F7FA · ciano gelo #5EEAD4).

Apresentação em 11 telas cheias, com passagem cinematográfica.
Vite + React + TypeScript + Tailwind v4 + Framer Motion + shadcn/ui.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
```

## Publicar

```bash
npm run build      # dist/ pronto para Vercel, Netlify ou qualquer host estático
npm run build:one  # um único index.html com tudo embutido
npm run preview
```

Na Vercel: importe o repositório, framework **Vite**, e pronto — não precisa configurar nada.

## Onde mexer

| O quê | Arquivo |
|---|---|
| WhatsApp, Instagram, textos, preços, serviços | `src/data/site.ts` |
| **Fotos e vídeos das telas 1 a 5** | `src/data/site.ts` → `midia` |
| Cores, fontes e escala tipográfica do manual | `src/index.css` (`@theme`) |
| Logotipo (SKY bold + FRAME light) | `src/components/Logo.tsx` |
| Curvas e tempos de animação | `src/lib/motion.ts` |
| A tela (tarjas, planos, parallax) | `src/components/Screen.tsx` |
| Moldura fixa (trilho, contador, progresso) | `src/components/Chrome.tsx` |
| Ordem das telas e conteúdo | `src/App.tsx` |

### Colocar as imagens

Ponha os arquivos em `src/assets/` e importe:

```ts
import abertura from "@/assets/abertura.jpg"
import casais from "@/assets/casais.jpg"

export const site = {
  midia: [abertura, casais, "", "", ""],
  ...
}
```

Aceita `.jpg`, `.png`, `.mp4` e `.webm`. Vídeo entra em laço, mudo, sem controles.

## shadcn/ui

`components.json` está configurado (estilo new-york, alias `@/components`).
Os componentes já vendorizados ficam em `src/components/ui/`: `button`, `card`, `badge`, `accordion`.

Para adicionar outros:

```bash
npx shadcn@latest add dialog sheet tooltip
```

## Arquitetura de movimento

**Regra:** só camadas de fundo se movem no parallax; conteúdo nunca.
Cada plano percorre no máximo metade da própria folga (é mais alto que a
janela onde vive), então não há como aparecer borda em nenhuma tela.

- `useScroll` + `useSpring` → parallax amortecido, sem rigidez
- `usePointer` → planos seguem o cursor com mola (desktop)
- `whileInView` + `staggerChildren` → entrada encenada por tela
- `animate()` → passagem entre telas em 1,25 s com curva longa

No toque, a passagem é a nativa do navegador (`scroll-snap`): mexer nisso
é o que costuma travar a rolagem no celular.

## Regras do manual aplicadas no código

- **Ciano gelo (#5EEAD4) só em conteúdo de eventos.** No código isso é a flag
  `evento: true` em `src/data/site.ts`. Ela liga a variante `evento` do Button,
  do Badge e da superfície da tela. Nenhuma outra tela usa ciano.
- **Logotipo sem símbolo**, "SKY" 700 + "FRAME" 300, mínimo de 120px, sem sombra,
  contorno ou brilho (`Logo.tsx`).
- **Tons derivados**: profundidade feita com opacidade do azul meia-noite,
  sem introduzir cor nova (`Card`, superfícies em `Screen.tsx`).
- **Escala tipográfica**: H1 50 / H2 36 / H3 26 / corpo 18 / caption 13,
  com `clamp()` para telas menores e teto nos valores oficiais.
- **Três papéis de tipo**: Space Grotesk (marca e títulos), Inter (corpo),
  IBM Plex Mono (dados técnicos: coordenada, numeração de tela, specs).

## Desempenho — regras que não podem ser quebradas

A página anima muitas camadas grandes ao mesmo tempo. Quatro regras
seguram a taxa de quadros (medida antes/depois: **8,6 → 48,5 fps**):

1. **Animar só `transform` e `opacity`.** Foram removidos `filter: blur()`
   (repinta a camada inteira) e `letter-spacing` (força reflow). O título
   revela palavra a palavra dentro de máscaras — puro transform.
2. **Textura como ladrilho SVG, nunca `repeating-*-gradient`.** As grades e as
   curvas de nível eram gradientes repetidos e sozinhas custavam metade da
   taxa de quadros; como imagem SVG o navegador rasteriza um ladrilho e repete.
3. **Uma leitura de rolagem para a página toda.** Cada tela tinha um `useScroll`
   próprio — 12 leituras de layout por quadro enquanto a animação escrevia
   `scrollTop`. Agora o palco publica um `MotionValue` e cada tela deriva a
   própria posição por cálculo.
4. **Planos montam só perto do quadro.** 5 camadas × 12 telas = 60 camadas de
   GPU. Um IntersectionObserver com `rootMargin: 90%` monta apenas as vizinhas.

Também: um único ouvinte de `pointermove` compartilhado por contexto, e as
tarjas do letterbox animam `scaleY` em vez de `height`.
