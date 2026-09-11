import { useCallback, useEffect, useRef, useState } from "react"
import { animate, motion, useMotionValue, useTransform, useVelocity } from "framer-motion"
import { ScrollCtx } from "@/components/ScrollContext"
import { PointerCtx, usePointerValues } from "@/lib/usePointer"
import { Screen } from "@/components/Screen"
import { Curtain } from "@/components/Curtain"
import { Marca, CtaFixo, Rail, Contador, Progresso, Avancar } from "@/components/Chrome"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { rise, ease } from "@/lib/motion"
import { Frase } from "@/components/Frase"
import { cn } from "@/lib/utils"
import { site, wa, ig, vitrine, servicos, passos, entregaveis, objecoes, duvidas, dupla, emBreve, adicional } from "@/data/site"

const telas = [
  { id: "t1", nome: "Abertura" },
  ...vitrine.map((v) => ({ id: v.id, nome: v.momento })),
  { id: "precos", nome: "Preços" },
  { id: "metodo", nome: "Método" },
  { id: "entrega", nome: "Entrega" },
  { id: "risco", nome: "Sem risco" },
  { id: "dupla", nome: "A dupla" },
  { id: "duvidas", nome: "Dúvidas" },
  { id: "contato", nome: "Contato" },
]
const T = telas.length
const slate = (i: number) => `${String(i).padStart(2, "0")} / ${String(T).padStart(2, "0")}`

const H1 = "font-marca text-[length:var(--text-h1)] font-semibold leading-[1.02] tracking-tight text-gelo"
const H2 = "font-marca text-[length:var(--text-h2)] font-semibold leading-[1.06] tracking-tight text-gelo"
const CORPO = "text-[length:var(--text-corpo)] leading-relaxed text-gelo/70"

/* Rótulo técnico: ponto + palavra em mono. Substitui a antiga etiqueta em caixa. */
function Rotulo({ children, ciano, className }: { children: React.ReactNode; ciano?: boolean; className?: string }) {
  return (
    <motion.span variants={rise}
      className={cn("dado-sm inline-flex items-center gap-2", ciano ? "text-ciano" : "text-gelo/45", className)}>
      <i className={cn("size-1 shrink-0", ciano ? "bg-ciano" : "bg-gelo/60")} />
      {children}
    </motion.span>
  )
}

export default function App() {
  const palco = useRef<HTMLElement>(null)
  const [atual, setAtual] = useState(0)
  const animando = useRef(false)
  const ponteiro = usePointerValues()
  const rolagem = useMotionValue(0)
  const [altura, setAltura] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 800))
  const [passagem, setPassagem] = useState(true)

  useEffect(() => {
    const medir = () => {
      setAltura(palco.current?.clientHeight || window.innerHeight)
      /* tela deitada/baixa rola livre: a matemática de passagem não vale
         e os efeitos de corte ficariam presos no meio do caminho. */
      setPassagem(
        window.innerHeight >= 560 &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
    }
    medir()
    window.addEventListener("resize", medir)
    return () => window.removeEventListener("resize", medir)
  }, [])

  /* Velocidade da passagem, normalizada de 0 a 1: um único valor para a
     página inteira, que aciona o obturador em todas as telas. */
  const velBruta = useVelocity(rolagem)
  const vel = useTransform(velBruta, (v) =>
    Math.min(1, Math.abs(v) / Math.max(1, altura * 2.2)))

  const secoes = useCallback(() => Array.from(palco.current?.children ?? []) as HTMLElement[], [])

  /* DESEMPENHO: as posições das telas só mudam quando a janela muda de
     tamanho. Antes eu lia offsetTop das 12 seções a cada evento de rolagem —
     ou seja, 12 recálculos de layout por quadro, no exato momento em que a
     animação está escrevendo scrollTop. Layout thrash clássico. Agora as
     posições ficam em cache e a passagem vira aritmética pura. */
  const alturas = useRef<number[]>([])
  const medirSecoes = useCallback(() => {
    alturas.current = secoes().map((s) => s.offsetTop)
  }, [secoes])
  /* o cache é refeito quando a altura muda — o que inclui a montagem */
  useEffect(() => { medirSecoes() }, [medirSecoes, altura])

  const indiceMaisProximo = useCallback(() => {
    const el = palco.current; if (!el) return 0
    const tops = alturas.current
    if (!tops.length) return 0
    let melhor = 0, dist = Infinity
    for (let i = 0; i < tops.length; i++) {
      const d = Math.abs(tops[i] - el.scrollTop)
      if (d < dist) { dist = d; melhor = i }
    }
    return melhor
  }, [])

  /* passagem: curva longa e amortecida, no lugar do salto do navegador */
  const ir = useCallback((i: number, duration = 0.95) => {
    const el = palco.current
    if (!el || animando.current) return
    const alvo = Math.max(0, Math.min(T - 1, i))
    const destino = alturas.current[alvo] ?? secoes()[alvo]?.offsetTop ?? 0
    if (Math.abs(destino - el.scrollTop) < 2) return
    animando.current = true
    el.style.scrollSnapType = "none"
    const solta = () => { el.style.scrollSnapType = "y mandatory"; animando.current = false }
    const trava = setTimeout(solta, duration * 1000 + 500)
    animate(el.scrollTop, destino, {
      duration, ease,
      onUpdate: (v) => { el.scrollTop = v },
      onComplete: () => { clearTimeout(trava); solta() },
    })
  }, [secoes])

  /* roda do mouse: uma tela por gesto (no toque e no deitado, o nativo comanda) */
  useEffect(() => {
    const el = palco.current; if (!el) return
    const fino = window.matchMedia("(hover:hover) and (pointer:fine)").matches
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fino || reduz || window.innerHeight < 560) return
    let ultimo = 0
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 4) return
      e.preventDefault()
      const agora = performance.now()
      if (animando.current || agora - ultimo < 160) return
      ultimo = agora
      ir(indiceMaisProximo() + (e.deltaY > 0 ? 1 : -1))
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [ir, indiceMaisProximo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!palco.current) return
      const i = indiceMaisProximo()
      if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); ir(i + 1) }
      if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); ir(i - 1) }
      if (e.key === "Home") { e.preventDefault(); ir(0, 1.4) }
      if (e.key === "End") { e.preventDefault(); ir(T - 1, 1.4) }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [ir, indiceMaisProximo])

  return (
    <ScrollCtx.Provider value={{ ref: palco, y: rolagem, altura, vel, passagem }}>
      <PointerCtx.Provider value={ponteiro}>
      <Curtain />
      <Marca onClick={() => ir(0, 1.4)} />
      <CtaFixo />
      <Rail telas={telas} atual={atual} ir={(i) => ir(i, 1.2)} />
      <Contador atual={atual} total={T} />
      <Progresso v={(atual + 1) / T} />
      <Avancar onClick={() => ir(atual + 1)} escondido={atual === T - 1} />

      <main ref={palco}
        onScroll={() => { rolagem.set(palco.current?.scrollTop ?? 0); setAtual(indiceMaisProximo()) }}
        className="no-scrollbar h-dvh snap-y snap-mandatory overflow-y-scroll overscroll-none">

        {/* ---------- 01 abertura ---------- */}
        <Screen id="t1" indice={0} superficie="noite" enquadre marca="SKYFRAME" feixe="dir" center midia={site.midia[0]}
          slateL={site.coordenada} slateR="4K · 16:9" rodapeL={site.cidade} rodapeR={slate(1)}>
          <motion.span variants={rise} className="dado-sm block text-gelo/45">Skyframe · Florianópolis</motion.span>
          <Frase as="h1" className={`mt-4 ${H1}`}
            partes={[{ texto: "O seu negócio merece" }, { texto: "ser visto por inteiro", leve: true }]} />
          <motion.p variants={rise} className={`mx-auto mt-5 max-w-[54ch] ${CORPO}`}>
            Filmes com direção de cena, imagem aérea e cor tratada para transformar lugares,
            marcas e experiências em histórias que dão vontade de estar ali. Pronto para publicar em até 10 dias.
          </motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild><a href={wa("geral")} target="_blank" rel="noopener" data-cta="whatsapp">Quero filmar o meu momento</a></Button>
            <Button variant="outline" onClick={() => ir(5)}>Ver preços</Button>
          </motion.div>
          <motion.div variants={rise} className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-2">
            {["Resposta em 1 dia útil", "Preço fechado antes de começar", "Chuva remarca sem custo"].map((m) => (
              <span key={m} className="dado-sm flex items-center gap-2 text-gelo/40">
                <i className="size-1 bg-gelo/60" />{m}
              </span>
            ))}
          </motion.div>
        </Screen>

        {/* ---------- 02 a 05 vitrine — o conteúdo alterna de lado do quadro ---------- */}
        {vitrine.map((v, i) => {
          const lado = i % 2 === 0 ? "esq" : "dir"
          return (
            <Screen key={v.id} id={v.id} indice={i + 1} superficie={v.tema} evento={v.evento} enquadre
              marca={v.mega} alinha={lado} feixe={lado === "esq" ? "dir" : "esq"} midia={site.midia[i + 1]}
              slateL={slate(i + 2)} slateR={v.kick} rodapeL={v.local} rodapeR="16:9">
              <motion.span variants={rise}
                className={cn("numeral block font-marca text-[clamp(46px,7vw,86px)] font-bold leading-[.85] tracking-tight",
                  v.evento && "numeral-ciano")}>
                {String(i + 1).padStart(2, "0")}
              </motion.span>
              <Rotulo ciano={v.evento} className="mt-4">{v.momento}</Rotulo>
              <Frase className={`mt-3 ${H1}`}
                partes={[{ texto: v.titulo[0] }, { texto: v.titulo[1], leve: true, ciano: v.evento }]} />
              <motion.p variants={rise}
                className={cn("mt-5 max-w-[46ch] border-l border-gelo/15 pl-5", CORPO,
                  lado === "dir" && "ml-auto border-l-0 border-r pl-0 pr-5")}>
                {v.texto}
              </motion.p>
              <motion.div variants={rise} className={cn("mt-8 flex", lado === "dir" && "justify-end")}>
                <Button asChild size="sm" variant={v.evento ? "evento" : "default"}>
                  <a href={wa(v.cta)} target="_blank" rel="noopener">{v.ctaLabel} · a partir de {v.preco}</a>
                </Button>
              </motion.div>
            </Screen>
          )
        })}

        {/* ---------- 06 preços — colunas separadas por fio, sem caixa ---------- */}
        <Screen id="precos" indice={5} superficie="meio" marca="PREÇOS" feixe="esq" slateL={slate(6)} slateR="Serviços e preços"
          rodapeL="Preço fechado antes de começar" rodapeR="Skyframe">
          <Rotulo>Preços</Rotulo>
          <Frase className={`mt-3 max-w-[24ch] ${H2}`} partes={[{ texto: "Escolha o momento." }, { texto: "O preço fecha antes de começar.", leve: true }]} />
          <div className="mt-9 grid grid-cols-4 divide-x divide-gelo/18 max-lg:grid-cols-2 max-lg:divide-x-0 max-lg:gap-y-6">
            {servicos.map((s) => (
              <motion.div key={s.key} variants={rise}
                className="flex flex-col gap-2 px-5 first:pl-0 last:pr-0 max-lg:px-0 max-lg:odd:pr-5 max-lg:even:border-l max-lg:even:border-gelo/12 max-lg:even:pl-5">
                <span className="dado-sm flex items-center gap-2 text-gelo/40">
                  <i className={cn("size-1 shrink-0", s.evento ? "bg-ciano" : "bg-gelo/60")} />{s.tag}
                </span>
                <h3 className="text-[17px] leading-tight">{s.nome}</h3>
                <p className="text-[12.5px] leading-snug text-gelo/45 max-sm:hidden">{s.para}</p>
                <ul className="lista-precos mt-1 text-[13px] leading-relaxed text-gelo/55 max-sm:hidden">
                  {s.itens.map((it) => (
                    <li key={it} className="border-t border-gelo/10 py-1.5">{it}</li>
                  ))}
                </ul>
                <span className={cn("mt-auto pt-3 font-marca text-[26px] font-semibold leading-none tracking-tight tabular-nums",
                  s.evento ? "text-ciano" : "text-gelo")}>
                  {s.preco}
                  {s.unidade && <small className="ml-1 font-mono text-[11px] font-normal text-gelo/45">{s.unidade}</small>}
                </span>
                <a href={wa(s.key)} target="_blank" rel="noopener"
                  className={cn("dado-sm mt-2 inline-flex w-fit items-center gap-1.5 border-b pb-1 transition-colors",
                    s.evento ? "border-ciano/40 text-ciano hover:border-ciano" : "border-gelo/30 text-gelo hover:border-gelo")}>
                  {s.key === "mensal" ? "Quero conteúdo mensal" : s.key === "marca" ? "Planejar minha campanha" : s.key === "filme" ? "Quero produzir este filme" : "Conversar sobre esta diária"} <span aria-hidden>→</span>
                </a>
              </motion.div>
            ))}
          </div>

          {/* rodapé da oferta: o que dá para somar e o que ainda não abriu */}
          <motion.div variants={rise}
            className="rodape-oferta mt-9 grid grid-cols-2 gap-x-10 border-t border-gelo/18 pt-5 max-lg:grid-cols-1 max-lg:gap-y-5">
            <div>
              <span className="dado-sm flex items-center gap-2 text-gelo/40">
                <i className="size-1 shrink-0 bg-gelo/60" />Adicional · {adicional.nome}
              </span>
              <p className="mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-gelo/55">{adicional.texto}</p>
            </div>
            <div className="max-lg:border-t max-lg:border-gelo/12 max-lg:pt-5 lg:border-l lg:border-gelo/12 lg:pl-10">
              <span className="dado-sm flex items-center gap-2 text-gelo/40">
                <i className="size-1 shrink-0 bg-gelo/30" />{emBreve.tag} · {emBreve.nome}
              </span>
              <p className="mt-2 max-w-[42ch] text-[13.5px] leading-relaxed text-gelo/55">{emBreve.texto}</p>
              <a href={wa(emBreve.cta)} target="_blank" rel="noopener"
                className="dado-sm mt-3 inline-flex w-fit items-center gap-1.5 border-b border-gelo/30 pb-1 text-gelo transition-colors hover:border-gelo">
                {emBreve.ctaLabel} <span aria-hidden>→</span>
              </a>
            </div>
          </motion.div>
        </Screen>

        {/* ---------- 07 método — numerais grandes sobre fio de base ---------- */}
        <Screen id="metodo" indice={6} superficie="profundo" marca="MÉTODO" feixe="dir" slateL={slate(7)} slateR="Como funciona"
          rodapeL="Proposta em 1 dia útil" rodapeR="Skyframe">
          <Rotulo>Como funciona</Rotulo>
          <Frase className={`mt-3 max-w-[26ch] ${H2}`} partes={[{ texto: "Nada é gravado" }, { texto: "antes de você aprovar", leve: true }]} />
          <div className="mt-10 grid grid-cols-4 gap-x-8 gap-y-7 max-lg:grid-cols-2 max-lg:gap-x-6">
            {passos.map((p) => (
              <motion.div key={p.n} variants={rise} className="border-t border-gelo/18 pt-4">
                <span className="numeral block font-marca text-[clamp(38px,4.6vw,62px)] font-bold leading-[.85] tracking-tight">{p.n}</span>
                <h3 className="mt-3 text-[17px]">{p.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gelo/60">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </Screen>

        {/* ---------- 08 entrega ---------- */}
        <Screen id="entrega" indice={7} superficie="meio" marca="ENTREGA" feixe="esq" slateL={slate(8)} slateR="O que chega na sua mão"
          rodapeL="Material pronto para publicar" rodapeR="Skyframe">
          <Rotulo>O que você recebe</Rotulo>
          <Frase className={`mt-3 max-w-[28ch] ${H2}`} partes={[{ texto: "Chega pronto para publicar." }, { texto: "Não chega arquivo bruto.", leve: true }]} />
          <div className="bloco-entrega mt-10 grid grid-cols-4 gap-x-8 gap-y-7 max-lg:grid-cols-2 max-lg:gap-x-6">
            {entregaveis.map((e) => (
              <motion.div key={e.v} variants={rise} className="border-t border-gelo/18 pt-4">
                <span className="numeral block font-marca text-[clamp(32px,4.2vw,54px)] font-bold leading-[.85] tracking-tight">{e.v}</span>
                <h3 className="mt-3 text-[16px]">{e.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-gelo/60">{e.d}</p>
              </motion.div>
            ))}
          </div>
        </Screen>

        {/* ---------- 09 sem risco ---------- */}
        <Screen id="risco" indice={8} superficie="profundo" marca="SEM RISCO" feixe="dir" slateL={slate(9)} slateR="Garantias"
          rodapeL="Chuva remarca sem custo" rodapeR="Skyframe">
          <Rotulo>Garantias</Rotulo>
          <Frase className={`mt-3 max-w-[26ch] ${H2}`} partes={[{ texto: "Três garantias," }, { texto: "por escrito na proposta", leve: true }]} />
          <div className="mt-10 grid grid-cols-3 gap-8 max-lg:grid-cols-1 max-lg:gap-5">
            {objecoes.map((o, i) => (
              <motion.div key={o.t} variants={rise}
                className={cn("border-l border-gelo/25 pl-4", i === 1 && "lg:mt-7", i === 2 && "lg:mt-14")}>
                <span className="dado-sm block text-gelo/35">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-[17px]">{o.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gelo/60">{o.d}</p>
              </motion.div>
            ))}
          </div>
        </Screen>

        {/* ---------- 10 a dupla ---------- */}
        <Screen id="dupla" indice={9} superficie="meio" marca="CAMPECHE" feixe="esq" slateL={slate(10)} slateR="A dupla"
          rodapeL="Moramos no Campeche" rodapeR="Skyframe">
          <div className="grid grid-cols-[1fr_1.15fr] items-center gap-14 max-lg:grid-cols-1 max-lg:gap-7">
            <div>
              <Rotulo>A dupla</Rotulo>
              <Frase className={`mt-3 ${H2}`} partes={[{ texto: "Quem vai estar" }, { texto: "no seu momento", leve: true }]} />
              <motion.p variants={rise} className={`mt-5 max-w-[46ch] ${CORPO}`}>
                Somos duas pessoas cuidando do projeto do começo ao fim. Você fala diretamente com quem
                planeja, grava e entrega — menos camadas, mais cuidado em cada decisão.
                Moramos no Campeche: a locação da sua gravação é o quintal da nossa casa.
              </motion.p>
            </div>
            <div>
              {dupla.map((d) => (
                <motion.div key={d.nome} variants={rise}
                  className="flex items-baseline gap-5 border-b border-gelo/12 py-5 first:border-t max-sm:flex-col max-sm:gap-1">
                  <span className="min-w-[4.6em] shrink-0 font-marca text-[clamp(20px,2.6vw,30px)] font-semibold leading-none tracking-tight text-gelo">{d.nome}</span>
                  <span className="text-[14.5px] leading-relaxed text-gelo/60">{d.papel}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Screen>

        {/* ---------- 11 dúvidas ---------- */}
        <Screen id="duvidas" indice={10} superficie="base" marca="DÚVIDAS" feixe="dir" slateL={slate(11)} slateR="Antes de perguntar"
          rodapeL="Resposta em 1 dia útil" rodapeR="Skyframe">
          <Rotulo>Antes de perguntar</Rotulo>
          <Frase className={`mt-3 max-w-[30ch] ${H2}`} partes={[{ texto: "As perguntas que todo mundo faz" }, { texto: "antes de fechar", leve: true }]} />
          <div className="mt-8 grid grid-cols-2 gap-x-14 max-lg:grid-cols-1 max-lg:gap-x-0">
            {[duvidas.slice(0, 3), duvidas.slice(3)].map((grupo, col) => (
              <motion.div key={col} variants={rise}>
                <Accordion type="single" collapsible defaultValue={col === 0 ? "c0-0" : undefined}>
                  {grupo.map((d, i) => (
                    <AccordionItem key={d.q} value={`c${col}-${i}`}>
                      <AccordionTrigger>{d.q}</AccordionTrigger>
                      <AccordionContent>{d.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </Screen>

        {/* ---------- 12 contato ---------- */}
        <Screen id="contato" indice={11} superficie="noite" enquadre marca="FALE" feixe="esq" center
          slateL={slate(12)} slateR="Próximo passo" rodapeL="Anderson e Esther" rodapeR={site.cidade}>
          <motion.span variants={rise} className="dado-sm block text-gelo/45">Próximo passo</motion.span>
          <Frase className={`mt-4 ${H1}`}
            partes={[{ texto: "Me conta que momento" }, { texto: "é esse — e amanhã", leve: true }, { texto: "a proposta chega" }]} />
          <motion.p variants={rise} className={`mx-auto mt-5 max-w-[52ch] ${CORPO}`}>
            Três informações bastam: o que é, onde é e para quando. Você recebe o valor
            já fechado em até um dia útil — sem reunião, sem visita, sem enrolação.
          </motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild><a href={wa("geral")} target="_blank" rel="noopener" data-cta="whatsapp-final">Chamar no WhatsApp agora</a></Button>
            <Button asChild variant="outline"><a href={ig()} target="_blank" rel="noopener" data-cta="instagram-final">Ver trabalhos no Instagram</a></Button>
          </motion.div>
          <motion.p variants={rise} className="dado-sm mt-5 text-gelo/50">{site.telefone}</motion.p>
          <motion.div variants={rise} className="mx-auto mt-9 max-w-[70ch] border-t border-gelo/12 pt-5">
            <span className="dado-sm block text-gelo/35">Região atendida</span>
            <p className="mt-2 text-[14px] text-gelo/60">
              Atendemos <strong className="font-semibold text-gelo/85">toda Florianópolis</strong> — norte, centro,
              leste e sul da ilha, e também o continente. Moramos no Campeche, então o sul da ilha é o nosso quintal.
            </p>
          </motion.div>
        </Screen>
      </main>
      </PointerCtx.Provider>
    </ScrollCtx.Provider>
  )
}
