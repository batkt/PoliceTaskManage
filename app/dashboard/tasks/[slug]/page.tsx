import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { isEmptyObject } from '@/lib/utils';
import { queryStringBuilder } from '@/lib/query.util';
import { getTaskListTest } from '@/ssr/service/task';
import { MyTaskCardList } from '@/components/task/list/card-list';
import TaskTableList from '@/components/task/list/task-table';
import { TableParams } from '@/components/data-table-v2';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getFormTemplate } from '@/ssr/service/form';

export const metadata: Metadata = {
  title: 'Tasks - Task Management System',
  description: 'Police Department Task Management System Tasks',
};

export default async function TasksPage(props: {
  params: Record<string, string>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = await props.params;
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
    formTemplateId: slug,
    ...otherFilter,
  });
  const templateRes = await getFormTemplate(slug);
  const res2 = await getTaskListTest(query);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ажлын жагсаалт</h2>
        <Link href={`/dashboard/task/create?formId=${slug}`}>
          <Button type="button" size="icon" className="size-10">
            <Plus />
          </Button>
        </Link>
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
              template={templateRes.data}
              tableKey="all-tasks"
              clickToDetail
            />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
