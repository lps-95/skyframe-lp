# SEO, Analytics e divulgação da Skyframe

## Publicação
O build de produção utiliza .env.production com o domínio e o ID público do GA4 confirmados pelo responsável. As variáveis configuradas na hospedagem têm prioridade; confira se não há valores antigos na Vercel.
Ao mudar de domínio, atualize SITE_URL e publique novamente. O build gera canonical, og:url, robots.txt e sitemap.xml. Se hospedar em subpasta, configure também base no Vite e disponibilize robots.txt na raiz do domínio.

## Google Analytics
O Google Analytics só carrega depois de aceitar a medição. Recusar mantém o site utilizável; o botão Privacidade permite alterar a escolha.
Eventos: page_view e contact_click. O parâmetro contact_method distingue whatsapp de instagram e section identifica a seção. Um clique não comprova mensagem enviada, orçamento ou venda.
No fluxo Web do GA4, desative a medição otimizada automática (principalmente cliques de saída, histórico e formulários) para evitar coleta duplicada e URLs com conteúdo desnecessário. O código envia a visualização sem query string e não envia a mensagem do WhatsApp.
Na produção: abra uma janela privada, recuse e confirme ausência de chamadas para googletagmanager.com e google-analytics.com; aceite em Privacidade e confira page_view e contact_click em Tempo real. Teste também revogar e recarregar. Bloqueadores podem impedir os eventos.
A preferência é salva no navegador. Revogar bloqueia novas medições após recarregar, mas não apaga dados anteriormente enviados ao Google nem garante a remoção de cookies anteriores.
Antes de anunciar, publique uma política de privacidade com os dados e o contato reais do responsável e a informação sobre o uso do Google Analytics.

## Google Search Console
Verifique a propriedade https://skyframe-lp.vercel.app/ com sua conta. Envie https://skyframe-lp.vercel.app/sitemap.xml e inspecione a página inicial após a publicação.
O site ainda depende de JavaScript para seu conteúdo principal; pré-renderização é uma melhoria futura. Não há garantia de posição na busca.
Adicione fotos e vídeos reais do portfólio: os campos de mídia atuais estão vazios. Defina uma imagem de compartilhamento real antes de configurar og:image.

## Perfil da Empresa
Use o perfil existente, se houver, para evitar duplicidade. Nome: Skyframe, conforme a identidade real do negócio. Confirme a categoria disponível que melhor representa produção de vídeo. Preencha telefone, site, serviços, fotos próprias e área atendida em Florianópolis. Se atende no local do cliente e não recebe clientes em casa, configure área de atendimento sem exibir endereço residencial.
Descrição sugerida:
Skyframe é uma produtora audiovisual em Florianópolis, com base no Campeche. Produzimos filmes para pousadas, restaurantes, imóveis e marcas, com direção de cena, captação terrestre e imagens aéreas. Oferecemos diárias de produção, filmes de lugares, campanhas e conteúdo mensal, com material editado para sites, anúncios e redes sociais. Solicite um orçamento pelo WhatsApp.

## Rascunho de campanha de Pesquisa — não publicado
Objetivo: contatos interessados em produção audiovisual. Região inicial: Florianópolis, usando presença na região, após confirmar área e orçamento com o responsável.
Grupos sugeridos: produtora audiovisual; filmagem com drone; vídeos para pousadas e imóveis. Começar com correspondência de frase/exata e revisar termos de pesquisa.
Palavras-chave: "produtora audiovisual florianópolis", "produção de vídeo florianópolis", "filmagem com drone florianópolis", "vídeo para pousada", "filmagem de imóveis florianópolis".
Negativas iniciais para revisar: emprego, vaga, curso, salário, grátis, comprar drone, conserto de drone.
Títulos:
- Produtora em Florianópolis
- Filmagem com Drone
- Vídeos Para Seu Negócio
- Skyframe Audiovisual
- Peça Seu Orçamento
Descrições:
- Filmes para pousadas, imóveis e marcas. Produção audiovisual em Florianópolis.
- Direção, captação e edição. Fale com a Skyframe e solicite seu orçamento.
Destino: https://skyframe-lp.vercel.app/
Orçamento e publicação pendentes de definição. Não otimizar a campanha para visitas ou cliques no Instagram. Se importar o clique de WhatsApp como conversão, identifique-o como clique de contato; valide a qualidade dos contatos antes de ampliar o investimento.

## Busca por videomaker
Termo principal: videomaker em Florianópolis. Incluído no título, H1 visível, descrição e compartilhamento social.
Termos complementares: produção de vídeos, filmagem com drone, edição de vídeo e produtora audiovisual.
Adicionar à campanha um grupo de videomaker com "videomaker florianópolis" e "contratar videomaker florianópolis". Títulos adicionais: Videomaker em Florianópolis; Contrate Um Videomaker.
