import { Fragment } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { ThemeToggle } from "@/components/landing/theme-toggle"
import { useTenantContext } from "@/hooks/use-tenant-context"
import {
  listUniqueTenants,
  type TenantSummary,
} from "@/lib/tenant/mock-tenant-context"

export const Route = createFileRoute("/")({ component: Landing })

const tenants = listUniqueTenants()

const pipeline = [
  {
    num: "01",
    title: "Request",
    desc: "Browser sends a request to a tenant hostname",
    example: "acme.localhost:3000",
  },
  {
    num: "02",
    title: "Parse",
    desc: "Router classifies the hostname and extracts subdomain",
    example: 'subdomain \u2192 "acme"',
  },
  {
    num: "03",
    title: "Resolve",
    desc: "Server loader maps hostname to tenant context",
    example: "tenant_acme \u2192 Acme Inc.",
  },
  {
    num: "04",
    title: "Render",
    desc: "Route renders with full tenant context available",
    example: "/host/acme.localhost/*",
  },
]

function Landing() {
  const ctx = useTenantContext()
  const port = ctx?.host?.split(":")[1] ?? ""

  return (
    <div className="min-h-dvh">
      {/* ── Nav ──────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-6 items-center justify-center rounded bg-foreground">
              <span className="font-mono text-[9px] font-bold text-background">
                MT
              </span>
            </div>
            <span className="font-mono text-xs tracking-tight text-muted-foreground">
              multi-tenant lab
            </span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="dot-pattern absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-5xl px-6 pt-16 pb-14 sm:pt-20 sm:pb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Experimental Playground
          </span>

          <h1 className="mt-5 text-3xl tracking-tight sm:text-4xl">
            Multi-Tenant Lab
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Understand how multi-tenancy works with TanStack Start and
            Vercel&apos;s platform
            primitives&thinsp;&mdash;&thinsp;subdomains, custom domains, URL
            rewrites, and tenant-scoped rendering.
          </p>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────── */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <SectionHeader
            label="How multi-tenancy works"
            desc="The request lifecycle in 4 steps"
          />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0">
            {pipeline.map((step, i) => (
              <Fragment key={step.num}>
                {i > 0 && <StepArrow />}
                <div className="flex-1 rounded-lg border border-border bg-card/60 p-4">
                  <span className="font-mono text-xl font-bold text-muted-foreground/20">
                    {step.num}
                  </span>
                  <p className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-wider">
                    {step.title}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                  <div className="mt-3 rounded-md bg-muted/50 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground">
                    {step.example}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Context ─────────────────────────────── */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <SectionHeader
            label="Live context"
            desc="What the server sees for your current request"
          />

          <div className="mt-6 max-w-md rounded-lg border border-border bg-card/60 p-5">
            <div className="space-y-3">
              <ContextRow
                label="host"
                value={ctx?.host ?? "resolving\u2026"}
              />
              <ContextRow
                label="subdomain"
                value={ctx?.subdomain ?? "none"}
              />
              <ContextRow
                label="tenant"
                value={
                  ctx?.tenant === "root"
                    ? "root (platform host)"
                    : (ctx?.tenant ?? "resolving\u2026")
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Explore Tenants ──────────────────────────── */}
      <section className="border-b border-border/40 bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <SectionHeader
            label="Explore tenants"
            desc="Enter a tenant to see multi-tenancy in action"
          />

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {tenants.map((tenant) => (
              <TenantCard key={tenant.slug} tenant={tenant} port={port} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">
          <span>Multi-Tenant Lab</span>
          <span>TanStack Start + Vercel</span>
        </div>
      </footer>
    </div>
  )
}

/* ── Inline components ─────────────────────────────────── */

function SectionHeader({ label, desc }: { label: string; desc: string }) {
  return (
    <div>
      <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground/70">{desc}</p>
    </div>
  )
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="shrink-0 font-mono text-[11px] text-muted-foreground/60">
        {label}
      </span>
      <span className="truncate font-mono text-sm">{value}</span>
    </div>
  )
}

function StepArrow() {
  return (
    <>
      {/* Desktop: horizontal arrow */}
      <div className="hidden shrink-0 items-center px-2 text-muted-foreground/25 sm:flex">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* Mobile: vertical arrow */}
      <div className="flex justify-center py-0.5 sm:hidden">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-muted-foreground/25"
        >
          <path
            d="M8 3v10M4 9l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  )
}

function TenantCard({
  tenant,
  port,
}: {
  tenant: TenantSummary
  port: string
}) {
  const kinds = [...new Set(tenant.hosts.map((h) => h.kind))]

  return (
    <div
      data-accent={tenant.accent}
      className="overflow-hidden rounded-xl border border-border/60 bg-card transition-colors hover:border-tenant-border/50"
    >
      <div className="h-0.5 bg-gradient-to-r from-tenant-solid to-tenant-solid-hover" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="size-2 shrink-0 rounded-full bg-tenant-solid" />
              <span className="text-sm font-semibold tracking-tight">
                {tenant.name}
              </span>
            </div>
            <p className="mt-0.5 pl-4 font-mono text-[11px] text-muted-foreground/60">
              {tenant.slug}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-1">
            {kinds.map((kind) => (
              <span
                key={kind}
                className="rounded-full bg-muted/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
              >
                {kind}
              </span>
            ))}
          </div>
        </div>

        {/* Host links */}
        <div className="mt-4 divide-y divide-border/30 overflow-hidden rounded-lg border border-border/40">
          {tenant.hosts.map((h) => {
            const isLocal = h.host.endsWith(".localhost")
            const displayHost = isLocal
              ? `${h.host}:${port || "3000"}`
              : h.host
            const href = isLocal
              ? `http://${h.host}:${port || "3000"}/`
              : `https://${h.host}/`

            return (
              <a
                key={h.host}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-2 bg-muted/5 px-3 py-2.5 transition-colors hover:bg-tenant-bg"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-mono text-[12px] text-muted-foreground transition-colors group-hover:text-foreground">
                    {displayHost}
                  </span>
                  {h.isPrimary && (
                    <span className="shrink-0 rounded bg-tenant-bg px-1.5 py-px font-mono text-[9px] font-medium text-tenant-text">
                      primary
                    </span>
                  )}
                </div>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="shrink-0 text-muted-foreground/20 transition-colors group-hover:text-tenant-text"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8.5 8.5 3.5m0 0H5m3.5 0V7"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
