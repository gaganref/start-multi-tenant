import { Outlet, createFileRoute, notFound } from "@tanstack/react-router"
import { normalizeHostname } from "@/lib/tenant/normalize-hostname"
import { getResolvedTenant } from "@/server/get-resolved-tenant"

export const Route = createFileRoute("/host/$hostKey")({
  staleTime: Infinity,
  beforeLoad: ({ params }) => {
    if (normalizeHostname(params.hostKey) !== params.hostKey) {
      throw notFound()
    }
  },
  loader: async ({ params }) => {
    const resolvedTenant = await getResolvedTenant()

    if (!resolvedTenant || resolvedTenant.host !== params.hostKey) {
      throw notFound()
    }

    return {
      resolvedTenant,
    }
  },
  component: TenantBoundary,
})

function TenantBoundary() {
  return <Outlet />
}
