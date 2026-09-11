import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion"
import { usePalco } from "./ScrollContext"
import { usePointer } from "@/lib/usePointer"
import { cn } from "@/lib/utils"
import { stage } from "@/lib/motion"

/* ==============================================================
   Screen — uma tela cheia.
   Conforme o manual: sem ornamento nostálgico (grão, perfuração,
   tipografia gigante decorativa). Só o que é técnico e serve à
   leitura — enquadramento, grade, escala e coordenada.
   Regra de movimento: só os planos se movem. Conteúdo nunca.
   ============================================================== */

const superficies = {
  /* tons derivados do azul meia-noite sobre grafite — sem cor nova */
  profundo: "bg-[linear-gradient(180deg,#0B0E13_0%,#101827_58%,#16233F_100%)]",
  noite:    "bg-[linear-gradient(180deg,#0B0E13_0%,#16233F_62%,#1B2C4E_100%)]",
  meio:     "bg-[linear-gradient(180deg,#0B0E13_0%,#0F1725_60%,#16233F_100%)]",
  base:     "bg-[linear-gradient(180deg,#0B0E13_0%,#0D1219_60%,#111A2B_100%)]",
  /* única superfície que admite ciano — conteúdo de eventos */
  evento:   "bg-[linear-gradient(180deg,#0B0E13_0%,#132A3C_58%,#16233F_100%)]",
} as const
export type Superficie = keyof typeof superficies

type Props = {
  id: string
  indice: number
  superficie?: Superficie
  evento?: boolean
  enquadre?: boolean
  marca?: string          /* palavra gigante em contorno — o plano mais rápido */
  midia?: string
  center?: boolean
  /* assimetria: o conteúdo encosta num lado do quadro em vez de ficar sempre no eixo */
  alinha?: "esq" | "dir"
  /* diagonal de luz — quebra a leitura retangular da tela */
  feixe?: "esq" | "dir"
  slateL?: ReactNode; slateR?: ReactNode
  rodapeL?: ReactNode; rodapeR?: ReactNode
  children: ReactNode
}

/* ==============================================================
   Tamanho da palavra gigante do fundo.

   Antes era fixo — clamp(120px, 26vw, 380px) — com nowrap. Como a
   largura de uma palavra é (nº de letras × tamanho da fonte), tamanho
   fixo significa que quanto mais longa a palavra, mais ela estoura o
   quadro: "SEM RISCO" (9) ocupava quase o dobro de "FALE" (4), e no
   celular a mínima de 120px sozinha já jogava as letras para fora.

   Agora é o contrário: fixamos a LARGURA que a palavra deve ocupar
   (86% do quadro) e o tamanho da fonte sai daí. Assim todas as telas
   têm a mesma presença visual, seja qual for a palavra.

   Este é só o palpite inicial, para a palavra não nascer no tamanho
   errado e pular: 0.64em é o avanço médio de uma maiúscula da Space
   Grotesk bold já descontado o tracking-tight, e 86 / 0.64 ≈ 134.
   Quem dá a palavra final é a medição real, no hook abaixo — assim
   vale para a fonte que de fato carregar, inclusive a de reserva.
   ============================================================== */
export function tamanhoMarca(palavra: string) {
  const n = Math.max(3, palavra.trim().length)
  return `clamp(34px, ${(134 / n).toFixed(2)}vw, ${Math.round(2150 / n)}px)`
}

/* Mede a palavra a 100px e deduz o tamanho que a faz ocupar a largura
   alvo do quadro. Roda na montagem, ao redimensionar e quando a fonte
   termina de carregar — nunca durante a rolagem. */
function useMarcaAjustada(marca: string | undefined, ativo: boolean) {
  const ref = useRef<HTMLSpanElement>(null)
  const [tamanho, setTamanho] = useState<string>(() => tamanhoMarca(marca ?? ""))

  useEffect(() => {
    if (!marca || !ativo) return
    const ajusta = () => {
      const el = ref.current
      const largura = el?.parentElement?.getBoundingClientRect().width ?? 0
      if (!el || !largura) return
      const guardado = el.style.fontSize
      el.style.fontSize = "100px"
      const larguraA100 = el.getBoundingClientRect().width
      el.style.fontSize = guardado
      if (!larguraA100) return
      const ideal = (100 * largura * 0.8) / larguraA100
      setTamanho(`${Math.round(Math.min(560, Math.max(34, ideal)))}px`)
    }
    ajusta()
    document.fonts?.ready.then(ajusta).catch(() => {})
    window.addEventListener("resize", ajusta)
    return () => window.removeEventListener("resize", ajusta)
  }, [marca, ativo])

  return { ref, tamanho }
}

function Plano({ y, className, children }: { y: MotionValue<number>; className?: string; children?: ReactNode }) {
  return (
    <motion.div style={{ y }} className={cn("pointer-events-none absolute -left-[2%] -right-[2%]", className)}>
      {children}
    </motion.div>
  )
}

export function Screen({
  id, indice, superficie = "base", evento, enquadre, marca, midia, center, alinha, feixe, children,
  slateL, slateR, rodapeL, rodapeR,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduz = useReducedMotion()
  const palco = usePalco()
  const { mx } = usePointer()

  /* DESEMPENHO: os planos são camadas grandes de GPU. Manter as 12 telas
     com tudo montado custa memória de vídeo e derruba a taxa de quadros.
     Aqui eles só existem quando a tela está a menos de um quadro de distância. */
  const [perto, setPerto] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !("IntersectionObserver" in window)) { setPerto(true); return }
    const io = new IntersectionObserver(
      ([e]) => setPerto(e.isIntersecting),
      { root: palco?.ref.current ?? null, rootMargin: "90% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [palco])

  /* a palavra do fundo só é medida depois de montada — daí depender de `perto` */
  const marcaAjuste = useMarcaAjustada(marca, perto)

  /* progresso desta tela derivado do valor único do palco: puro cálculo,
     zero leitura de layout. 0 = entrando por baixo, 1 = saindo por cima. */
  const h = palco?.altura || 1
  const bruto = useTransform(palco?.y ?? (0 as never), (v: number) =>
    Math.max(0, Math.min(1, (v - (indice - 1) * h) / (2 * h)))
  )
  const p = useSpring(bruto, { stiffness: 150, damping: 26, mass: 0.35 })

  /* ---------- EFEITOS DE CORTE ----------
     Tudo aqui é transform e opacidade. Nenhuma propriedade de layout,
     nenhum filtro: é o que permite manter isso em 12 telas sem perder quadro.

     1. DOLLY  — a tela que entra vem de trás e a que sai avança e apaga.
        Os patamares em 0.34 e 0.66 existem para que a oscilação da mola
        no ponto de descanso (0.5) não faça o conteúdo piscar.
     2. OBTURADOR — as tarjas engrossam no corte e voltam. É o efeito que
        faz a troca de tela ler como corte de câmera, e não como rolagem. */
  const vel = palco?.vel
  const passagem = palco?.passagem ?? true

  const dollyE = useTransform(p, [0, 0.34, 0.66, 1], [0.93, 1, 1, 1.05])
  const dollyO = useTransform(p, [0, 0.28, 0.72, 1], [0.1, 1, 1, 0.06])
  const escala = passagem ? dollyE : undefined
  const opac = passagem ? dollyO : undefined

  const obturadorBruto = useTransform(vel ?? (0 as never), (v: number) => 1 + v * 1.5)
  const obturador = useSpring(obturadorBruto, { stiffness: 220, damping: 30, mass: 0.35 })

  /* Cada plano percorre no máximo metade da própria folga.

     DESEMPENHO: o deslocamento sai em PIXEL INTEIRO, não em porcentagem.
     Com fração de pixel, todo fundo ladrilhado (as grades e as curvas de
     nível) precisa ser re-rasterizado a cada quadro num novo sub-pixel —
     era esse o custo real, não a quantidade de camadas. Arredondado, o
     navegador reaproveita o mesmo ladrilho já desenhado.
     Os fatores abaixo são o deslocamento em fração da altura da tela,
     equivalentes aos antigos 11/15/21% da altura de cada plano. */
  const y1 = useTransform(p, (v: number) => Math.round((v - 0.5) * 2 * 0.143 * h))
  const y2 = useTransform(p, (v: number) => Math.round((v - 0.5) * 2 * 0.216 * h))
  const y3 = useTransform(p, (v: number) => Math.round((v - 0.5) * 2 * 0.288 * h))
  const yx = useTransform(p, (v: number) => Math.round((v - 0.5) * 2 * 0.365 * h))   /* plano mais rápido */
  const paX = useTransform(mx, (v) => v * 9)

  const linha = evento ? "border-ciano/35" : "border-gelo/20"

  return (
    <motion.section
      ref={ref} id={id}
      initial={reduz ? false : "hidden"} whileInView={reduz ? undefined : "show"}
      viewport={{ root: palco?.ref ?? undefined, amount: 0.45, once: false }}
      variants={stage}
      className="relative grid h-dvh w-full shrink-0 snap-start snap-always content-center overflow-hidden bg-grafite"
    >
      {/* palco: vive entre as tarjas */}
      <motion.div style={{ x: paX, top: "var(--bar)", bottom: "var(--bar)" }}
        className="absolute inset-x-0 z-0 overflow-hidden">

        {perto && <>
        {/* plano 1 — superfície e grade larga na MESMA camada:
            duas camadas grandes compostas viravam duas vezes o custo. */}
        <Plano y={y1} className={cn("-top-[15%] h-[130%] grade-larga", superficies[superficie], midia && "opacity-45")} />

        {/* plano 2 — curvas de nível + realce (mesma velocidade, uma camada só) */}
        <Plano y={y2} className={cn("-top-[22%] h-[144%]",
          evento ? "topografia-ciano" : "topografia", midia && "opacity-35")} />

        {/* plano 3 — grade fina: o degrau de velocidade que faz a profundidade */}
        <Plano y={y3} className={cn("-top-[30%] h-[160%] grade-fina", midia && "opacity-30")} />

                {midia && (
          <Plano y={y1} className="-top-[15%] h-[130%]">
            {/\.(mp4|webm|mov)$/i.test(midia)
              ? <video src={midia} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
              : <img src={midia} alt="" className="h-full w-full object-cover" />}
          </Plano>
        )}

        {/* plano 4 — palavra em contorno: o movimento mais evidente da tela */}
        {marca && (
          <Plano y={yx} className="-top-[37%] h-[174%]">
            <span
              ref={marcaAjuste.ref}
              style={{ fontSize: marcaAjuste.tamanho }}
              className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap",
                "font-marca font-bold uppercase leading-[.8] tracking-tight",
                "contorno", evento && "contorno-ciano", midia && "opacity-55")}>{marca}</span>
          </Plano>
        )}

        {/* enquadramento: marca de precisão, não decoração */}
        {enquadre && (
          <Plano y={y3} className={cn("-top-[30%] h-[160%]", midia && "opacity-55")}>
            <span className={cn("absolute left-[6%] top-[14%] size-[clamp(22px,2.6vw,38px)] border-l border-t", linha)} />
            <span className={cn("absolute right-[6%] top-[14%] size-[clamp(22px,2.6vw,38px)] border-r border-t", linha)} />
            <span className={cn("absolute bottom-[14%] left-[6%] size-[clamp(22px,2.6vw,38px)] border-b border-l", linha)} />
            <span className={cn("absolute bottom-[14%] right-[6%] size-[clamp(22px,2.6vw,38px)] border-b border-r", linha)} />
            <span className="escala absolute left-[6%] top-1/3 bottom-1/3 w-3" />
            <span className="escala absolute right-[6%] top-1/3 bottom-1/3 w-3" />
            {/* mira central */}
            <span className={cn("absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2", evento ? "bg-ciano/45" : "bg-gelo/30")} />
            <span className={cn("absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2", evento ? "bg-ciano/45" : "bg-gelo/30")} />
          </Plano>
        )}

        {/* varredura de levantamento: uma passada por tela */}
        {!midia && <motion.span
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          className={cn("pointer-events-none absolute inset-x-0 top-0 z-[3] h-px varredura",
            evento ? "bg-ciano/45 shadow-[0_0_28px_6px_rgb(94_234_212/.16)]"
                   : "bg-gelo/35 shadow-[0_0_28px_6px_rgb(245_247_250/.10)]")} />}

        </>}

        {/* profundidade: escurece as bordas para o texto respirar */}
        <div className={cn("profundidade pointer-events-none absolute inset-0 z-[2]",
          evento && "realce-ciano",
          feixe && (feixe === "dir" ? "feixe-dir" : "feixe-esq"))} />
      </motion.div>

      {/* Tarjas: estrutura do quadro.
          DESEMPENHO: antes eu animava a ALTURA delas — propriedade de layout,
          recalculada a cada quadro. Agora a barra fica parada e quem se move é
          uma cortina sólida atrás, em scaleY: puro transform, roda na GPU. */}
      {([["top-0", "origin-top", slateL, slateR], ["bottom-0", "origin-bottom", rodapeL, rodapeR]] as const).map(([pos, origem, l, r], i) => (
        <div key={i} className={cn("absolute inset-x-0 z-[8] h-[var(--bar)]", pos)}>
          {/* obturador: a tarja engrossa no corte e volta ao repouso.
              Só a placa preta escala — a linha de dados fica intacta. */}
          <motion.span
            style={{ scaleY: passagem ? obturador : undefined }}
            className={cn("absolute inset-0 block bg-grafite", origem)}
          />
          <motion.span
            variants={{ hidden: { scaleY: 2.6 }, show: { scaleY: 1, transition: { duration: 1.35, ease: [0.22, 0.61, 0.24, 1] } } }}
            className={cn("absolute inset-0 block bg-grafite", origem)}
          />
          <div className="relative flex h-full items-center justify-between px-[var(--pad)]">
            <span className={cn("dado-sm", evento ? "text-ciano/80" : "text-gelo/45")}>{l}</span>
            <span className="dado-sm text-gelo/35">{r}</span>
          </div>
        </div>
      ))}

      <motion.div
        style={{ scale: escala, opacity: opac }}
        className={cn("screen-inner relative z-[6] mx-auto w-full max-w-[1140px] px-[var(--pad)]",
          "py-[calc(var(--bar)+clamp(26px,5vh,54px))]", center && "text-center")}>
        {alinha
          ? <div className={cn("w-full max-w-[640px]",
              alinha === "dir" ? "ml-auto text-right" : "mr-auto text-left")}>{children}</div>
          : children}
      </motion.div>
    </motion.section>
  )
}
