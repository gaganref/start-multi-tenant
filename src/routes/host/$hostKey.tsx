import { Fragment, useEffect } from "react"
import {
  Link,
  Outlet,
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  clearMultiTenantDevtoolsSnapshot,
  setMultiTenantDevtoolsSnapshot,
} from "@/lib/devtools/multi-tenant-devtools-store"
import {
  classifyHostname,
  normalizeHostname,
} from "@/lib/tenant/normalize-hostname"
import { getRequestDebugInfo } from "@/server/get-request-debug-info"
import { getResolvedTenant } from "@/server/get-resolved-tenant"

export const Route = createFileRoute("/host/$hostKey")({
  staleTime: Infinity,
  beforeLoad: ({ params }) => {
    if (normalizeHostname(params.hostKey) !== params.hostKey) {
      throw notFound()
    }
    return { hostKey: params.hostKey }
  },
  loader: async ({ params }) => {
    const [resolvedTenant, requestDebug] = await Promise.all([
      getResolvedTenant(),
      getRequestDebugInfo(),
    ])

    if (!resolvedTenant || resolvedTenant.host !== params.hostKey) {
      throw notFound()
    }

    return { resolvedTenant, requestDebug }
  },
  notFoundComponent: UnknownHostNotFound,
  component: TenantBoundary,
})

const tabClasses = {
  base: "border-b-2 px-4 py-3 font-mono text-xs transition-colors",
  active: "border-tenant-solid text-tenant-text font-medium",
  inactive: "border-transparent text-muted-foreground hover:text-foreground",
}

function TenantBoundary() {
  const { resolvedTenant, requestDebug } = Route.useLoaderData()
  const hostnameInfo = classifyHostname(resolvedTenant.host)

  useEffect(() => {
    setMultiTenantDevtoolsSnapshot({ resolvedTenant, requestDebug })
    return () => clearMultiTenantDevtoolsSnapshot()
  }, [requestDebug, resolvedTenant])

  const journey = [
    {
      num: "01",
      title: "Request",
      data: resolvedTenant.host,
    },
    {
      num: "02",
      title: "Parse",
      data:
        hostnameInfo.kind === "tenant-subdomain"
          ? `sub: "${hostnameInfo.subdomain}" \u00b7 base: "${hostnameInfo.baseDomain}"`
          : hostnameInfo.kind === "custom-domain"
            ? "custom domain binding"
            : "platform host",
    },
    {
      num: "03",
      title: "Resolve",
      data: `${resolvedTenant.tenantId} \u2192 ${resolvedTenant.tenantName}`,
    },
    {
      num: "04",
      title: "Render",
      data: "tenant shell + child route",
    },
  ]

  return (
    <div
      data-accent={resolvedTenant.accent}
      className="min-h-dvh bg-background"
    >
      {/* ── Accent bar ───────────────────────────────── */}
      <div className="h-0.5 bg-tenant-solid" />

      {/* ── Header ───────────────────────────────────── */}
      <header className="border-b border-border/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <Link
              to="/"
              className="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; back to lab
            </Link>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {resolvedTenant.tenantName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[10px]">
              {resolvedTenant.kind}
            </Badge>
            <Badge
              className="font-mono text-[10px]"
              variant={
                resolvedTenant.status === "active" ? "default" : "destructive"
              }
            >
              {resolvedTenant.status}
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        {/* ── Request Journey ────────────────────────── */}
        <section className="border-b border-border/40 py-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Request Journey
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
            {journey.map((step, i) => (
              <Fragment key={step.num}>
                {i > 0 && (
                  <>
                    <div className="hidden shrink-0 items-center px-2 text-muted-foreground/25 sm:flex">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 7h8M8 3.5 11.5 7 8 10.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex justify-center py-0.5 sm:hidden">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-muted-foreground/25"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 3v8M3.5 8 7 11.5 10.5 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </>
                )}
                <div className="flex-1 rounded-md border border-border/70 bg-muted/10 p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-muted-foreground/20">
                      {step.num}
                    </span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {step.title}
                    </span>
                  </div>
                  <p className="mt-1.5 font-mono text-xs text-tenant-text">
                    {step.data}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </section>

        {/* ── Tab Navigation ─────────────────────────── */}
        <nav className="flex gap-0 border-b border-border/40">
          <Link
            to="/host/$hostKey"
            params={{ hostKey: resolvedTenant.host }}
            activeOptions={{ exact: true }}
            className={tabClasses.base}
            activeProps={{ className: tabClasses.active }}
            inactiveProps={{ className: tabClasses.inactive }}
          >
            Overview
          </Link>
          <Link
            to="/host/$hostKey/ssr"
            params={{ hostKey: resolvedTenant.host }}
            className={tabClasses.base}
            activeProps={{ className: tabClasses.active }}
            inactiveProps={{ className: tabClasses.inactive }}
          >
            SSR
          </Link>
          <Link
            to="/host/$hostKey/csr"
            params={{ hostKey: resolvedTenant.host }}
            className={tabClasses.base}
            activeProps={{ className: tabClasses.active }}
            inactiveProps={{ className: tabClasses.inactive }}
          >
            CSR
          </Link>
        </nav>

        {/* ── Child route content ────────────────────── */}
        <div className="py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function UnknownHostNotFound() {
  const { hostKey } = Route.useParams()
  const platformHref = getPlatformHref(hostKey)

  return (
    <div className="flex min-h-[60dvh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Unknown tenant host
        </p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight">
          {hostKey} is not configured
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The host matched the tenant route shape, but the resolver could not
          find any tenant context for it.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {platformHref && (
            <a
              href={platformHref}
              className={buttonVariants({ variant: "outline" })}
            >
              Go to platform root
            </a>
          )}
          <Link to="/" className={buttonVariants({ variant: "ghost" })}>
            Retry current host
          </Link>
        </div>
      </div>
    </div>
  )
}

function getPlatformHref(hostKey: string) {
  if (hostKey.endsWith(".localhost")) return "http://localhost:3000/"
  if (hostKey.endsWith(".relio.dev")) return "https://relio.dev/"
  return null
}
