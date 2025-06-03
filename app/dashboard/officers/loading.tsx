import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function OfficersLoading() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Алба хаагчид</h2>
        <p className="text-muted-foreground">Цагдаагийн газрын алба хаагчид</p>
      </div>

      <Card>
        <CardContent>
          <div className="py-4">
            <Skeleton className="h-10 w-full md:max-w-[384px]"></Skeleton>
          </div>

          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
