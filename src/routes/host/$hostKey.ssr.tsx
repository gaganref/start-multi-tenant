import { createFileRoute, getRouteApi } from "@tanstack/react-router"

const hostRoute = getRouteApi("/host/$hostKey")

export const Route = createFileRoute("/host/$hostKey/ssr")({
  loader: async () => {
    return {
      renderedAt: new Date().toISOString(),
      strategy: "ssr" as const,
    }
  },
  component: TenantSsrPage,
})

function TenantSsrPage() {
  const { resolvedTenant } = hostRoute.useLoaderData()
  const { renderedAt, strategy } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          Server-Side Rendering
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          This page uses a route loader that executes on the server. The
          timestamp was generated during the server render pass.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DataRow label="Tenant" value={resolvedTenant.tenantName} />
        <DataRow label="Strategy" value={strategy} mono />
        <DataRow label="Rendered at" value={renderedAt} mono />
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
              Route has a{" "}
              <code className="font-mono text-[11px] text-foreground">
                loader()
              </code>{" "}
              that generates a timestamp on the server
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-px text-tenant-solid">&bull;</span>
            <span>
              On initial load, HTML arrives with the timestamp already rendered
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-px text-tenant-solid">&bull;</span>
            <span>
              On client navigation, the loader re-runs on the server
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-px text-tenant-solid">&bull;</span>
            <span>Compare with the CSR page to see the difference</span>
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
