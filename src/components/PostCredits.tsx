import { Softbox } from "./Softbox"
import { StudioLamp } from "./StudioLamp"
import { DirectorChair } from "./DirectorChair"
import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { wa } from "@/data/site"

export function PostCredits({ active, restart }: { active: boolean; restart: () => void }) {
  const reduced = useReducedMotion()
  const [revealed, setRevealed] = useState(false)
  const [take, setTake] = useState(0)
  useEffect(() => {
    if (!active || reduced) return
    const timer = window.setTimeout(() => setRevealed(true), 4800)
    return () => window.clearTimeout(timer)
  }, [active, reduced, take])
  const show = revealed || !!reduced
  return (
    <section id="pos-creditos" aria-label="Cena pós-créditos" className="post-credits relative grid h-dvh w-full shrink-0 snap-start snap-always content-center overflow-hidden"
      data-active={active} data-revealed={show}>
      <div aria-hidden="true" className="post-set">
        <div className="post-wall" />
        <div className="post-floor" /><div className="post-spill" /><div className="post-chair-shadow" />
        <div className="post-softbox post-softbox-key"><Softbox /></div><div className="post-softbox post-softbox-fill"><Softbox /></div><div className="post-soft-fill" /><div className="post-lamp"><StudioLamp /></div>
        
        <div className="post-chair"><DirectorChair /></div><div className="post-dust">{Array.from({ length: 7 }, (_, i) => <i key={i} style={{ left: `${61 + i * 4}%`, top: `${35 + (i * 13) % 40}%`, animationDelay: `${-i * 1.7}s` }} />)}</div>
      </div>
      <div className="post-content">
        {!show ? <>
          <span className="dado-sm text-gelo/50">Uma produção Skyframe</span>
          <h2 className="post-end">FIM.</h2>
          <div className="post-names">
            <p><span>Direção, câmera e edição</span>Anderson</p>
            <p><span>Direção de cena</span>Esther</p>
            <p><span>Filmado com histórias de verdade</span>Florianópolis, SC</p>
          </div>
          <button type="button" className="post-link" onClick={() => setRevealed(true)}>Ainda tem uma cena →</button>
        </> : <div key={take} className="post-reveal">
          <span className="dado-sm text-gelo/60">Cena extra · seu lugar no set</span>
          <h2>Faltou o nome<br /><em>mais importante.</em></h2>
          <p className="post-star">O seu.</p>
          <p className="post-description">Guardamos o melhor lugar para você.<br />A próxima história é a do seu negócio.</p>
          <a href={wa("geral")} target="_blank" rel="noopener" data-cta="whatsapp-pos-creditos" className="post-cta">Vamos gravar essa história <span aria-hidden="true">↗</span></a>
          <div className="post-actions">
            <button type="button" onClick={() => { setRevealed(false); setTake(value => value + 1) }}>Rever cena extra</button>
            <button type="button" onClick={restart}>Voltar ao início</button>
          </div>
        </div>}
      </div>
      <span className="post-caption dado-sm">Skyframe · toda grande história começa com uma conversa</span>
    </section>
  )
}
