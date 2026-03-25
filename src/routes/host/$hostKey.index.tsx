import { createFileRoute } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/host/$hostKey/")({
  component: TenantIndexPage,
})

function TenantIndexPage() {
  const { hostKey } = Route.useRouteContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant home page</CardTitle>
        <CardDescription>
          This child route is intentionally dumb. It reads the tiny bit of
          route context returned from the parent `beforeLoad` and lets the
          parent host route own the real tenant loader data and shell.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Current tenant key from route context:
        </p>
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 font-mono text-sm">
          {hostKey}
        </div>
      </CardContent>
    </Card>
  )
}
