import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { OfficerList } from '@/components/officer/officer-list';
import { getUserList } from '@/ssr/service/user';
import { queryStringBuilder } from '@/lib/query.util';
import { TableParams } from '@/components/data-table-v2';
import { isEmptyObject } from '@/lib/utils';

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

  const res = await getUserList(query);
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Алба хаагчид</h2>
        <p className="text-muted-foreground">Цагдаагийн газрын алба хаагчид</p>
      </div>

      <Card>
        <CardContent>
          <OfficerList data={res.data} params={params} />
        </CardContent>
      </Card>
    </div>
  );
}
