import { useEffect } from "react"
import { Link, Outlet, createFileRoute, notFound } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  clearMultiTenantDevtoolsSnapshot,
  setMultiTenantDevtoolsSnapshot,
} from "@/lib/devtools/multi-tenant-devtools-store"
import { listMockTenantHosts } from "@/lib/tenant/mock-tenant-context"
import { normalizeHostname } from "@/lib/tenant/normalize-hostname"
import { getRequestDebugInfo } from "@/server/get-request-debug-info"
import { getResolvedTenant } from "@/server/get-resolved-tenant"

export const Route = createFileRoute("/host/$hostKey")({
  staleTime: Infinity,
  beforeLoad: ({ params }) => {
    if (normalizeHostname(params.hostKey) !== params.hostKey) {
      throw notFound()
    }

    return {
      hostKey: params.hostKey,
    }
  },
  loader: async ({ params }) => {
    const [resolvedTenant, requestDebug] = await Promise.all([
      getResolvedTenant(),
      getRequestDebugInfo(),
    ])

    if (!resolvedTenant || resolvedTenant.host !== params.hostKey) {
      throw notFound()
    }

    return {
      resolvedTenant,
      requestDebug,
    }
  },
  notFoundComponent: UnknownHostNotFound,
  component: TenantBoundary,
})

function TenantBoundary() {
  const { resolvedTenant, requestDebug } = Route.useLoaderData()

  useEffect(() => {
    setMultiTenantDevtoolsSnapshot({
      resolvedTenant,
      requestDebug,
    })

    return () => {
      clearMultiTenantDevtoolsSnapshot()
    }
  }, [requestDebug, resolvedTenant])

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
              This shell owns the tenant loader and keeps the resolved tenant
              data close to the route that fetched it.
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

        <Outlet />
      </div>
    </main>
  )
}

function UnknownHostNotFound() {
  const { hostKey } = Route.useParams()
  const platformHref = getPlatformHref(hostKey)

  return (
    <div className="flex min-h-[60svh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Unknown tenant host
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {hostKey} is not configured
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The host matched the tenant route shape, but the resolver could not
          find any tenant context for it.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {platformHref ? (
            <a
              href={platformHref}
              className={buttonVariants({ variant: "outline" })}
            >
              Go to platform root
            </a>
          ) : null}
          <Link to="/" className={buttonVariants({ variant: "ghost" })}>
            Retry current host
          </Link>
        </div>
      </div>
    </div>
  )
}

function getPlatformHref(hostKey: string) {
  if (hostKey.endsWith(".localhost")) {
    return "http://localhost:3000/"
  }

  return null
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
