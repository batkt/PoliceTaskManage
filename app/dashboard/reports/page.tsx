import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { ReportList } from "@/components/report/report-list"
import { TableParams } from "@/components/data-table-v2"
import { getReportList } from "@/ssr/service/report"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

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

  // const { filters, ...other } = params;
  // const otherFilter = isEmptyObject(filters)
  //   ? {}
  //   : {
  //     ...filters,
  //   };

  // const query = queryStringBuilder({
  //   ...other,
  //   ...otherFilter,
  // });

  const res = await getReportList();

  console.log("--------------------------- ", res.data)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ажлын тайлан</h2>
          <p className="text-muted-foreground">
            Тайлант хугацааг сонгон өөрийн тайланг авна уу
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Тайлан татах
        </Button>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList className="w-fit">
            <TabsTrigger value="weekly">7 хоног</TabsTrigger>
            <TabsTrigger value="monthly">Сар</TabsTrigger>
            <TabsTrigger value="quarterly">Улирал</TabsTrigger>
            <TabsTrigger value="halfYearly">Хагас жил</TabsTrigger>
            <TabsTrigger value="yearly">Жил</TabsTrigger>
          </TabsList>
          <div className="space-y-4">
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <ReportList type="yearly" data={res.data} params={params} />
            </Suspense>
          </div>
        </Tabs>
      </div >
    </div >
  )
}

