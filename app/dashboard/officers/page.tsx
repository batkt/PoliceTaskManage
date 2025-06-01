import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { OfficerList } from '@/components/officer-list';
import { getUserList } from '@/ssr/service/user';
import { queryStringBuilder } from '@/lib/query.util';

export const metadata: Metadata = {
  title: 'Officers - Task Management System',
  description: 'Police Department Task Management System Officers',
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function OfficersPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  let qParams = {
    page: parseInt(searchParams.page as string) || 1,
    pageSize: parseInt(searchParams.pageSize as string) || 2,
    sortBy: searchParams?.sortBy as string,
    sortOrder: searchParams?.sortOrder as 'asc' | 'desc',
    filters: searchParams?.filters
      ? decodeURIComponent(searchParams.filters as string)
      : undefined,
  };

  const query = queryStringBuilder(qParams);
  const res = await getUserList(query);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Алба хаагчид</h2>
          <p className="text-muted-foreground">
            Цагдаагийн газрын алба хаагчид
          </p>
        </div>
        {/* <Button asChild>
          <Link href="/dashboard/officers/new">
            <Plus className=" h-4 w-4" />
          </Link>
        </Button> */}
      </div>

      <Card>
        {/* <CardTitle>Бүх ажилтан</CardTitle>
          <CardDescription>
            Цагдаагийн газрын бүх ажилтнуудын жагсаалт
          </CardDescription> */}
        <CardContent>
          <OfficerList
            data={res.data}
            pagination={{
              page: qParams.page,
              pageSize: qParams.pageSize,
            }}
            sort={{
              sortBy: qParams.sortBy,
              sortOrder: qParams.sortOrder,
            }}
            filters={qParams?.filters ? JSON.parse(qParams.filters) : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
}
