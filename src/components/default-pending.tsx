import { Empty, EmptyHeader, EmptyMedia } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

export function DefaultPending() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Spinner className="size-6" />
          </EmptyMedia>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
