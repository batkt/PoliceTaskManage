import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Statusbar from '@/components/task/list/statusbar';
import { TableParams } from '@/components/data-table-v2';
import { getTaskList } from '@/ssr/service/task';
import TaskTableList from '@/components/task/list/task-table';
import { queryStringBuilder } from '@/lib/query.util';
import { isEmptyObject } from '@/lib/utils';
import { MyTaskCardList } from '@/components/task/list/card-list';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import SearchInput from '@/components/task/search-input';

export const metadata: Metadata = {
  title: 'Миний даалгавал - Төлөвлөгөөний систем',
  // description: 'Police Department Task Management System My Tasks',
};

export default async function MyTasksPage(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const params: TableParams = {
    page: Number(searchParams.page ?? 1),
    pageSize: Number(searchParams.pageSize ?? 10),
    sort: searchParams?.sort ?? '',
    order: (searchParams?.order as 'asc' | 'desc' | null) ?? null,
    filters: Object.fromEntries(
      Object.entries(searchParams).filter(
        ([k]) => !['page', 'pageSize', 'sort', 'order'].includes(k)
      )
    ),
  };

  const status = (searchParams?.status as string) || 'all';
  const title = (searchParams?.title as string) || '';

  const { filters, ...other } = params;
  const otherFilter = isEmptyObject(filters)
    ? {}
    : {
        ...filters,
      };

  const query = queryStringBuilder({
    ...other,
    ...otherFilter,
    onlyMe: true,
  });

  const res2 = await getTaskList(query);

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
            <TaskTableList params={params} data={res2.data} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
