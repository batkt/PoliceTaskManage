import type { Metadata } from "next"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobListCards } from "@/components/job-list-cards"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Jobs - Task Management System",
  description: "Police Department Task Management System Jobs",
}

export default function JobsPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status || "all"

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Ажлын хяналт</h2>
        <p className="text-muted-foreground">Цагдаагийн газрын ажлын хяналт</p>
      </div>

      <Tabs defaultValue={status} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Бүгд</TabsTrigger>
          <TabsTrigger value="planned">Эхлээгүй</TabsTrigger>
          <TabsTrigger value="assigned">Хуваарилагдсан</TabsTrigger>
          <TabsTrigger value="checking">Шалгах</TabsTrigger>
          <TabsTrigger value="completed">Дууссан</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Бүх ажил</CardTitle>
              <CardDescription>Цагдаагийн газрын бүх ажлын жагсаалт</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<JobListCards status="all" isLoading={true} />}>
                <JobListCards status="all" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Эхлээгүй ажлууд</CardTitle>
              <CardDescription>Төлөвлөгдсөн боловч эхлээгүй байгаа ажлууд</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<JobListCards status="planned" isLoading={true} />}>
                <JobListCards status="planned" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Хуваарилагдсан ажлууд</CardTitle>
              <CardDescription>Ажилтанд хуваарилагдсан ажлууд</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<JobListCards status="assigned" isLoading={true} />}>
                <JobListCards status="assigned" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Шалгах ажлууд</CardTitle>
              <CardDescription>Шалгагдаж буй ажлууд</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<JobListCards status="checking" isLoading={true} />}>
                <JobListCards status="checking" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Дууссан ажлууд</CardTitle>
              <CardDescription>Амжилттай дууссан ажлууд</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<JobListCards status="completed" isLoading={true} />}>
                <JobListCards status="completed" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

