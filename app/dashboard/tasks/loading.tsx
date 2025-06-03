import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ажлын жагсаалт</h2>
        <Skeleton className="h-10 w-10 rounded-md"></Skeleton>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-10 w-full md:max-w-[400px]"></Skeleton>
        </div>

        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}
