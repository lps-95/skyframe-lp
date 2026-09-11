import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { wa } from "@/data/site"
import { cn } from "@/lib/utils"

/* moldura fixa. O logotipo respeita a área de proteção do manual
   (respiro mínimo = altura da letra "S") e o mínimo de 120px. */

export function Marca({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="fixed left-[var(--pad)] top-[calc(var(--bar)+16px)] z-[60] cursor-pointer p-1"
      aria-label="Voltar ao início">
      <Logo className="text-[19px]" />
    </button>
  )
}

export function CtaFixo() {
  return (
    <div className="fixed right-[var(--pad)] top-[calc(var(--bar)+12px)] z-[60] max-sm:hidden">
      <Button asChild size="sm" variant="outline">
        <a href={wa("geral")} target="_blank" rel="noopener" data-cta="whatsapp-fixo">Falar com a Skyframe</a>
      </Button>
    </div>
  )
}

export function Rail({ telas, atual, ir }: { telas: { id: string; nome: string }[]; atual: number; ir: (i: number) => void }) {
  return (
    <nav aria-label="Telas"
      className="fixed right-[calc(var(--pad)-6px)] top-1/2 z-[60] flex -translate-y-1/2 flex-col gap-0.5 p-1.5 max-lg:hidden">
      {telas.map((t, i) => (
        <button key={t.id} onClick={() => ir(i)} aria-label={t.nome} aria-current={i === atual}
          className={cn("group flex cursor-pointer items-center justify-end gap-2.5 py-1.5 transition-opacity duration-300",
            i === atual ? "opacity-100" : "opacity-40 hover:opacity-100")}>
          <span className={cn("dado-sm whitespace-nowrap text-gelo transition-all duration-300",
            i === atual ? "opacity-100" : "translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")}>
            {t.nome}
          </span>
          <motion.i animate={{ width: i === atual ? 36 : 20 }} transition={{ duration: .5, ease: [.22, .61, .24, 1] }}
            className={cn("block h-px", i === atual ? "bg-gelo" : "bg-gelo/50")} />
        </button>
      ))}
    </nav>
  )
}

export function Contador({ atual, total }: { atual: number; total: number }) {
  return (
    <div className="dado-sm fixed bottom-[calc(var(--bar)+16px)] left-[var(--pad)] z-[60] text-gelo/40">
      <b className="font-medium text-gelo">{String(atual + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
    </div>
  )
}

export function Progresso({ v }: { v: number }) {
  return (
    <motion.div className="fixed left-0 top-0 z-[75] h-px bg-gelo" animate={{ width: `${v * 100}%` }}
      transition={{ duration: .35, ease: [.22, .61, .24, 1] }} />
  )
}

export function Avancar({ onClick, escondido }: { onClick: () => void; escondido: boolean }) {
  const reduz = useReducedMotion()
  return (
    <motion.button type="button" onClick={onClick} aria-label="Próxima tela"
      animate={{ opacity: escondido ? 0 : 1 }} transition={{ duration: .4 }}
      className="fixed bottom-[calc(var(--bar)+14px)] left-1/2 z-[60] grid -translate-x-1/2 cursor-pointer justify-items-center gap-1.5 p-1.5">
      <span className="dado-sm text-gelo/40">Avançar</span>
      <motion.i animate={reduz ? { scaleY: 1, opacity: .65 } : { scaleY: [.6, 1, .6], opacity: [.25, .9, .25] }}
        transition={reduz ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="block h-6 w-px bg-gradient-to-b from-transparent to-gelo" />
    </motion.button>
  )
}
