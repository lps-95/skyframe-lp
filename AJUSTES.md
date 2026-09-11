# Skyframe — ajustes aplicados

## Implementado

- Correção do `usePointer`: agora existe um único listener de `pointermove` e um único par de springs compartilhado pelo app.
- `prefers-reduced-motion` ampliado: entradas, varredura, transições e indicador de avanço deixam de insistir em animações quando o usuário pede menos movimento.
- Claquete completa apenas uma vez por sessão; retornos na mesma sessão entram direto na landing.
- Tokens de foco do accordion corrigidos para a paleta real (`gelo` / `grafite`).
- CTA fixo mais comercial: “Falar com a Skyframe”.
- Hero reposicionado para uma promessa mais proprietária: “O seu negócio merece ser visto por inteiro”.
- Copy das vitrines reduzida e refinada; telas 2–5 trabalham desejo e a tela de preços concentra decisão.
- CTAs dos serviços contextualizados em vez de “Quero este”.
- Texto da dupla refinado para comunicar atendimento direto sem desvalorizar estruturas maiores.
- Prazo de entrega reescrito para eliminar a expressão ambígua “não paga a diferença”.
- Vídeos usam `preload="metadata"`.
- Camadas técnicas ficam mais discretas quando existe mídia real e a varredura é removida sobre foto/vídeo.
- SEO base ampliado: title, description, robots, theme-color, Open Graph, Twitter metadata e Schema.org `ProfessionalService`.
- `package-lock.json` sincronizado com a versão 1.0.0 do projeto.
- Atributos `data-cta` adicionados em pontos principais para facilitar instrumentação futura.

## Falta apenas conteúdo/infra que não estava nos arquivos

1. Inserir fotos/vídeos reais em `src/data/site.ts -> midia`.
2. Depois que o domínio existir, adicionar `<link rel="canonical">` e `og:url`.
3. Definir uma imagem de compartilhamento e adicionar `og:image` / `twitter:image`.
4. Instalar a ferramenta de analytics escolhida e ligar os eventos aos atributos `data-cta`.
5. Adicionar favicon quando o ativo final da marca estiver definido.

## Validação

Foi executada checagem sintática com o TypeScript disponível no ambiente; não apareceram erros de sintaxe nas alterações. O `npm run build` completo não pôde ser concluído neste ambiente porque a instalação das dependências npm ficou indisponível/expirou. Em uma máquina com acesso ao registry, rode:

```bash
npm install
npm run build
npm run lint
```
