import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { isEmptyObject } from '@/lib/utils';
import { queryStringBuilder } from '@/lib/query.util';
import { getTaskList } from '@/ssr/service/task';
import Statusbar from '@/components/task/list/statusbar';
import { MyTaskCardList } from '@/components/task/list/card-list';
import TaskTableList from '@/components/task/list/task-table';
import { TableParams } from '@/components/data-table-v2';

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

  const status = (searchParams?.status as string) || 'all';

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
  const res2 = await getTaskList(query);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ажлын жагсаалт</h2>
        <Button size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <Statusbar status={status} data={statuses} hideButton={true} />
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
