import { useCallback, useState, type ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Globe02Icon,
  Route01Icon,
  Copy01Icon,
  Tick01Icon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [text])

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      className="inline-flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded text-[#71717a]"
    >
      <HugeiconsIcon
        icon={copied ? Tick01Icon : Copy01Icon}
        size={11}
        className={cn("opacity-40", copied && "opacity-100")}
      />
    </button>
  )
}

export function DataGrid({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-white/6">
      {children}
    </div>
  )
}

export function DataRow({
  label,
  value,
  copyable,
  mono,
  highlight,
}: {
  label: string
  value: string
  copyable?: boolean
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-2.5 border-b border-white/3 px-2 py-[3px]",
        highlight && "bg-blue-500/6"
      )}
    >
      <span className="shrink-0 text-[11px] text-[#71717a]">{label}</span>
      <span
        className={cn(
          "inline-flex flex-wrap items-center justify-end gap-1 text-right text-xs font-medium text-[#d4d4d8] break-all",
          mono && "font-mono text-[11px]"
        )}
      >
        {value}
        {copyable && <CopyButton text={value} />}
      </span>
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 pb-[3px] pt-[7px] text-[9.5px] font-bold uppercase tracking-wider text-[#52525b]">
      {children}
    </div>
  )
}

export function HeaderRow({
  name,
  value,
  isImportant,
}: {
  name: string
  value: string
  isImportant: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const isLong = value.length > 60
  const displayValue = !isLong || expanded ? value : value.slice(0, 60) + "…"

  return (
    <div
      className={cn(
        "border-b border-white/3 px-2 py-[3px] transition-colors",
        isImportant && "bg-blue-500/3"
      )}
    >
      <div className="flex items-center gap-1 font-mono text-[10.5px] font-semibold text-[#a1a1aa]">
        {isImportant && (
          <span className="inline-block size-1 shrink-0 rounded-full bg-blue-500" />
        )}
        {name}
        <CopyButton text={value} />
      </div>
      <div
        className={cn(
          "font-mono text-[10.5px] leading-relaxed text-[#71717a] break-all",
          isLong && !expanded && "cursor-pointer"
        )}
        onClick={isLong && !expanded ? () => setExpanded(true) : undefined}
      >
        {displayValue}
        {isLong && !expanded && (
          <span className="ml-1 font-sans text-[9px] italic text-[#52525b]">
            click to expand
          </span>
        )}
      </div>
    </div>
  )
}

export function StatusPill({
  active,
  label,
  color,
}: {
  active: boolean
  label: string
  color: "green" | "amber" | "blue" | "neutral"
}) {
  const styles = {
    green: "bg-green-500/12 text-green-400",
    amber: "bg-amber-500/12 text-amber-400",
    blue: "bg-blue-500/12 text-blue-400",
    neutral: "bg-white/4 text-[#737373]",
  }
  const dots = {
    green: "bg-green-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    neutral: "bg-[#525252]",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-[5px] rounded-full py-px pl-[5px] pr-[7px] text-[10px] font-medium leading-4",
        styles[color]
      )}
    >
      <span
        className={cn("inline-block size-1.5 rounded-full", dots[color])}
        style={active ? { boxShadow: "0 0 6px currentColor" } : undefined}
      />
      {label}
    </div>
  )
}

export function KindBadge({ kind }: { kind: string }) {
  const isCustom = kind === "custom-domain"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-[7px] py-px text-[10px] font-semibold uppercase tracking-wide",
        isCustom
          ? "bg-violet-500/15 text-violet-300"
          : "bg-blue-500/15 text-blue-400"
      )}
    >
      <HugeiconsIcon icon={isCustom ? Globe02Icon : Route01Icon} size={10} />
      {kind}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-[7px] py-px text-[10px] font-semibold uppercase tracking-wide",
        isActive
          ? "bg-green-500/15 text-green-400"
          : "bg-red-500/15 text-red-400"
      )}
    >
      <HugeiconsIcon
        icon={isActive ? CheckmarkCircle02Icon : CancelCircleIcon}
        size={10}
      />
      {status}
    </span>
  )
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: typeof Globe02Icon
  title: string
  description: string
}) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-2.5 px-5 py-10">
      <div className="flex size-11 items-center justify-center rounded-[10px] border border-white/6 bg-white/3 text-[#3f3f46]">
        <HugeiconsIcon icon={icon} size={24} />
      </div>
      <div className="text-[13px] font-semibold text-[#a1a1aa]">{title}</div>
      <div className="max-w-[240px] text-center text-[11px] leading-relaxed text-[#52525b]">
        {description}
      </div>
    </div>
  )
}
