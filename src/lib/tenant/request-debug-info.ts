export type RequestDebugInfo = {
  host: string
  protocol: string
  url: string
  headers: Record<string, string>
}

const REDACTED_HEADERS = new Set([
  "authorization",
  "cookie",
  "proxy-authorization",
  "set-cookie",
])

export function redactRequestHeaders(headers: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => {
      if (REDACTED_HEADERS.has(key.toLowerCase())) {
        return [key, "[redacted]"]
      }

      return [key, value]
    })
  )
}
