import type { Variants, Transition } from "framer-motion"

/* ==============================================================
   REGRA DE DESEMPENHO
   Animar SÓ transform e opacity — as duas únicas propriedades que
   o navegador resolve na GPU, sem recalcular layout nem repintar.
   `filter: blur()` repinta a camada inteira a cada quadro e
   `letter-spacing` força reflow: os dois foram removidos daqui.
   ============================================================== */
export const ease = [0.22, 0.61, 0.24, 1] as const
export const easeOut = [0.16, 0.9, 0.28, 1] as const

export const springSoft: Transition = { type: "spring", stiffness: 120, damping: 24, mass: 0.5 }
export const springSnap: Transition = { type: "spring", stiffness: 260, damping: 30, mass: 0.6 }

export const stage: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
}

export const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 150, damping: 22, mass: 0.7, opacity: { duration: 0.55, ease } },
  },
}

/* título: cada palavra sobe de uma máscara. Puro transform. */
export const frase: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
}
export const palavra: Variants = {
  hidden: { y: "108%" },
  show: { y: "0%", transition: { duration: 0.95, ease } },
}

export const card: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 21, mass: 0.8 } },
}
