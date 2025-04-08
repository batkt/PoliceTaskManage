import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function JobCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2 min-w-0">
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-md" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 w-full max-w-[180px]" />
            <div className="mt-1 flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
        <Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
      </div>
      <div className="p-4">
        <div className="mb-4 flex justify-between">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-5 w-20" />
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-5 w-20" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full border-2 border-background" />
            ))}
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </Card>
  )
}

