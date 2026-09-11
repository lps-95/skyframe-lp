import { createContext, useContext } from "react"
import type { RefObject } from "react"
import type { MotionValue } from "framer-motion"

/* DESEMPENHO: antes cada tela tinha seu próprio useScroll — 12 leituras de
   getBoundingClientRect por quadro, enquanto a animação escrevia scrollTop.
   Isso é layout thrash clássico. Agora o palco publica UM valor de rolagem
   e cada tela deriva a própria posição por cálculo, sem tocar no layout. */
export type Palco = {
  ref: RefObject<HTMLElement | null>
  y: MotionValue<number>      /* scrollTop do palco */
  altura: number              /* altura de uma tela */
  /* velocidade normalizada da passagem, 0 a 1. É ela que aciona os efeitos
     de corte: obturador, arrasto de quadro e queda de luz. Um único valor
     para a página inteira — nenhuma tela mede nada por conta própria. */
  vel: MotionValue<number>
  /* falso em tela deitada/baixa, onde a rolagem é livre e a matemática de
     passagem não vale: aí os efeitos de corte ficam desligados. */
  passagem: boolean
}
export const ScrollCtx = createContext<Palco | null>(null)
export const usePalco = () => useContext(ScrollCtx)
