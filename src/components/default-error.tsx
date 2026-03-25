import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { Button, buttonVariants } from "@/components/ui/button"

export function DefaultError({ error, reset }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="flex min-h-[60svh] items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-destructive"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            {error.message || "An unexpected error occurred."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                reset()
                router.invalidate()
              }}
            >
              Try again
            </Button>
            <Link to="/" className={buttonVariants({ variant: "outline" })}>
              Go home
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
