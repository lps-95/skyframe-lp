import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

/* shadcn/ui — Accordion (Radix)
   A altura anima via --radix-accordion-content-height + keyframes do index.css. */

function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn("w-full", className)} {...props} />
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "group border-b border-gelo/12 transition-colors duration-500",
        "hover:border-gelo/30 data-[state=open]:border-gelo/45",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 cursor-pointer items-center justify-between gap-4 py-3.5 text-left",
          "font-marca text-[15px] font-semibold leading-snug tracking-tight",
          "outline-none transition-colors duration-500",
          "hover:text-white data-[state=open]:text-white",
          "focus-visible:ring-2 focus-visible:ring-gelo focus-visible:ring-offset-2 focus-visible:ring-offset-grafite",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <Plus
          aria-hidden
          className="size-4 shrink-0 text-gelo/45 transition-transform duration-500 ease-[cubic-bezier(.22,.61,.24,1)]
                     group-data-[state=open]:rotate-[135deg] group-data-[state=open]:text-gelo"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
      {...props}
    >
      <div className={cn("pb-4 pr-8 text-[13.5px] leading-relaxed text-gelo/60", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
