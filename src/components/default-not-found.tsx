import { Link } from "@tanstack/react-router"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { buttonVariants } from "@/components/ui/button"

export function DefaultNotFound() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <span className="text-5xl font-bold tracking-tighter text-muted-foreground/60">
              404
            </span>
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            The page you're looking for doesn't exist or has been moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to="/" className={buttonVariants({ variant: "outline" })}>
            Go home
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  )
}
