import { normalizeHostname } from "@/lib/tenant/normalize-hostname"

export type ResolvedTenantContext = {
  host: string
  tenantId: string
  tenantSlug: string
  tenantName: string
  kind: "subdomain" | "custom-domain"
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
      isPrimary: true,
      status: "active",
    },
  ],
  [
    "acme.test",
    {
      host: "acme.test",
      tenantId: "tenant_acme",
      tenantSlug: "acme",
      tenantName: "Acme Inc.",
      kind: "custom-domain",
      isPrimary: false,
      status: "active",
    },
  ],
  [
    "globex.test",
    {
      host: "globex.test",
      tenantId: "tenant_globex",
      tenantSlug: "globex",
      tenantName: "Globex Corp.",
      kind: "custom-domain",
      isPrimary: false,
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
