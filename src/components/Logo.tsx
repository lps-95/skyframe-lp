import { cn } from "@/lib/utils"

/* 02 · Logotipo — só o nome, sem símbolo.
   "SKY" 700 + "FRAME" 300. Sem sombra, contorno ou brilho.
   Tamanho mínimo digital: 120px de largura. */
export function Logo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={cn("select-none font-marca leading-none tracking-[-0.01em] text-gelo", className)}
      style={{ minWidth: 120, ...style }}
      aria-label="Skyframe"
    >
      <span className="font-bold">SKY</span><span className="font-light">FRAME</span>
    </span>
  )
}
