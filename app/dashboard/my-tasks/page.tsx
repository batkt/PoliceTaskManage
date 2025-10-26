import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TableParams } from '@/components/data-table-v2';
import { getMyTaskList } from '@/ssr/service/task';
import { queryStringBuilder } from '@/lib/query.util';
import { isEmptyObject } from '@/lib/utils';
import { MyTaskCardList } from '@/components/task/list/card-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
// import MyTaskTableList from '@/components/task/list/my-task-table';
import WeeklyList from '@/components/task/weekly-list';

export const metadata: Metadata = {
  title: 'Миний даалгавал - Төлөвлөгөөний систем',
  // description: 'Police Department Task Management System My Tasks',
};

export default async function MyTasksPage(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const params = {
    startDate: searchParams?.startDate || new Date().toISOString(),
    sort: searchParams?.sort ?? '',
    order: (searchParams?.order as 'asc' | 'desc' | null) ?? null,
    filters: Object.fromEntries(
      Object.entries(searchParams).filter(
        ([k]) => !['page', 'pageSize', 'sort', 'order'].includes(k)
      )
    ),
  };

  const { filters, ...other } = params;
  const otherFilter = isEmptyObject(filters)
    ? {}
    : {
      ...filters,
    };

  const query = queryStringBuilder({
    ...other,
    ...otherFilter,
  });

  const res2 = await getMyTaskList(query);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Миний даалгавар</h2>
          <p className="text-muted-foreground">
            Танд хуваарилагдсан даалгаврууд
          </p>
        </div>
        <Link href="/dashboard/task/create-own">
          <Button type="button" size="icon" className="size-10">
            <Plus />
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <div className="lg:hidden">
            <MyTaskCardList params={params} data={res2.data} />
          </div>
          <div className="max-lg:hidden">
            {/* <MyTaskTableList params={params} data={res2.data} /> */}
            <WeeklyList data={res2.data} />
          </div>

        </Suspense>
      </div>
    </div>
  );
}
