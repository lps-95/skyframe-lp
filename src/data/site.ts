/* ==============================================================
   Configuração — é só aqui que se mexe no dia a dia
   Os pacotes saem do plano de gravações (os cinco roteiros do
   Campeche): é o roteiro que garante que a Skyframe sabe entregar
   o que promete. O TEXTO, porém, vende a ideia, não descreve o
   plano — quem lê quer saber o que ganha, não o que vamos filmar.
   Cada pacote tem um roteiro pronto por trás:

     01 Maré vazante      → Diária de lugar
     02 Deserto de vento  → Campanha de marca
     03 Trilha amanhecer  → Filme de lugar
     04 Manhã de bairro   → Conteúdo mensal
     05 Hora azul         → adicional de qualquer diária

   Casais ainda não está à venda — entra como lista de espera.
   ============================================================== */
export const site = {
  whatsapp: "5548991964517",
  telefone: "(48) 99196-4517",
  instagram: "skyframedia",
  cidade: "Florianópolis · SC",
  coordenada: "27°42'S 48°28'W",
  tagline: "Filmes que mostram a dimensão real da sua marca · Florianópolis",
  /* imagens ou vídeos das telas 1 a 5. Vazio = superfície em gradiente. */
  midia: ["", "", "", "", ""] as string[],
  msg: {
    geral:  "Oi! Vim pelo site da Skyframe. Quero um orçamento — me conta como funciona?",
    lugar:  "Oi! Vim pelo site da Skyframe. Quero filmar o meu lugar (pousada/restaurante/imóvel). Fica em: ",
    marca:  "Oi! Vim pelo site da Skyframe. Quero uma campanha para a minha marca. Minha marca é: ",
    filme:  "Oi! Vim pelo site da Skyframe. Quero um filme de lugar com aéreo. O lugar é: ",
    mensal: "Oi! Vim pelo site da Skyframe. Quero conteúdo mensal para o meu negócio. Meu negócio é: ",
    casal:  "Oi! Vim pelo site da Skyframe. Quero entrar na lista de espera dos ensaios de casal.",
  },
} as const

export type MsgKey = keyof typeof site.msg
export const wa = (k: MsgKey = "geral") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.msg[k])}`
export const ig = () => `https://instagram.com/${site.instagram}`

export const vitrine = [
  { id: "lugar", kick: "Pousadas e restaurantes", mega: "LUGAR", momento: "O seu lugar",
    titulo: ["O lugar que a foto ", "não dá conta"], tema: "noite" as const, evento: false,
    texto: "Quem escolhe um lugar decide primeiro pelo que sente. O filme mostra a luz, o caminho e a escala real do espaço — o que uma foto isolada não consegue contar. Você recebe um filme curto e clipes para continuar usando nas redes.",
    cta: "lugar" as MsgKey, preco: "R$ 750", ctaLabel: "Quero filmar o meu lugar", local: "Beira-mar · sul da ilha" },

  { id: "marca", kick: "Marcas", mega: "MARCAS", momento: "O lançamento",
    titulo: ["O lançamento que a sua ", "marca merecia"], tema: "meio" as const, evento: false,
    texto: "A sua coleção merece uma imagem à altura do lançamento. Locação, direção de cena e cor são pensadas plano a plano para construir presença — em 16:9 e também nos cortes verticais do mesmo material.",
    cta: "marca" as MsgKey, preco: "R$ 1.800", ctaLabel: "Quero uma campanha", local: "Dunas · costa leste" },

  { id: "filme", kick: "Turismo e alto padrão", mega: "FILME", momento: "A história",
    titulo: ["Um filme com ", "começo, meio e fim"], tema: "profundo" as const, evento: false,
    texto: "Imagem bonita chama atenção. História faz ficar: começo, travessia e chegada. É o filme que transforma um lugar em experiência e faz a pessoa querer estar ali.",
    cta: "filme" as MsgKey, preco: "R$ 1.200", ctaLabel: "Quero esse filme", local: "Costão sul" },

  { id: "mensal", kick: "Conteúdo mensal", mega: "MENSAL", momento: "O dia a dia",
    titulo: ["O seu trabalho, filmado ", "todo mês"], tema: "base" as const, evento: false,
    texto: "Uma diária por mês transforma a rotina do seu negócio em oito filmes curtos prontos. O mesmo cuidado de luz, cor e som de uma campanha, aplicado ao que você já faz todos os dias.",
    cta: "mensal" as MsgKey, preco: "R$ 890/mês", ctaLabel: "Quero conteúdo todo mês", local: "Campeche · Florianópolis" },
]

export const servicos = [
  { key: "lugar"  as MsgKey, tag: "Pousadas e imóveis", nome: "Diária de lugar",   preco: "R$ 750",   unidade: "/diária", evento: false,
    para: "Pousada, restaurante, imóvel e corretor",
    itens: ["Filme de 60 s pronto para o anúncio", "15 clipes de 6 s para as redes", "Planos aéreos e fotos em 4K"] },

  { key: "mensal" as MsgKey, tag: "Recorrente",         nome: "Conteúdo mensal",   preco: "R$ 890",   unidade: "/mês",    evento: false,
    para: "Café, estúdio, clínica e loja de bairro",
    itens: ["8 filmes curtos por mês", "Uma diária no seu local", "Cortes verticais e legendas"] },

  { key: "filme"  as MsgKey, tag: "Turismo",            nome: "Filme de lugar",    preco: "R$ 1.200", unidade: "/filme",  evento: false,
    para: "Turismo e imóvel de alto padrão",
    itens: ["Filme narrativo de 90 s", "Planos aéreos na melhor luz do dia", "Som do lugar, gravado no local"] },

  { key: "marca"  as MsgKey, tag: "Marcas",             nome: "Campanha de marca", preco: "R$ 1.800", unidade: "/dia",    evento: false,
    para: "Moda, joias e lançamento de coleção",
    itens: ["Dia completo de produção", "Filme de campanha de 30 s", "20 clipes 16:9 e 9:16"] },
]

/* Ainda não está à venda. Fica visível de propósito: quem procura já
   se cadastra, e o dia em que abrir a página não precisa mudar de forma. */
export const emBreve = {
  tag: "Em breve",
  nome: "Casais e ensaios",
  texto: "Estamos fechando o roteiro e a agenda. Entre na lista e você fica sabendo antes de abrir.",
  cta: "casal" as MsgKey,
  ctaLabel: "Entrar na lista",
}

/* Adicional que qualquer diária pode receber — o roteiro 05. */
export const adicional = {
  nome: "Hora azul",
  texto: "A janela curta depois do pôr do sol, quando o céu ainda tem cor e as luzes já acenderam. É a hora mais bonita e a mais difícil — cabe em qualquer diária, combinada antes.",
}

export const passos = [
  { n: "01", t: "A conversa", d: "Você conta que momento é esse, onde e quando. Em até um dia útil recebe a proposta com o valor já fechado." },
  { n: "02", t: "O roteiro", d: "Mandamos locação, hora da luz e cada plano por escrito. Nada é gravado antes do seu sim." },
  { n: "03", t: "A diária", d: "Chegamos com tudo decidido. Sua diária é curta porque nenhuma escolha é feita no improviso." },
  { n: "04", t: "A sala escura", d: "Montagem, cor e som. Em até 10 dias você recebe por link, pronto — sem arquivo bruto para resolver." },
]

export const entregaveis = [
  { v: "16:9", t: "O filme principal",    d: "Pronto para o site, o anúncio e a apresentação. Cor e som já tratados." },
  { v: "9:16", t: "Reels e Stories",      d: "Os cortes verticais saem no mesmo pacote. Você não paga a mais por isso." },
  { v: "4K",   t: "Qualidade de sobra",   d: "Dá para reenquadrar e reaproveitar o ano inteiro sem perder nitidez." },
  { v: "10",   t: "Dias, no máximo",      d: "Prazo registrado na proposta para você saber exatamente quando o material chega." },
]

export const objecoes = [
  { t: "Choveu, não custa nada",        d: "Remarcamos sem cobrar. Luz ruim não vira vídeo bom, e a gente não entrega o que não presta." },
  { t: "Preço fechado antes",           d: "O valor vai por escrito na proposta e não muda depois. Metade na aprovação, metade na entrega." },
  { t: "Uma rodada de ajustes inclusa", d: "Você aprova o plano antes de gravarmos e ainda tem ajustes na edição, já no preço." },
]

export const dupla = [
  { nome: "Anderson", papel: "Direção, câmera e drone. Cuida do plano de gravação, da edição e da cor." },
  { nome: "Esther",   papel: "Direção de cena e presença em frente à câmera. Conduz quem nunca gravou." },
]

export const duvidas = [
  { q: "Quanto custa, na real?",       a: "De R$ 750 a diária de lugar a R$ 1.800 o dia de campanha. O valor fecha na proposta, por escrito, antes de qualquer gravação — e não muda depois." },
  { q: "Em quanto tempo eu recebo?",   a: "Até 10 dias corridos para diárias e campanhas. O pacote mensal entrega a cada quinzena." },
  { q: "Como funciona o pagamento?",   a: "Metade na aprovação do plano e metade na entrega. Sem sinal antes de você aprovar o que vai ser gravado." },
  { q: "E se o vento não deixar voar?", a: "Existe roteiro sem drone para todo pacote — luz, movimento e detalhe resolvem o dia. Se o aéreo era essencial, remarcamos só a parte aérea, sem custo." },
  { q: "Serve para anúncio e portal?", a: "Serve. Você recebe o filme em 16:9 e os cortes verticais no mesmo pacote, prontos para portal, site e redes." },
  { q: "Vocês atendem onde?",          a: "Toda Florianópolis. Somos do Campeche, então o sul da ilha é o nosso quintal. Fora da ilha, combinamos o deslocamento." },
]
