import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Миний даалгавар</h2>
        <p className="text-muted-foreground">Танд хуваарилагдсан даалгаврууд</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-10 max-md:flex-1 md:w-full md:max-w-[400px]"></Skeleton>
          <Skeleton className="h-10 w-10 md:w-[150px] rounded-md"></Skeleton>
        </div>

        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}
