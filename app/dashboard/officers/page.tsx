import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { OfficerList } from '@/components/officer/officer-list';
import { getUserList } from '@/ssr/service/user';
import { queryStringBuilder } from '@/lib/query.util';
import { TableParams } from '@/components/data-table-v2';
import { isEmptyObject } from '@/lib/utils';
import OfficerRegisterButton from '@/components/officer/officer-register-button';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { isAuthenticated } from '@/ssr/util';

export const metadata: Metadata = {
  title: 'Officers - Task Management System',
  description: 'Police Department Task Management System Officers',
};

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function OfficersPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const params: TableParams = {
    page: Number(searchParams.page ?? 1),
    pageSize: Number(searchParams.pageSize ?? 10),
    sort: searchParams?.sort as string,
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

  const token = await isAuthenticated();
  const res = await getUserList(query, token);

  const officerList = res.isOk ? res.data : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Алба хаагчид</h2>
          <p className="text-muted-foreground">
            Цагдаагийн газрын алба хаагчид
          </p>
        </div>
        <OfficerRegisterButton />
      </div>

      <div className="space-y-4">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <OfficerList data={officerList} params={params} />
        </Suspense>
      </div>
    </div>
  );
}
