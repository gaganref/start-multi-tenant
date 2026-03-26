import {
  getRequestHost,
  getRequestProtocol,
  getRequestUrl,
} from "@tanstack/react-start/server"
import { normalizeHostname } from "@/lib/tenant/normalize-hostname"

export function getNormalizedRequestMeta() {
  const host = getRequestHost({ xForwardedHost: true })
  const protocol = getRequestProtocol({ xForwardedProto: true })
  const url = getRequestUrl({
    xForwardedHost: true,
    xForwardedProto: true,
  })

  return {
    host,
    normalizedHost: normalizeHostname(host),
    protocol,
    url,
  }
}
