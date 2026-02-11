import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { isEmptyObject } from '@/lib/utils';
import { queryStringBuilder } from '@/lib/query.util';
import { getArchivedTaskList } from '@/ssr/service/task';
import { MyTaskCardList } from '@/components/task/list/card-list';
import TaskTableList from '@/components/task/list/task-table';
import { TableParams } from '@/components/data-table-v2';
import { isAuthenticated } from '@/ssr/util';

export const metadata: Metadata = {
  title: 'Архив - Ажлын жагсаалт - Ажил гүйцэтгэлийн систем',
  description: 'Police Department Task Management System Archived Tasks',
};

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function ArchivedTasksPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const token = await isAuthenticated();

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
  });

  const res = await getArchivedTaskList(query, token);

  const taskList = res.isOk ? res.data : {
    rows: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Архив - Ажлын жагсаалт</h2>
          <p className="text-muted-foreground">
            Архивлагдсан даалгаврын жагсаалт
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <div className="lg:hidden">
            <MyTaskCardList
              params={params}
              data={taskList}
              tableKey="archived-tasks"
              clickToDetail
            />
          </div>
          <div className="max-lg:hidden">
            <TaskTableList
              params={params}
              data={taskList}
              tableKey="archived-tasks"
              clickToDetail
            />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
