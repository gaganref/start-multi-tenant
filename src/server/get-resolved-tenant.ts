import { createServerFn } from "@tanstack/react-start"
import { getMockResolvedTenant } from "@/lib/tenant/mock-tenant-context"
import { delay } from "@/lib/utils/delay"
import { getNormalizedRequestMeta } from "@/server/get-normalized-request-meta"

export const getResolvedTenant = createServerFn({ method: "GET" }).handler(
  async () => {
    const { normalizedHost } = getNormalizedRequestMeta()

    await delay(200)

    return getMockResolvedTenant(normalizedHost)
  }
)
