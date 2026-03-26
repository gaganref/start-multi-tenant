import { useEffect, useState } from "react"
import { createFileRoute, getRouteApi } from "@tanstack/react-router"
import { setMultiTenantDevtoolsRequestDebug } from "@/lib/devtools/multi-tenant-devtools-store"
import { getRequestDebugInfo } from "@/server/get-request-debug-info"

const hostRoute = getRouteApi("/host/$hostKey")

export const Route = createFileRoute("/host/$hostKey/csr")({
  ssr: false,
  loader: async () => {
    return {
      requestDebug: await getRequestDebugInfo(),
    }
  },
  component: TenantCsrPage,
})

function TenantCsrPage() {
  const { resolvedTenant } = hostRoute.useLoaderData()
  const { requestDebug } = Route.useLoaderData()
  const [hydratedAt, setHydratedAt] = useState<string | null>(null)

  useEffect(() => {
    setHydratedAt(new Date().toISOString())
  }, [])

  useEffect(() => {
    setMultiTenantDevtoolsRequestDebug(requestDebug)
  }, [requestDebug])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          Client-Side Rendering
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          This page sets{" "}
          <code className="font-mono text-xs text-foreground">ssr: false</code>{" "}
          at the route level. The timestamp is set via{" "}
          <code className="font-mono text-xs text-foreground">useEffect</code>{" "}
          after the client mounts.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DataRow label="Tenant" value={resolvedTenant.tenantName} />
        <DataRow label="Strategy" value="csr" mono />
        <DataRow
          label="Hydrated at"
          value={hydratedAt ?? "waiting for client mount\u2026"}
          mono
        />
        <DataRow label="Host" value={resolvedTenant.host} mono />
      </div>

      <div className="rounded-lg border border-border/70 bg-muted/10 p-4">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          How it works
        </p>
        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-px text-tenant-solid">&bull;</span>
            <span>
              Route has{" "}
              <code className="font-mono text-[11px] text-foreground">
                ssr: false
              </code>
              , so no server HTML is generated for this page
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-px text-tenant-solid">&bull;</span>
            <span>
              On initial load, the page shell arrives empty &mdash; content
              renders after JavaScript loads
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-px text-tenant-solid">&bull;</span>
            <span>
              <code className="font-mono text-[11px] text-foreground">
                useEffect
              </code>{" "}
              fires after mount and sets the timestamp
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-px text-tenant-solid">&bull;</span>
            <span>
              Compare with the SSR page &mdash; notice the SSR timestamp is set
              immediately
            </span>
          </li>
        </ul>
      </div>
    </div>
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
