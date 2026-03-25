import { Link, createFileRoute, getRouteApi } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { listMockTenantHosts } from "@/lib/tenant/mock-tenant-context"

export const Route = createFileRoute("/host/$hostKey/")({
  component: TenantIndexPage,
})

const hostRoute = getRouteApi("/host/$hostKey")

function TenantIndexPage() {
  const { resolvedTenant } = hostRoute.useLoaderData()

  return (
    <main className="min-h-svh bg-background px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Tenant boundary</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {resolvedTenant.tenantName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{resolvedTenant.kind}</Badge>
            <Badge
              variant={
                resolvedTenant.status === "active" ? "default" : "destructive"
              }
            >
              {resolvedTenant.status}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resolved tenant context</CardTitle>
            <CardDescription>
              This page is matched through router rewrite and resolved once at
              the `/host/$hostKey` loader.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <ContextRow label="Host key" value={resolvedTenant.host} />
            <ContextRow label="Tenant ID" value={resolvedTenant.tenantId} />
            <ContextRow label="Tenant slug" value={resolvedTenant.tenantSlug} />
            <ContextRow label="Tenant name" value={resolvedTenant.tenantName} />
            <ContextRow label="Binding kind" value={resolvedTenant.kind} />
            <ContextRow
              label="Primary host"
              value={resolvedTenant.isPrimary ? "yes" : "no"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Try these hosts</CardTitle>
            <CardDescription>
              The in-memory resolver is keyed by normalized hostname, so these
              are the values currently supported.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {listMockTenantHosts().map((tenant) => (
              <div
                key={tenant.host}
                className="rounded-lg border border-border/70 bg-muted/30 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm">{tenant.host}</span>
                  <Badge variant="outline">{tenant.kind}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tenant.tenantName} ({tenant.tenantSlug})
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Link to="/" className={buttonVariants({ variant: "outline" })}>
            Back to root
          </Link>
        </div>
      </div>
    </main>
  )
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm">{value}</p>
    </div>
  )
}
