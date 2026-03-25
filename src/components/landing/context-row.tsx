import { cn } from "@/lib/utils"

export function ContextRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className={cn("truncate text-sm", mono && "font-mono")}>
        {value}
      </span>
    </div>
  )
}
