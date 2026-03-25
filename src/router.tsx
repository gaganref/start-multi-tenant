import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import {
  applyTenantInputRewrite,
  applyTenantOutputRewrite,
} from "@/lib/tenant/rewrite-debug"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    rewrite: {
      input: ({ url }) => {
        return applyTenantInputRewrite(url).url
      },
      output: ({ url }) => {
        return applyTenantOutputRewrite(url).url
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
