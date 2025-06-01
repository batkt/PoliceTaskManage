import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TasksResponsiveView } from '@/components/tasks-responsive-view';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { queryStringBuilder } from '@/lib/query.util';
import { getTaskList } from '@/ssr/service/task';

export const metadata: Metadata = {
  title: 'Tasks - Task Management System',
  description: 'Police Department Task Management System Tasks',
};

const statuses = [
  {
    key: 'all',
    name: 'Бүгд',
  },
  {
    key: 'active',
    name: 'Идэвхитэй',
  },
  {
    key: 'processing',
    name: 'Хийгдэж байгаа',
  },
  {
    key: 'completed',
    name: 'Дууссан',
  },
];

export default async function TasksPage(props: {
  searchParams: Promise<Record<string, string | number | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const status = searchParams.status || 'all';

  let qParams = {
    page: parseInt(searchParams.page as string) || 1,
    pageSize: parseInt(searchParams.pageSize as string) || 10,
    sortBy: searchParams?.sortBy as string,
    sortOrder: searchParams?.sortOrder as 'asc' | 'desc',
    status: status,
  };

  const query = queryStringBuilder(qParams);
  const res = await getTaskList(query);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ажлын жагсаалт</h2>
        <Button>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-1 bg-muted rounded-md p-1">
        {statuses?.map((s) => {
          return (
            <Link key={s.key} href={`/dashboard/tasks?status=${s.key}`}>
              <div
                className={cn(
                  'rounded-sm px-3 py-1.5 text-sm',
                  status !== s.key ? 'bg-transparent' : 'bg-background'
                )}
              >
                {s.name}
              </div>
            </Link>
          );
        })}
      </div>
      <Card>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <TasksResponsiveView
              status="completed"
              data={res?.code === 200 ? res.data : undefined}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
