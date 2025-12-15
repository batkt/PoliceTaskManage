import type { Metadata } from "next"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportList } from "@/components/report/report-list"
import { TableParams } from "@/components/data-table-v2"
import { getReportList } from "@/ssr/service/report"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { isEmptyObject } from "@/lib/utils"
import { queryStringBuilder } from "@/lib/query.util"
import Link from "next/link"
import ReportDownloader from "@/components/report/report-downloader"
import { isAuthenticated } from "@/ssr/util"

export const metadata: Metadata = {
  title: "Reports - Task Management System",
  description: "Police Department Task Management System Reports",
}

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function ReportsPage(props: {
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
    type: filters.type || 'weekly',
  });

  const token = await isAuthenticated();
  const res = await getReportList(query, token);

  const reportList = res.isOk ? res.data : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ажлын тайлан</h2>
          <p className="text-muted-foreground">
            Тайлант хугацааг сонгон өөрийн тайланг авна уу
          </p>
        </div>
        <ReportDownloader data={reportList} type={filters.type} />
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList className="w-fit">
            <TabsTrigger value="weekly" asChild>
              <Link href={`/dashboard/reports?type=weekly`}>7 хоног</Link>
            </TabsTrigger>
            <TabsTrigger value="monthly">
              <Link href={`/dashboard/reports?type=monthly`}>Сар</Link>
            </TabsTrigger>
            <TabsTrigger value="quarterly">
              <Link href={`/dashboard/reports?type=quarterly`}>Улирал</Link>
            </TabsTrigger>
            <TabsTrigger value="halfYearly">
              <Link href={`/dashboard/reports?type=halfYearly`}>Хагас жил</Link>
            </TabsTrigger>
            <TabsTrigger value="yearly">
              <Link href={`/dashboard/reports?type=yearly`}>Жил</Link>
            </TabsTrigger>
          </TabsList>
          <div className="space-y-4">
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <ReportList data={reportList} params={params} />
            </Suspense>
          </div>
        </Tabs>
      </div >
    </div >
  )
}

