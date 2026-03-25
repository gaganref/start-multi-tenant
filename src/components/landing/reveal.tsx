import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function Reveal({
  as: Component = "div",
  delay,
  className,
  children,
}: {
  as?: "div" | "h1" | "p"
  delay: number
  className?: string
  children: ReactNode
}) {
  return (
    <Component
      className={cn("animate-fade-up", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  )
}
