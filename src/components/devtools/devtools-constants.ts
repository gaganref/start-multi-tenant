import {
  Globe02Icon,
  Route01Icon,
  Building01Icon,
  ServerStack01Icon,
  Activity01Icon,
} from "@hugeicons/core-free-icons"

export type TabId = "tenant" | "location" | "rewrites" | "routes" | "headers"

export const TABS: Array<{
  id: TabId
  label: string
  icon: typeof Globe02Icon
}> = [
  { id: "tenant", label: "Tenant", icon: Building01Icon },
  { id: "location", label: "Location", icon: Globe02Icon },
  { id: "rewrites", label: "Rewrites", icon: Activity01Icon },
  { id: "routes", label: "Routes", icon: Route01Icon },
  { id: "headers", label: "Headers", icon: ServerStack01Icon },
]

export const IMPORTANT_HEADERS = new Set([
  "host",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-for",
  "forwarded",
  "user-agent",
  "accept",
  "accept-language",
  "accept-encoding",
  "referer",
  "origin",
  "cookie",
  "authorization",
])
