import { TableParams } from '@/components/data-table-v2';
import TaskTypesList from '@/components/task-type/task-types-list';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllForms } from '@/ssr/service/form';
import Link from 'next/link';
import React, { Suspense } from 'react';

const TaskTypePage = async (props: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const searchParams = await props.searchParams;
  const params: TableParams = {
    page: 1,
    pageSize: 1000,
    filters: Object.fromEntries(
      Object.entries(searchParams).filter(
        ([k]) => !['page', 'pageSize', 'sort', 'order'].includes(k)
      )
    ),
  };

  const res = await getAllForms();

  const typesData = res.code === 200 ? res.data || [] : [];

  const sorted = typesData?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Даалгаврын төрлийн жагсаалт
          </h2>
          <p className="text-muted-foreground">
            Даалгавар үүсгэх боломжтой төрлүүд
          </p>
        </div>

        <Link href="/dashboard/task-type/create">
          <Button type="button">Үүсгэх</Button>
        </Link>
      </div>

      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TaskTypesList data={sorted} params={params} />
      </Suspense>
    </div>
  );
};

export default TaskTypePage;
