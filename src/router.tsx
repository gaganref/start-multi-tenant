import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import {
  isRootHost,
  normalizeHostname,
} from "@/lib/tenant/normalize-hostname"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    rewrite: {
      input: ({ url }) => {
        const hostKey = normalizeHostname(url.hostname)

        if (isRootHost(hostKey) || url.pathname.startsWith("/host/")) {
          return url
        }

        const suffix = url.pathname === "/" ? "" : url.pathname
        url.pathname = `/host/${encodeURIComponent(hostKey)}${suffix}`

        return url
      },
      output: ({ url }) => {
        const match = url.pathname.match(/^\/host\/([^/]+)(\/.*)?$/)

        if (!match) {
          return url
        }

        const [, , rest] = match
        url.pathname = rest || "/"

        return url
      },
    },
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
