import { useHydrated } from "@tanstack/react-router"

export function useTenantContext() {
  const hydrated = useHydrated()

  if (!hydrated || typeof window === "undefined") {
    return null
  }

  const { host, hostname } = window.location
  const parts = hostname.split(".")
  const subdomain = parts.length > 2 ? parts[0] : null

  return {
    host,
    subdomain,
    tenant: subdomain ?? "root",
  }
}
