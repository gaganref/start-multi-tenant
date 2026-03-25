import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import {
  ThemeProvider,
  useHtmlAttributes,
  useBodyAttributes,
} from "@tanstack-themes/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DefaultNotFound } from "@/components/default-not-found"
import { DefaultError } from "@/components/default-error"
import { DefaultPending } from "@/components/default-pending"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  notFoundComponent: DefaultNotFound,
  errorComponent: DefaultError,
  pendingComponent: DefaultPending,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Multi-Tenant Lab — TanStack Start x Vercel",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <ThemeProvider />
      <Outlet />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const htmlAttributes = useHtmlAttributes()
  const bodyAttributes = useBodyAttributes()

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <HeadContent />
      </head>
      <body {...bodyAttributes}>
        <TooltipProvider>{children}</TooltipProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
