import { motion } from "framer-motion"
import { frase, palavra } from "@/lib/motion"
import { cn } from "@/lib/utils"

type Parte = { texto: string; leve?: boolean; ciano?: boolean }

/* Cada palavra sobe de dentro de uma máscara — o gesto mais caro
   da página, e ainda assim só transform: roda na GPU. */
export function Frase({ partes, className, as: Tag = "h2" }:
  { partes: Parte[]; className?: string; as?: "h1" | "h2" }) {
  const palavras = partes.flatMap((p, pi) =>
    p.texto.split(" ").filter(Boolean).map((w, wi) => ({ w, leve: p.leve, ciano: p.ciano, k: `${pi}-${wi}` }))
  )
  return (
    <Tag className={className}>
      <motion.span variants={frase} className="inline">
        {palavras.map(({ w, leve, ciano, k }) => (
          <span key={k} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              variants={palavra}
              className={cn("inline-block will-change-transform", leve && "font-light", ciano && "text-ciano")}
            >
              {w}&nbsp;
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
