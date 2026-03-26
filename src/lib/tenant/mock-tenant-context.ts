import { normalizeHostname } from "@/lib/tenant/normalize-hostname"

export type ResolvedTenantContext = {
  host: string
  tenantId: string
  tenantSlug: string
  tenantName: string
  kind: "subdomain" | "custom-domain"
  canonicalHost: string
  isPrimary: boolean
  status: "active" | "suspended"
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
    },
  ],
])

export function getMockResolvedTenant(hostname: string) {
  return resolvedTenants.get(normalizeHostname(hostname)) ?? null
}

export function listMockTenantHosts() {
  return [...resolvedTenants.values()]
}
