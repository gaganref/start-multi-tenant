import { createServerFn } from "@tanstack/react-start"
import {
  getRequestHeaders,
  getRequestHost,
  getRequestProtocol,
  getRequestUrl,
} from "@tanstack/react-start/server"
import { redactRequestHeaders } from "@/lib/tenant/request-debug-info"

export const getRequestDebugInfo = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = Object.fromEntries(getRequestHeaders().entries())

    return {
      host: getRequestHost({ xForwardedHost: true }),
      protocol: getRequestProtocol({ xForwardedProto: true }),
      url: getRequestUrl({
        xForwardedHost: true,
        xForwardedProto: true,
      }).toString(),
      headers: redactRequestHeaders(headers),
    }
  }
)
