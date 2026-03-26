import { useEffect } from "react"
import { createFileRoute, getRouteApi } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { setMultiTenantDevtoolsRequestDebug } from "@/lib/devtools/multi-tenant-devtools-store"
import { listMockTenantHosts } from "@/lib/tenant/mock-tenant-context"
import { classifyHostname } from "@/lib/tenant/normalize-hostname"
import { accentLabel } from "@/lib/tenant/tenant-colors"
import { getRequestDebugInfo } from "@/server/get-request-debug-info"

const hostRoute = getRouteApi("/host/$hostKey")

export const Route = createFileRoute("/host/$hostKey/")({
  loader: async () => {
    return {
      requestDebug: await getRequestDebugInfo(),
    }
  },
  component: TenantOverviewPage,
})

function TenantOverviewPage() {
  const { resolvedTenant } = hostRoute.useLoaderData()
  const { requestDebug } = Route.useLoaderData()
  const hostnameInfo = classifyHostname(resolvedTenant.host)
  const tenantHosts = listMockTenantHosts().filter(
    (h) => h.tenantSlug === resolvedTenant.tenantSlug,
  )

  useEffect(() => {
    setMultiTenantDevtoolsRequestDebug(requestDebug)
  }, [requestDebug])

  return (
    <div className="space-y-8">
      {/* ── Tenant Identity ──────────────────────────── */}
      <section>
        <SectionLabel>Tenant Identity</SectionLabel>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <DataRow label="Name" value={resolvedTenant.tenantName} />
          <DataRow label="ID" value={resolvedTenant.tenantId} mono />
          <DataRow label="Slug" value={resolvedTenant.tenantSlug} mono />
          <DataRow label="Kind" value={resolvedTenant.kind} />
          <DataRow label="Status" value={resolvedTenant.status} />
          <DataRow
            label="Canonical host"
            value={resolvedTenant.canonicalHost}
            mono
          />
          <DataRow
            label="Primary"
            value={resolvedTenant.isPrimary ? "yes" : "no"}
          />
          <DataRow label="Classification" value={hostnameInfo.kind} />
        </div>
      </section>

      {/* ── Accent Branding ──────────────────────────── */}
      <section>
        <SectionLabel>Accent Branding</SectionLabel>
        <p className="mt-1 text-xs text-muted-foreground">
          Each tenant gets a unique Radix color scale for visual identity
        </p>
        <div className="mt-4 rounded-lg border border-border bg-card/60 p-4">
          <span className="font-mono text-xs text-muted-foreground">
            {accentLabel[resolvedTenant.accent]}
          </span>
          <div className="mt-3 grid grid-cols-6 gap-1.5">
            <div className="h-8 rounded-md border border-tenant-border bg-tenant-bg" />
            <div className="h-8 rounded-md border border-tenant-border bg-tenant-bg-hover" />
            <div className="h-8 rounded-md bg-tenant-solid" />
            <div className="h-8 rounded-md bg-tenant-solid-hover" />
            <div className="flex h-8 items-center justify-center rounded-md bg-muted/30">
              <span className="font-mono text-xs text-tenant-text">Aa</span>
            </div>
            <div className="flex h-8 items-center justify-center rounded-md bg-muted/30">
              <span className="font-mono text-xs font-bold text-tenant-contrast">
                Aa
              </span>
            </div>
          </div>
          <div className="mt-1.5 grid grid-cols-6 gap-1.5 font-mono text-[8px] text-muted-foreground/40">
            <span className="text-center">bg</span>
            <span className="text-center">hover</span>
            <span className="text-center">solid</span>
            <span className="text-center">s-hover</span>
            <span className="text-center">text</span>
            <span className="text-center">contrast</span>
          </div>
        </div>
      </section>

      {/* ── Host Bindings ────────────────────────────── */}
      <section>
        <SectionLabel>Host Bindings</SectionLabel>
        <p className="mt-1 text-xs text-muted-foreground">
          All hostnames that resolve to this tenant
        </p>
        <div className="mt-4 space-y-2">
          {tenantHosts.map((h) => (
            <div
              key={h.host}
              className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/10 px-4 py-2.5"
            >
              <span className="font-mono text-sm">{h.host}</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px]"
                >
                  {h.kind}
                </Badge>
                {h.isPrimary && (
                  <Badge
                    variant="outline"
                    className="border-tenant-solid/40 bg-tenant-bg font-mono text-[10px] text-tenant-text"
                  >
                    primary
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ── Inline components ─────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </h3>
  )
}

function DataRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/10 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
        {label}
      </p>
      <p className={mono ? "mt-1 font-mono text-sm" : "mt-1 text-sm"}>
        {value}
      </p>
    </div>
  )
}
