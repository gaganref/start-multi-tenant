import { createFileRoute, getRouteApi } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
    <Card>
      <CardHeader>
        <CardTitle>SSR tenant page</CardTitle>
        <CardDescription>
          This page has normal SSR enabled. The timestamp below comes from the
          route loader, so on the initial request it is rendered on the server.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <DataRow label="Tenant" value={resolvedTenant.tenantName} />
        <DataRow label="Strategy" value={strategy} />
        <DataRow label="Rendered at" value={renderedAt} mono />
        <DataRow label="Host" value={resolvedTenant.host} mono />
      </CardContent>
    </Card>
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
    <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={mono ? "mt-1 font-mono text-sm" : "mt-1 text-sm"}>{value}</p>
    </div>
  )
}
