import { createServerFn } from "@tanstack/react-start"
import { getRequestHost } from "@tanstack/react-start/server"
import { getMockResolvedTenant } from "@/lib/tenant/mock-tenant-context"
import { normalizeHostname } from "@/lib/tenant/normalize-hostname"
import { delay } from "@/lib/utils/delay"

export const getResolvedTenant = createServerFn({ method: "GET" }).handler(
  async () => {
    const requestHost = normalizeHostname(getRequestHost())

    await delay(200)

    return getMockResolvedTenant(requestHost)
  }
)
