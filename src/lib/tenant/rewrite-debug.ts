import {
  isRootHost,
  normalizeHostname,
} from "@/lib/tenant/normalize-hostname"

type RewriteSnapshot = {
  href: string
  pathname: string
  hostname: string
}

export type RewriteTrace = {
  stage: "input" | "output"
  applied: boolean
  reason: string
  hostKey?: string
  before: RewriteSnapshot
  after: RewriteSnapshot
}

function createSnapshot(url: URL): RewriteSnapshot {
  return {
    href: url.href,
    pathname: url.pathname,
    hostname: url.hostname,
  }
}

export function applyTenantInputRewrite(sourceUrl: URL) {
  const nextUrl = new URL(sourceUrl.href)
  const hostKey = normalizeHostname(nextUrl.hostname)
  const before = createSnapshot(nextUrl)

  if (isRootHost(hostKey)) {
    return {
      url: nextUrl,
      trace: {
        stage: "input",
        applied: false,
        reason: "Skipped because the request host is a platform root host.",
        hostKey,
        before,
        after: createSnapshot(nextUrl),
      } satisfies RewriteTrace,
    }
  }

  if (nextUrl.pathname.startsWith("/host/")) {
    return {
      url: nextUrl,
      trace: {
        stage: "input",
        applied: false,
        reason: "Skipped because the URL is already on the internal host route.",
        hostKey,
        before,
        after: createSnapshot(nextUrl),
      } satisfies RewriteTrace,
    }
  }

  const suffix = nextUrl.pathname === "/" ? "" : nextUrl.pathname
  nextUrl.pathname = `/host/${encodeURIComponent(hostKey)}${suffix}`

  return {
    url: nextUrl,
    trace: {
      stage: "input",
      applied: true,
      reason:
        "Mapped the incoming host to the internal host route namespace for tenant resolution.",
      hostKey,
      before,
      after: createSnapshot(nextUrl),
    } satisfies RewriteTrace,
  }
}

export function applyTenantOutputRewrite(sourceUrl: URL) {
  const nextUrl = new URL(sourceUrl.href)
  const before = createSnapshot(nextUrl)
  const match = nextUrl.pathname.match(/^\/host\/([^/]+)(\/.*)?$/)

  if (!match) {
    return {
      url: nextUrl,
      trace: {
        stage: "output",
        applied: false,
        reason: "Skipped because the internal URL is not inside the host route namespace.",
        before,
        after: createSnapshot(nextUrl),
      } satisfies RewriteTrace,
    }
  }

  const [, hostKey, rest] = match
  nextUrl.pathname = rest || "/"

  return {
    url: nextUrl,
    trace: {
      stage: "output",
      applied: true,
      reason:
        "Stripped the internal host route prefix so the browser keeps the clean public URL.",
      hostKey: decodeURIComponent(hostKey),
      before,
      after: createSnapshot(nextUrl),
    } satisfies RewriteTrace,
  }
}
