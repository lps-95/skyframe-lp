import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* shadcn/ui — Button no Manual Skyframe.
   Sem dourado: a paleta é grafite, meia-noite, branco gelo.
   O ciano gelo é exclusivo de conteúdo de eventos (variante `evento`). */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono uppercase tracking-[.16em] " +
  "transition-all duration-500 ease-[cubic-bezier(.22,.61,.24,1)] disabled:pointer-events-none disabled:opacity-50 " +
  "outline-none focus-visible:ring-2 focus-visible:ring-gelo focus-visible:ring-offset-2 focus-visible:ring-offset-grafite " +
  "[&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* ação principal: texto SEMPRE branco gelo, em nenhum estado escurece.
           Placa em azul meia-noite com borda branco gelo — 13:1 de contraste. */
        default:
          "border border-gelo bg-meianoite text-gelo hover:bg-meianoite/70 hover:-translate-y-0.5 " +
          "hover:shadow-[0_14px_34px_rgb(22_35_63/.55)]",
        /* secundária: contorno, texto branco gelo */
        outline:
          "border border-gelo/30 bg-meianoite/40 text-gelo " +
          "hover:border-gelo hover:bg-meianoite/70 hover:-translate-y-0.5",
        /* eventos: única aplicação do ciano gelo */
        /* eventos: única aplicação do ciano gelo (texto segue claro) */
        evento:
          "border border-ciano bg-meianoite text-ciano hover:bg-ciano/12 hover:-translate-y-0.5 " +
          "hover:shadow-[0_14px_34px_rgb(94_234_212/.18)]",
        ghost: "text-gelo/70 hover:text-gelo",
      },
      size: {
        default: "px-6 py-3.5 text-[12px]",
        sm: "px-4 py-2.5 text-[11px]",
        lg: "px-8 py-4 text-[13px]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({ className, variant, size, asChild = false, ...props }:
  React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
export { Button, buttonVariants }
