import { createContext, useContext, useEffect } from "react"
import { useMotionValue, useSpring, type MotionValue } from "framer-motion"

/* DESEMPENHO: antes cada tela criava o próprio par de molas e o próprio
   ouvinte de pointermove — 12 ouvintes e 24 molas atualizando juntos.
   Agora é um só, compartilhado por contexto. */
type Ponteiro = { mx: MotionValue<number>; my: MotionValue<number> }
export const PointerCtx = createContext<Ponteiro | null>(null)

export function usePointerValues(): Ponteiro {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.6 })
  const my = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.6 })

  useEffect(() => {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let pendente = false
    const onMove = (e: PointerEvent) => {
      if (pendente) return
      pendente = true
      requestAnimationFrame(() => {
        rawX.set((e.clientX / window.innerWidth - 0.5) * 2)
        rawY.set((e.clientY / window.innerHeight - 0.5) * 2)
        pendente = false
      })
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [rawX, rawY])

  return { mx, my }
}

export function usePointer(): Ponteiro {
  const ctx = useContext(PointerCtx)
  if (!ctx) throw new Error("usePointer deve ser usado dentro de PointerCtx.Provider")
  return ctx
}
