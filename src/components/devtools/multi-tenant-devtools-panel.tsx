import type { ReactNode } from "react"
import { useMemo } from "react"
import { useLocation, useRouterState } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useMultiTenantDevtoolsSnapshot } from "@/lib/devtools/multi-tenant-devtools-store"

const IMPORTANT_HEADERS = new Set([
  "host",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-for",
  "forwarded",
  "user-agent",
  "accept",
  "accept-language",
  "accept-encoding",
  "referer",
  "origin",
  "cookie",
  "authorization",
])

export function MultiTenantDevtoolsPanel() {
  const location = useLocation()
  const matches = useRouterState({
    select: (state) =>
      state.matches.map((match) => ({
        routeId: match.routeId,
        params: match.params,
      })),
  })
  const { requestDebug, resolvedTenant } = useMultiTenantDevtoolsSnapshot()
  const browserInfo =
    typeof window === "undefined"
      ? null
      : {
          href: window.location.href,
          host: window.location.host,
          hostname: window.location.hostname,
        }

  const headers = useMemo(
    () =>
      Object.entries(requestDebug?.headers ?? {}).sort(([a], [b]) =>
        a.localeCompare(b)
      ),
    [requestDebug]
  )

  const importantHeaders = headers.filter(([key]) =>
    IMPORTANT_HEADERS.has(key.toLowerCase())
  )

  return (
    <div className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Multi-tenant lab
          </p>
          <h2 className="text-sm font-semibold tracking-tight">
            Tenant routing devtools
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={resolvedTenant ? "default" : "outline"}>
            {resolvedTenant ? "tenant route" : "platform route"}
          </Badge>
          <Badge variant={location.href !== location.publicHref ? "secondary" : "outline"}>
            {location.href !== location.publicHref ? "rewrite active" : "no rewrite"}
          </Badge>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          <Section title="Location">
            <KeyValue label="Browser href" value={browserInfo?.href ?? "n/a"} />
            <KeyValue label="Browser host" value={browserInfo?.host ?? "n/a"} />
            <KeyValue
              label="Browser hostname"
              value={browserInfo?.hostname ?? "n/a"}
            />
            <KeyValue label="Public href" value={location.publicHref} />
            <KeyValue label="Internal href" value={location.href} />
            <KeyValue label="Pathname" value={location.pathname} />
          </Section>

          <Section title="Route matches">
            <div className="space-y-2">
              {matches.map((match) => (
                <div
                  key={match.routeId}
                  className="rounded-lg border border-border/70 bg-muted/20 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm">{match.routeId}</span>
                    <Badge variant="outline">
                      {Object.keys(match.params).length} params
                    </Badge>
                  </div>
                  <pre className="mt-2 overflow-x-auto text-xs text-muted-foreground">
                    {JSON.stringify(match.params, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Resolved tenant">
            {resolvedTenant ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <KeyValue label="Host key" value={resolvedTenant.host} />
                <KeyValue label="Tenant ID" value={resolvedTenant.tenantId} />
                <KeyValue label="Tenant slug" value={resolvedTenant.tenantSlug} />
                <KeyValue label="Tenant name" value={resolvedTenant.tenantName} />
                <KeyValue label="Binding kind" value={resolvedTenant.kind} />
                <KeyValue
                  label="Primary host"
                  value={resolvedTenant.isPrimary ? "yes" : "no"}
                />
                <KeyValue label="Status" value={resolvedTenant.status} />
              </div>
            ) : (
              <EmptyState message="No tenant context is loaded for the current route." />
            )}
          </Section>

          <Section title="Request snapshot">
            {requestDebug ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <KeyValue label="Resolved host" value={requestDebug.host} />
                <KeyValue label="Protocol" value={requestDebug.protocol} />
                <KeyValue label="Request URL" value={requestDebug.url} />
                <KeyValue
                  label="Header count"
                  value={String(Object.keys(requestDebug.headers).length)}
                />
              </div>
            ) : (
              <EmptyState message="Request debug info is only available once the host route loader runs." />
            )}
          </Section>

          <Section title="Important headers">
            {importantHeaders.length ? (
              <HeaderList headers={importantHeaders} />
            ) : (
              <EmptyState message="No important request headers were captured." />
            )}
          </Section>

          <Section title="All headers">
            {headers.length ? (
              <HeaderList headers={headers} />
            ) : (
              <EmptyState message="No request headers were captured." />
            )}
          </Section>
        </div>
      </ScrollArea>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="px-4 py-3">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </div>
      <Separator />
      <div className="p-4">{children}</div>
    </section>
  )
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all font-mono text-sm">{value}</p>
    </div>
  )
}

function HeaderList({ headers }: { headers: Array<[string, string]> }) {
  return (
    <div className="space-y-2">
      {headers.map(([key, value]) => (
        <div
          key={key}
          className="grid gap-2 rounded-lg border border-border/70 bg-muted/20 p-3 sm:grid-cols-[220px_minmax(0,1fr)]"
        >
          <div className="font-mono text-xs text-muted-foreground">{key}</div>
          <div className="break-all font-mono text-xs">{value}</div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border/70 bg-muted/10 p-4 text-sm text-muted-foreground">
      {message}
    </div>
  )
}
