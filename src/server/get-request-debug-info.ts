import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { redactRequestHeaders } from "@/lib/tenant/request-debug-info"
import { getNormalizedRequestMeta } from "@/server/get-normalized-request-meta"

export const getRequestDebugInfo = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = Object.fromEntries(getRequestHeaders().entries())
    const requestMeta = getNormalizedRequestMeta()

    return {
      host: requestMeta.host,
      normalizedHost: requestMeta.normalizedHost,
      protocol: requestMeta.protocol,
      url: requestMeta.url.toString(),
      headers: redactRequestHeaders(headers),
    }
  }
)
