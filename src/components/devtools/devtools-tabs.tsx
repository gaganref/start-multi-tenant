import { useState } from "react"
import { type useLocation } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Building01Icon,
  ServerStack01Icon,
  Search01Icon,
  Activity01Icon,
} from "@hugeicons/core-free-icons"
import {
  applyTenantInputRewrite,
  applyTenantOutputRewrite,
  type RewriteTrace,
} from "@/lib/tenant/rewrite-debug"
import { cn } from "@/lib/utils"
import { type useMultiTenantDevtoolsSnapshot } from "@/lib/devtools/multi-tenant-devtools-store"
import { IMPORTANT_HEADERS } from "./devtools-constants"
import {
  DataGrid,
  DataRow,
  SectionLabel,
  HeaderRow,
  KindBadge,
  StatusBadge,
  EmptyState,
} from "./devtools-primitives"

export function TenantTab({
  resolvedTenant,
  requestDebug,
}: {
  resolvedTenant: ReturnType<
    typeof useMultiTenantDevtoolsSnapshot
  >["resolvedTenant"]
  requestDebug: ReturnType<
    typeof useMultiTenantDevtoolsSnapshot
  >["requestDebug"]
}) {
  if (!resolvedTenant) {
    return (
      <EmptyState
        icon={Building01Icon}
        title="No tenant context"
        description="Navigate to a tenant host route to see resolution data here."
      />
    )
  }

  return (
    <div className="flex flex-col gap-px p-2.5 pb-3">
      <div className="mb-0.5 rounded-md border border-white/6 px-2.5 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="font-heading text-[15px] font-bold leading-tight tracking-tight text-[#fafafa]">
            {resolvedTenant.tenantName}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <KindBadge kind={resolvedTenant.kind} />
            <StatusBadge status={resolvedTenant.status} />
            {resolvedTenant.isPrimary && (
              <span className="rounded border border-yellow-500/20 px-1.5 text-[9px] font-bold tracking-wider text-yellow-500/70">
                PRIMARY
              </span>
            )}
          </div>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-[#52525b]">
          {resolvedTenant.tenantSlug}
          <span className="inline-block size-[3px] rounded-full bg-[#3f3f46]" />
          {resolvedTenant.tenantId}
        </div>
      </div>

      <SectionLabel>Resolution details</SectionLabel>
      <DataGrid>
        <DataRow label="Host key" value={resolvedTenant.host} copyable />
        <DataRow label="Tenant ID" value={resolvedTenant.tenantId} copyable />
        <DataRow
          label="Tenant slug"
          value={resolvedTenant.tenantSlug}
          copyable
        />
        <DataRow label="Binding" value={resolvedTenant.kind} />
        <DataRow
          label="Primary"
          value={resolvedTenant.isPrimary ? "Yes" : "No"}
        />
        <DataRow label="Status" value={resolvedTenant.status} />
      </DataGrid>

      {requestDebug && (
        <>
          <SectionLabel>Request snapshot</SectionLabel>
          <DataGrid>
            <DataRow label="Host" value={requestDebug.host} copyable />
            <DataRow label="Protocol" value={requestDebug.protocol} />
            <DataRow label="URL" value={requestDebug.url} copyable mono />
            <DataRow
              label="Headers"
              value={`${Object.keys(requestDebug.headers).length} captured`}
            />
          </DataGrid>
        </>
      )}
    </div>
  )
}

export function LocationTab({
  browserInfo,
  location,
  hasRewrite,
}: {
  browserInfo: { href: string; host: string; hostname: string } | null
  location: ReturnType<typeof useLocation>
  hasRewrite: boolean
}) {
  return (
    <div className="flex flex-col gap-px p-2.5 pb-3">
      {hasRewrite && (
        <div className="mb-0.5 flex items-center gap-1.5 rounded-[5px] border border-blue-500/12 bg-blue-500/8 px-2 py-1 text-[10.5px] font-medium text-blue-400">
          <HugeiconsIcon icon={Activity01Icon} size={13} />
          URL rewrite active — internal path differs from public URL
        </div>
      )}

      <SectionLabel>Browser</SectionLabel>
      <DataGrid>
        <DataRow
          label="href"
          value={browserInfo?.href ?? "n/a"}
          copyable
          mono
        />
        <DataRow label="host" value={browserInfo?.host ?? "n/a"} copyable />
        <DataRow label="hostname" value={browserInfo?.hostname ?? "n/a"} />
      </DataGrid>

      <SectionLabel>Router</SectionLabel>
      <DataGrid>
        <DataRow
          label="Public href"
          value={location.publicHref}
          copyable
          mono
        />
        <DataRow
          label="Internal href"
          value={location.href}
          copyable
          mono
          highlight={hasRewrite}
        />
        <DataRow label="Pathname" value={location.pathname} mono />
      </DataGrid>
    </div>
  )
}

export function RoutesTab({
  matches,
}: {
  matches: Array<{ routeId: string; params: Record<string, unknown> }>
}) {
  return (
    <div className="flex flex-col gap-px p-2.5 pb-3">
      <SectionLabel>
        Match stack
        <span className="rounded-full bg-white/6 px-1.5 text-[9px] font-semibold leading-4 text-[#71717a]">
          {matches.length}
        </span>
      </SectionLabel>
      <div className="flex flex-col">
        {matches.map((match, i) => {
          const paramCount = Object.keys(match.params).length
          const isLast = i === matches.length - 1
          return (
            <div key={match.routeId} className="flex gap-2.5">
              <div className="flex w-3 shrink-0 flex-col items-center pt-[5px]">
                <div
                  className={cn(
                    "size-2 shrink-0 rounded-full border-2 border-[#3f3f46] bg-[#27272a]",
                    isLast &&
                      "border-blue-400 bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]"
                  )}
                />
                {!isLast && (
                  <div className="my-0.5 w-px flex-1 bg-white/6" />
                )}
              </div>
              <div className="min-w-0 flex-1 pb-2 pt-[3px]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11.5px] font-semibold text-[#d4d4d8]">
                    {match.routeId}
                  </span>
                  {paramCount > 0 && (
                    <span className="rounded-full bg-violet-500/12 px-1.5 text-[9px] font-semibold leading-4 text-violet-400">
                      {paramCount} param{paramCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {paramCount > 0 && (
                  <div className="mt-[3px] overflow-hidden rounded border border-white/4">
                    {Object.entries(match.params).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex gap-2 border-b border-white/2 px-2 py-[3px] font-mono text-[10.5px]"
                      >
                        <span className="shrink-0 text-violet-400">{k}</span>
                        <span className="break-all text-[#a1a1aa]">
                          {String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function RewritesTab({
  browserInfo,
  location,
}: {
  browserInfo: { href: string; host: string; hostname: string } | null
  location: ReturnType<typeof useLocation>
}) {
  const publicUrl = browserInfo ? new URL(browserInfo.href) : null
  const inputTrace = publicUrl ? applyTenantInputRewrite(publicUrl).trace : null

  const outputBase =
    publicUrl?.origin ?? (typeof window !== "undefined" ? window.location.origin : null)
  const internalUrl =
    outputBase !== null ? new URL(location.href, outputBase) : null
  const outputTrace = internalUrl ? applyTenantOutputRewrite(internalUrl).trace : null

  if (!inputTrace && !outputTrace) {
    return (
      <EmptyState
        icon={Activity01Icon}
        title="No rewrite trace"
        description="Open this panel in the browser to inspect rewrite input and output transformations."
      />
    )
  }

  return (
    <div className="flex flex-col gap-px p-2.5 pb-3">
      {inputTrace && <RewriteCard trace={inputTrace} />}
      {outputTrace && <RewriteCard trace={outputTrace} />}
    </div>
  )
}

export function HeadersTab({
  headers,
  importantHeaders,
}: {
  headers: Array<[string, string]>
  importantHeaders: Array<[string, string]>
}) {
  const [filter, setFilter] = useState("")
  const [showAll, setShowAll] = useState(false)

  const displayHeaders = showAll ? headers : importantHeaders
  const filtered = filter
    ? displayHeaders.filter(
        ([k, v]) =>
          k.toLowerCase().includes(filter.toLowerCase()) ||
          v.toLowerCase().includes(filter.toLowerCase())
      )
    : displayHeaders

  if (headers.length === 0) {
    return (
      <EmptyState
        icon={ServerStack01Icon}
        title="No headers captured"
        description="Request headers appear after the host route loader runs."
      />
    )
  }

  return (
    <div className="flex flex-col gap-px p-2.5 pb-3">
      <div className="mb-1 flex items-center gap-1.5">
        <div className="flex flex-1 items-center gap-1.5 rounded-md border border-white/8 bg-white/2 px-2 py-1">
          <HugeiconsIcon
            icon={Search01Icon}
            size={13}
            className="shrink-0 opacity-40"
          />
          <input
            type="text"
            placeholder="Filter headers..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 border-none bg-transparent text-[11px] leading-[18px] text-[#d4d4d8] outline-none placeholder:text-[#52525b]"
          />
          {filter && (
            <button
              onClick={() => setFilter("")}
              className="cursor-pointer px-0.5 text-[13px] leading-none text-[#71717a]"
            >
              &times;
            </button>
          )}
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md border border-white/8 px-2.5 py-1 text-[10.5px] font-semibold text-[#71717a] transition-all",
            showAll && "border-blue-500/20 bg-blue-500/10 text-blue-400"
          )}
        >
          {showAll ? "All" : "Key"}
          <span className="font-medium opacity-60">
            {filtered.length}/{headers.length}
          </span>
        </button>
      </div>

      <div className="flex flex-col overflow-hidden rounded-md border border-white/6">
        {filtered.map(([key, value]) => (
          <HeaderRow
            key={key}
            name={key}
            value={value}
            isImportant={IMPORTANT_HEADERS.has(key.toLowerCase())}
          />
        ))}
        {filtered.length === 0 && (
          <div className="py-4 text-center text-[11px] text-[#52525b]">
            No headers match &ldquo;{filter}&rdquo;
          </div>
        )}
      </div>
    </div>
  )
}

function RewriteCard({ trace }: { trace: RewriteTrace }) {
  return (
    <>
      <SectionLabel>
        {trace.stage === "input" ? "Input rewrite" : "Output rewrite"}
        <span
          className={cn(
            "rounded-full px-1.5 text-[9px] font-semibold leading-4",
            trace.applied
              ? "bg-blue-500/12 text-blue-400"
              : "bg-white/6 text-[#71717a]"
          )}
        >
          {trace.applied ? "applied" : "skipped"}
        </span>
      </SectionLabel>
      <DataGrid>
        <DataRow label="Reason" value={trace.reason} />
        <DataRow
          label="Host key"
          value={trace.hostKey ?? "n/a"}
          copyable={!!trace.hostKey}
          mono
        />
        <DataRow
          label="Before path"
          value={trace.before.pathname}
          copyable
          mono
        />
        <DataRow
          label="After path"
          value={trace.after.pathname}
          copyable
          mono
          highlight={trace.applied}
        />
        <DataRow
          label="Before href"
          value={trace.before.href}
          copyable
          mono
        />
        <DataRow
          label="After href"
          value={trace.after.href}
          copyable
          mono
          highlight={trace.applied}
        />
      </DataGrid>
    </>
  )
}
