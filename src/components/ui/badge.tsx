import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* shadcn/ui — Badge */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono uppercase tracking-[.22em] text-[10px]",
  {
    variants: {
      variant: {
        default: "border-gelo/35 text-gelo/85",
        muted: "border-gelo/20 text-gelo/55",
        evento: "border-ciano/60 text-ciano",
      },
    },
    defaultVariants: { variant: "default" },
  }
)
function Badge({ className, variant, asChild = false, ...props }:
  React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}
export { Badge, badgeVariants }
