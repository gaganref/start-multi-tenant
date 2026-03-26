import { useEffect, useState } from "react"
import { createFileRoute, getRouteApi } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const hostRoute = getRouteApi("/host/$hostKey")

export const Route = createFileRoute("/host/$hostKey/csr")({
  ssr: false,
  component: TenantCsrPage,
})

function TenantCsrPage() {
  const { resolvedTenant } = hostRoute.useLoaderData()
  const [hydratedAt, setHydratedAt] = useState<string | null>(null)

  useEffect(() => {
    setHydratedAt(new Date().toISOString())
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>CSR tenant page</CardTitle>
        <CardDescription>
          This page disables SSR at the route level. The timestamp below is set
          after mount, so it only appears once the client renders the page.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <DataRow label="Tenant" value={resolvedTenant.tenantName} />
        <DataRow label="Strategy" value="csr" />
        <DataRow
          label="Hydrated at"
          value={hydratedAt ?? "waiting for client mount..."}
          mono
        />
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
