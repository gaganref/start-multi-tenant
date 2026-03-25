import { cn } from "@/lib/utils"

export type TestStatus = "active" | "testing" | "planned"

export type TestCardProps = {
  title: string
  description: string
  status: TestStatus
  tag: string
}

const statusDotClasses: Record<TestStatus, string> = {
  active: "bg-emerald-500",
  testing: "bg-amber-500",
  planned: "bg-zinc-300 dark:bg-zinc-600",
}

export function TestCard({
  title,
  description,
  status,
  tag,
}: TestCardProps) {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-border/60 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70">
          {tag}
        </span>
        <div className={cn("size-2 rounded-full", statusDotClasses[status])} />
      </div>
      <h3 className="mb-1.5 text-sm font-medium transition-colors group-hover:text-foreground">
        {title}
      </h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
