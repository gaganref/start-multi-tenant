const PLATFORM_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "relio.dev",
  "www.relio.dev",
])

const TENANT_BASE_DOMAINS = ["relio.dev"] as const

export type HostClassification =
  | {
      kind: "platform"
      host: string
    }
  | {
      kind: "tenant-subdomain"
      host: string
      subdomain: string
      baseDomain: string
    }
  | {
      kind: "custom-domain"
      host: string
    }

export function normalizeHostname(hostname: string) {
  const withoutPort = hostname.split(":")[0] ?? hostname

  return withoutPort.trim().toLowerCase().replace(/\.$/, "")
}

export function classifyHostname(hostname: string): HostClassification {
  const host = normalizeHostname(hostname)

  if (PLATFORM_HOSTS.has(host)) {
    return {
      kind: "platform",
      host,
    }
  }

  if (host.endsWith(".localhost")) {
    return {
      kind: "tenant-subdomain",
      host,
      subdomain: host.replace(/\.localhost$/, ""),
      baseDomain: "localhost",
    }
  }

  for (const baseDomain of TENANT_BASE_DOMAINS) {
    if (host.endsWith(`.${baseDomain}`)) {
      return {
        kind: "tenant-subdomain",
        host,
        subdomain: host.slice(0, -(baseDomain.length + 1)),
        baseDomain,
      }
    }
  }

  return {
    kind: "custom-domain",
    host,
  }
}

export function isRootHost(hostname: string) {
  return classifyHostname(hostname).kind === "platform"
}
