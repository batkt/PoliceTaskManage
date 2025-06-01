import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import TaskList from '@/components/task/task-list';
import AddTaskButton from '@/components/task/add-task-button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'My Tasks - Task Management System',
  description: 'Police Department Task Management System My Tasks',
};

const statuses = [
  {
    key: 'all',
    name: 'Бүгд',
  },
  {
    key: 'pending',
    name: 'Эхлээгүй',
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
export default async function MyTasksPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const status = searchParams.status || 'all';

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Минии даалгавар</h2>
        <p className="text-muted-foreground">Танд оноогдсон даалгаврууд</p>
      </div>

      <div defaultValue={status} className="space-y-4">
        <div className="flex justify-between">
          <div className="flex gap-1 bg-muted rounded-md p-1">
            {statuses?.map((s) => {
              return (
                <Link key={s.key} href={`/dashboard/my-tasks?status=${s.key}`}>
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
          <div className="max-md:hidden">
            <AddTaskButton />
          </div>
        </div>

        <Card>
          <CardContent className="mt-4">
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <TaskList status={status} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
