import { cn } from "@/lib/utils"

export function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("size-1.5 rounded-full", color)} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
