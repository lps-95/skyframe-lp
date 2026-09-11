import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Logo } from "@/components/Logo"
import { ease } from "@/lib/motion"
import { site } from "@/data/site"

/* ==============================================================
   ABERTURA — A CLAQUETE

   A página começa como começa uma gravação de verdade:

     1. a claquete entra no quadro com o braço levantado
     2. os campos são preenchidos, um a um, e o timecode começa a correr
     3. a tábua bate — tranco de câmera, clarão do impacto
     4. "AÇÃO"
     5. a claquete é puxada para fora do quadro, como no set
     6. as tarjas abrem para o filme

   Sem som, por decisão: navegador nenhum toca áudio antes do primeiro
   clique da pessoa. Um som aqui seria mudo para quem chega e barulhento
   para quem volta. A batida se lê pela imagem. Por isso o campo SOM diz
   MOS — o termo de set para o plano rodado sem áudio.

   DESEMPENHO: só rotação, deslocamento e opacidade se movem. Nada de
   layout, nada de filtro. O timecode é um componente isolado, para que
   os 24 quadros por segundo dele não redesenhem o resto.
   ============================================================== */

const D_ENTRA = 260    /* ms — a claquete entra no quadro */
const D_BATE  = 980    /* ms — a tábua bate */
const D_SAI   = 1560   /* ms — a claquete é puxada para fora */
const D_ABRE  = 1720   /* ms — as tarjas abrem */
const D_FORA  = 3050   /* ms — fim da abertura */

const ALTURA_TABUA = "h-[clamp(19px,2.9vw,28px)]"

/* As listras das duas tábuas correm em sentidos opostos: fechadas,
   elas formam o ziguezague da claquete real. É esse encaixe que
   identifica o objeto — listras paralelas leem como duas barras. */
const listras = (sentido: 45 | -45) => ({
  backgroundImage:
    `repeating-linear-gradient(${sentido}deg, var(--color-gelo) 0 14px, var(--color-grafite) 14px 28px)`,
})

/* Timecode rodando a 24 quadros por segundo, do zero. */
function Timecode({ rodando }: { rodando: boolean }) {
  const [q, setQ] = useState(0)
  useEffect(() => {
    if (!rodando) return
    const id = setInterval(() => setQ((v) => v + 1), 1000 / 24)
    return () => clearInterval(id)
  }, [rodando])
  const p = (n: number) => String(n).padStart(2, "0")
  return (
    <span className="tabular-nums">
      {p(Math.floor(q / 86400))}:{p(Math.floor(q / 1440) % 60)}:{p(Math.floor(q / 24) % 60)}:{p(q % 24)}
    </span>
  )
}

const campo = {
  oculto: { opacity: 0, y: 4 },
  vivo: { opacity: 1, y: 0, transition: { duration: 0.32, ease } },
}

function Campo({ rotulo, children, largo, forte }:
  { rotulo: string; children: React.ReactNode; largo?: boolean; forte?: boolean }) {
  return (
    <motion.div variants={campo} className={largo ? "col-span-2" : ""}>
      <span className="dado-sm block text-gelo/30">{rotulo}</span>
      <span className={`mt-1 block font-mono text-[clamp(10.5px,1.35vw,13.5px)] uppercase tracking-wider
        ${forte ? "text-gelo" : "text-gelo/80"}`}>
        {children}
      </span>
    </motion.div>
  )
}

export function Curtain() {
  const [entrou, setEntrou] = useState(false)
  const [batido, setBatido] = useState(false)
  const [saindo, setSaindo] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [fora, setFora] = useState(false)

  useEffect(() => {
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const jaViu = sessionStorage.getItem("skyframe:intro-vista") === "1"
    if (reduz || jaViu) { setFora(true); return }
    sessionStorage.setItem("skyframe:intro-vista", "1")
    const t = [
      setTimeout(() => setEntrou(true), D_ENTRA),
      setTimeout(() => setBatido(true), D_BATE),
      setTimeout(() => setSaindo(true), D_SAI),
      setTimeout(() => setAberto(true), D_ABRE),
      setTimeout(() => setFora(true), D_FORA),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  /* O braço levantado sobe (largura × sen 21°) acima da tábua de baixo.
     Em tela baixa isso passaria do topo do quadro, então o conjunto
     inteiro desce metade dessa subida — aberto e fechado, tudo cabe.
     Vai num invólucro próprio: se fosse no mesmo elemento da animação,
     o `animate` sobrescreveria o deslocamento justo na hora da batida. */
  const conjunto = useRef<HTMLDivElement>(null)
  const [desloca, setDesloca] = useState(0)
  useEffect(() => {
    const medir = () => {
      const l = conjunto.current?.getBoundingClientRect().width ?? 0
      setDesloca(Math.round(l * Math.sin((21 * Math.PI) / 180) * 0.5))
    }
    medir()
    window.addEventListener("resize", medir)
    return () => window.removeEventListener("resize", medir)
  }, [])

  const agora = new Date()
  const data = agora.toLocaleDateString("pt-BR")
  const hora = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

  return (
    <AnimatePresence>
      {!fora && (
        <motion.div key="claquete" className="pointer-events-none fixed inset-0 z-[95] overflow-hidden"
          exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }}>

          {/* o tranco da batida sacode o QUADRO, não só a claquete:
              é a câmera levando o impacto, que é o que dá o susto */}
          <motion.div
            animate={batido ? { y: [0, 7, -3, 1, 0], rotate: [0, 0.5, -0.22, 0] } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.34, ease: "easeOut" }}
            className="absolute inset-0">

            {/* as duas metades pretas: fecham o quadro e depois abrem */}
            <motion.i animate={{ y: aberto ? "-102%" : 0 }} transition={{ duration: 1.5, ease }}
              className="absolute inset-x-0 -top-[1%] block h-[52%] bg-grafite" />
            <motion.i animate={{ y: aberto ? "102%" : 0 }} transition={{ duration: 1.5, ease }}
              className="absolute inset-x-0 -bottom-[1%] block h-[52%] bg-grafite" />

            {/* clarão do impacto */}
            <motion.i
              animate={batido ? { opacity: [0, 0.11, 0] } : { opacity: 0 }}
              transition={{ duration: 0.24, times: [0, 0.1, 1], ease: "easeOut" }}
              className="absolute inset-0 z-[3] block bg-gelo" />

            <div className="absolute inset-0 z-[2] grid place-items-center px-[var(--pad)]">
              {/* invólucro do deslocamento — nunca animado */}
              <div style={{ transform: `translateY(${desloca}px)` }}>
                <motion.div
                  ref={conjunto}
                  initial={{ opacity: 0, y: 26, rotate: -2.6 }}
                  animate={saindo
                    ? { opacity: 0, y: "-135%", rotate: -5, transition: { duration: 0.42, ease: [0.6, 0, 0.85, 0.2] } }
                    : { opacity: 1, y: 0, rotate: -1.1, transition: { duration: 0.62, ease } }}
                  className="w-[min(560px,86vw)]">

                  {/* ---------- as tábuas ---------- */}
                  <div className="relative">
                    <div style={listras(45)}
                      className={`${ALTURA_TABUA} w-full border border-gelo/30`} />

                    <motion.div
                      style={{ ...listras(-45), originX: 0, originY: 1 }}
                      initial={{ rotate: -21 }}
                      animate={{ rotate: batido ? 0 : -21 }}
                      transition={batido
                        ? { duration: 0.1, ease: [0.75, 0, 0.3, 1] }
                        : { duration: 0.6, ease }}
                      className={`absolute bottom-full left-0 ${ALTURA_TABUA} w-full border border-gelo/30`} />

                    {/* dobradiça */}
                    <span className="absolute -top-1 left-1.5 z-[2] block size-1.5 rounded-full bg-grafite ring-1 ring-gelo/50" />
                  </div>

                  {/* ---------- o corpo ---------- */}
                  <div className="border border-t-0 border-gelo/30 bg-grafite px-[clamp(13px,2.2vw,20px)] py-[clamp(12px,2vw,18px)]">
                    <div className="flex items-baseline justify-between gap-4 border-b border-gelo/15 pb-2.5">
                      <Logo className="text-[clamp(16px,2.2vw,22px)]" />
                      <span className="dado-sm text-gelo/35">{site.cidade}</span>
                    </div>

                    <motion.div
                      initial="oculto"
                      animate={entrou ? "vivo" : "oculto"}
                      variants={{ vivo: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } }}
                      className="mt-3.5 grid grid-cols-4 gap-x-4 gap-y-2.5 max-sm:grid-cols-2">
                      <Campo rotulo="Produção" largo forte>Anderson e Esther</Campo>
                      <Campo rotulo="Rolo" forte>A001</Campo>
                      <Campo rotulo="Cena" forte>01</Campo>

                      <Campo rotulo="Direção">Anderson</Campo>
                      <Campo rotulo="Dir. de cena">Esther</Campo>
                      <Campo rotulo="Take" forte>01</Campo>
                      <Campo rotulo="Som">MOS</Campo>

                      <Campo rotulo="Data">{data}</Campo>
                      <Campo rotulo="Hora">{hora}</Campo>
                      <Campo rotulo="Formato" largo>4K · 16:9 · 24 fps</Campo>

                      <Campo rotulo="Locação" largo>{site.coordenada}</Campo>
                      <Campo rotulo="Timecode" largo forte><Timecode rodando={entrou} /></Campo>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* "AÇÃO" fica no quadro, não na claquete: ela sai, a palavra fica */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: batido && !aberto ? 1 : 0 }}
              transition={{ duration: 0.12 }}
              className="dado absolute bottom-[16%] left-1/2 z-[4] -translate-x-1/2 whitespace-nowrap text-gelo/70">
              Ação
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
