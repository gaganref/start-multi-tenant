import { createFileRoute, useHydrated } from "@tanstack/react-router"
import { toggleThemeMode, useTheme } from "@tanstack-themes/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/")({ component: Landing })

function Landing() {
  const [hostname, setHostname] = useState("")
  const [subdomain, setSubdomain] = useState<string | null>(null)

  useEffect(() => {
    const host = window.location.hostname
    setHostname(window.location.host)
    const parts = host.split(".")
    if (parts.length > 2) {
      setSubdomain(parts[0])
    }
  }, [])

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
        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Experimental Playground
            </span>
          </div>

          <h1
            className="animate-fade-up font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight"
            style={{ animationDelay: "80ms" }}
          >
            TanStack Start{" "}
            <span className="text-muted-foreground/40">×</span>
            <br />
            <span className="text-muted-foreground">
              Vercel Multi&#8209;Tenancy
            </span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-lg text-base leading-relaxed text-muted-foreground"
            style={{ animationDelay: "160ms" }}
          >
            A testing ground for exploring how TanStack Start pairs with
            Vercel&apos;s multi-tenancy primitives&thinsp;&mdash;&thinsp;subdomains,
            custom domains, middleware, and incremental static regeneration.
          </p>

          <div
            className="animate-fade-up mt-10 flex items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById("tests")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Tests
            </Button>
            <a
              href="https://github.com/TanStack/router"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-all hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
            >
              View Source
            </a>
          </div>

          {hostname && (
            <div
              className="animate-fade-up mt-14 max-w-sm"
              style={{ animationDelay: "320ms" }}
            >
              <div className="rounded-xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Live Context
                  </span>
                </div>
                <div className="space-y-2.5">
                  <ContextRow label="Host" value={hostname} />
                  <ContextRow label="Subdomain" value={subdomain ?? "none"} />
                  <ContextRow label="Tenant" value={subdomain ?? "root"} mono />
                </div>
              </div>
            </div>
          )}
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

const tests: Array<{
  title: string
  description: string
  status: "active" | "testing" | "planned"
  tag: string
}> = [
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
]

const stack = [
  "TanStack Start",
  "TanStack Router",
  "React 19",
  "Vite 7",
  "Nitro",
  "Tailwind v4",
  "shadcn/ui",
  "Vercel",
]

function ContextRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className={cn("truncate text-sm", mono && "font-mono")}>
        {value}
      </span>
    </div>
  )
}

function TestCard({
  title,
  description,
  status,
  tag,
}: {
  title: string
  description: string
  status: "active" | "testing" | "planned"
  tag: string
}) {
  const dotColor = {
    active: "bg-emerald-500",
    testing: "bg-amber-500",
    planned: "bg-zinc-300 dark:bg-zinc-600",
  }

  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-border/60 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70">
          {tag}
        </span>
        <div className={cn("size-2 rounded-full", dotColor[status])} />
      </div>
      <h3 className="mb-1.5 text-sm font-medium transition-colors group-hover:text-foreground">
        {title}
      </h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("size-1.5 rounded-full", color)} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function ThemeToggle() {
  const hydrated = useHydrated()
  const mode = useTheme((s) => s.mode)

  return (
    <button
      type="button"
      onClick={toggleThemeMode}
      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={`Theme: ${hydrated ? mode : "auto"}`}
    >
      {!hydrated || mode === "auto" ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      ) : mode === "light" ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  )
}
