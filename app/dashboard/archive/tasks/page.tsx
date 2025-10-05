import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { isEmptyObject } from '@/lib/utils';
import { queryStringBuilder } from '@/lib/query.util';
import { getArchivedTaskList } from '@/ssr/service/task';
import { MyTaskCardList } from '@/components/task/list/card-list';
import TaskTableList from '@/components/task/list/task-table';
import { TableParams } from '@/components/data-table-v2';

export const metadata: Metadata = {
  title: 'Tasks - Task Management System',
  description: 'Police Department Task Management System Tasks',
};

export default async function TasksPage(props: {
  params: Record<string, string>;
  searchParams: Promise<Record<string, string | undefined>>;
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

  const { filters, ...other } = params;
  const otherFilter = isEmptyObject(filters)
    ? {}
    : {
      ...filters,
    };

  const query = queryStringBuilder({
    ...other,
    ...otherFilter,
    isArchived: true
  });
  
  const res2 = await getArchivedTaskList(query);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Архив - Ажлын жагсаалт</h2>
      </div>
      <div className="space-y-4">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <div className="lg:hidden">
            <MyTaskCardList
              params={params}
              data={res2.data}
              tableKey="all-tasks"
              clickToDetail
            />
          </div>
          <div className="max-lg:hidden">
            <TaskTableList
              params={params}
              data={res2.data}
              tableKey="all-tasks"
              clickToDetail
            />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
