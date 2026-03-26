import { normalizeHostname } from "@/lib/tenant/normalize-hostname"
import type { TenantAccent } from "@/lib/tenant/tenant-colors"

export type ResolvedTenantContext = {
  host: string
  tenantId: string
  tenantSlug: string
  tenantName: string
  kind: "subdomain" | "custom-domain"
  canonicalHost: string
  isPrimary: boolean
  status: "active" | "suspended"
  accent: TenantAccent
}

const resolvedTenants = new Map<string, ResolvedTenantContext>([
  [
    "acme.localhost",
    {
      host: "acme.localhost",
      tenantId: "tenant_acme",
      tenantSlug: "acme",
      tenantName: "Acme Inc.",
      kind: "subdomain",
      canonicalHost: "acme.localhost",
      isPrimary: true,
      status: "active",
      accent: "blue",
    },
  ],
  [
    "globex.localhost",
    {
      host: "globex.localhost",
      tenantId: "tenant_globex",
      tenantSlug: "globex",
      tenantName: "Globex Corp.",
      kind: "subdomain",
      canonicalHost: "globex.localhost",
      isPrimary: true,
      status: "active",
      accent: "amber",
    },
  ],
  [
    "desapps.localhost",
    {
      host: "desapps.localhost",
      tenantId: "tenant_desapps",
      tenantSlug: "desapps",
      tenantName: "Desapps",
      kind: "subdomain",
      canonicalHost: "desapps.com",
      isPrimary: false,
      status: "active",
      accent: "violet",
    },
  ],
  [
    "acme.relio.dev",
    {
      host: "acme.relio.dev",
      tenantId: "tenant_acme",
      tenantSlug: "acme",
      tenantName: "Acme Inc.",
      kind: "subdomain",
      canonicalHost: "acme.relio.dev",
      isPrimary: true,
      status: "active",
      accent: "blue",
    },
  ],
  [
    "globex.relio.dev",
    {
      host: "globex.relio.dev",
      tenantId: "tenant_globex",
      tenantSlug: "globex",
      tenantName: "Globex Corp.",
      kind: "subdomain",
      canonicalHost: "globex.relio.dev",
      isPrimary: true,
      status: "active",
      accent: "amber",
    },
  ],
  [
    "desapps.relio.dev",
    {
      host: "desapps.relio.dev",
      tenantId: "tenant_desapps",
      tenantSlug: "desapps",
      tenantName: "Desapps",
      kind: "subdomain",
      canonicalHost: "desapps.com",
      isPrimary: false,
      status: "active",
      accent: "violet",
    },
  ],
  [
    "desapps.com",
    {
      host: "desapps.com",
      tenantId: "tenant_desapps",
      tenantSlug: "desapps",
      tenantName: "Desapps",
      kind: "custom-domain",
      canonicalHost: "desapps.com",
      isPrimary: true,
      status: "active",
      accent: "violet",
    },
  ],
])

export function getMockResolvedTenant(hostname: string) {
  return resolvedTenants.get(normalizeHostname(hostname)) ?? null
}

export function listMockTenantHosts() {
  return [...resolvedTenants.values()]
}

export type TenantSummary = {
  slug: string
  name: string
  accent: TenantAccent
  hosts: Array<{
    host: string
    kind: "subdomain" | "custom-domain"
    isPrimary: boolean
  }>
}

export function listUniqueTenants(): TenantSummary[] {
  const grouped = new Map<string, TenantSummary>()
  for (const tenant of resolvedTenants.values()) {
    let summary = grouped.get(tenant.tenantSlug)
    if (!summary) {
      summary = {
        slug: tenant.tenantSlug,
        name: tenant.tenantName,
        accent: tenant.accent,
        hosts: [],
      }
      grouped.set(tenant.tenantSlug, summary)
    }
    summary.hosts.push({
      host: tenant.host,
      kind: tenant.kind,
      isPrimary: tenant.isPrimary,
    })
  }
  return [...grouped.values()]
}
