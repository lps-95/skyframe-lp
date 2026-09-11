import * as React from "react"
import { cn } from "@/lib/utils"

/* shadcn/ui — Card. Superfície = azul meia-noite em opacidade (tom derivado),
   como manda o manual: profundidade sem introduzir cor nova. */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card"
      className={cn(
        "flex flex-col gap-2 border border-gelo/12 bg-meianoite/35 p-5 text-left",
        "transition-all duration-500 ease-[cubic-bezier(.22,.61,.24,1)]",
        "hover:-translate-y-1.5 hover:border-gelo/30 hover:bg-meianoite/60",
        className)}
      {...props} />
  )
}
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1.5", className)} {...props} />
}
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("font-marca text-[19px] font-semibold leading-tight tracking-tight text-gelo", className)} {...props} />
}
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-[14px] leading-relaxed text-gelo/60", className)} {...props} />
}
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("", className)} {...props} />
}
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("mt-auto flex flex-col gap-3 border-t border-gelo/12 pt-3", className)} {...props} />
}
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
