import { createFileRoute } from "@tanstack/react-router"
import { ContextRow } from "@/components/landing/context-row"
import { Legend } from "@/components/landing/legend"
import { Reveal } from "@/components/landing/reveal"
import { TestCard, type TestCardProps } from "@/components/landing/test-card"
import { ThemeToggle } from "@/components/landing/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { useTenantContext } from "@/hooks/use-tenant-context"
import { listMockTenantHosts } from "@/lib/tenant/mock-tenant-context"

export const Route = createFileRoute("/")({ component: Landing })

const tests = [
  {
    title: "Subdomain Routing",
    description:
      "Tenant resolution via subdomain parsing. Each subdomain maps to a unique tenant context.",
    status: "testing",
    tag: "multi-tenancy",
  },
  {
    title: "Custom Domains",
    description:
      "Map custom domains to specific tenants using Vercel's domain configuration API.",
    status: "planned",
    tag: "vercel",
  },
  {
    title: "Edge Middleware",
    description:
      "Vercel middleware for request-time tenant resolution, rewrites, and auth checks.",
    status: "testing",
    tag: "vercel",
  },
  {
    title: "ISR",
    description:
      "Incremental Static Regeneration with TanStack Start loaders on Vercel infrastructure.",
    status: "planned",
    tag: "tanstack",
  },
  {
    title: "SSR Streaming",
    description:
      "React 19 streaming SSR with Suspense boundaries and progressive hydration.",
    status: "active",
    tag: "react",
  },
  {
    title: "Deployment Pipeline",
    description:
      "End-to-end Vercel deployment with edge functions, serverless, and static assets.",
    status: "active",
    tag: "vercel",
  },
] satisfies ReadonlyArray<TestCardProps>

const stack = [
  "TanStack Start",
  "TanStack Router",
  "React 19",
  "Vite 7",
  "Nitro",
  "Tailwind v4",
  "shadcn/ui",
  "Vercel",
] as const

const mockHosts = listMockTenantHosts()

function Landing() {
  const tenantContext = useTenantContext()

  return (
    <div className="min-h-svh">
      <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-foreground">
              <span className="text-[11px] font-bold text-background">MT</span>
            </div>
            <span className="text-sm font-medium tracking-tight">
              multi-tenant
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </a>
            <a
              href="https://github.com/TanStack/router"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="dot-pattern absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-6xl flex-col justify-center px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <Reveal delay={0}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Experimental Playground
            </span>
          </Reveal>

          <Reveal
            delay={80}
            as="h1"
            className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight"
          >
            <>
              TanStack Start <span className="text-muted-foreground/40">×</span>
              <br />
              <span className="text-muted-foreground">
                Vercel Multi&#8209;Tenancy
              </span>
            </>
          </Reveal>

          <Reveal
            delay={160}
            as="p"
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground"
          >
            A testing ground for exploring how TanStack Start pairs with
            Vercel&apos;s multi-tenancy primitives&thinsp;&mdash;&thinsp;subdomains,
            custom domains, middleware, and incremental static regeneration.
          </Reveal>

          <Reveal delay={240} className="mt-10 flex items-center gap-3">
            <a
              href="#tests"
              className={buttonVariants({ size: "lg" })}
            >
              Explore Tests
            </a>
            <a
              href="https://github.com/TanStack/router"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              View Source
            </a>
          </Reveal>

          <Reveal delay={320} className="mt-14 max-w-sm min-h-38">
            <div className="rounded-xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  Live Context
                </span>
              </div>
              <div className="space-y-2.5">
                <ContextRow
                  label="Host"
                  value={tenantContext?.host ?? "resolving..."}
                  mono
                />
                <ContextRow
                  label="Subdomain"
                  value={tenantContext?.subdomain ?? "none"}
                />
                <ContextRow
                  label="Tenant"
                  value={tenantContext?.tenant ?? "root"}
                  mono
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={380} className="mt-6 max-w-2xl">
            <div className="rounded-xl border border-border bg-card/60 p-5 shadow-sm backdrop-blur-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Mock Tenant Hosts
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mockHosts.map((tenant) => (
                  <span
                    key={tenant.host}
                    className="rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {tenant.host}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="tests" className="border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl tracking-tight">
                Test Matrix
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Features and integrations under evaluation
              </p>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <Legend color="bg-emerald-500" label="Active" />
              <Legend color="bg-amber-500" label="In Progress" />
              <Legend
                color="bg-zinc-300 dark:bg-zinc-600"
                label="Planned"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <TestCard key={test.title} {...test} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-lg tracking-tight">Stack</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>Multi-Tenant Lab</span>
          <span>TanStack Start + Vercel</span>
        </div>
      </footer>
    </div>
  )
}
