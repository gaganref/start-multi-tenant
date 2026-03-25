const ROOT_HOSTS = new Set(["localhost", "127.0.0.1", "::1"])

export function normalizeHostname(hostname: string) {
  const withoutPort = hostname.split(":")[0] ?? hostname

  return withoutPort.trim().toLowerCase().replace(/\.$/, "")
}

export function isRootHost(hostname: string) {
  return ROOT_HOSTS.has(normalizeHostname(hostname))
}
