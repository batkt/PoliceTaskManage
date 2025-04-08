import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportList } from "@/components/report-list"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Reports - Task Management System",
  description: "Police Department Task Management System Reports",
}

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Өөрийн тайлан</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Шинэ тайлан
        </Button>
      </div>
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Сарын</TabsTrigger>
          <TabsTrigger value="quarterly">Улирлын</TabsTrigger>
          <TabsTrigger value="yearly">Жилийн</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Сарын тайлан</CardTitle>
              <CardDescription>Сарын тайлангууд энд харагдана</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportList type="monthly" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quarterly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Улирлын тайлан</CardTitle>
              <CardDescription>Улирлын тайлангууд энд харагдана</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportList type="quarterly" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="yearly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Жилийн тайлан</CardTitle>
              <CardDescription>Жилийн тайлангууд энд харагдана</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportList type="yearly" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

