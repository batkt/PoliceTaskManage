import type { Metadata } from 'next';
// import Link from 'next/link';
// import { Suspense } from 'react';
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { TaskCompletionChart } from '@/components/task-completion-chart';
// import { TaskPerformanceChart } from '@/components/task-performance-chart';
// import { JobListCards } from '@/components/job-list-cards';
// import { Button } from '@/components/ui/button';
// import { ArrowRight } from 'lucide-react';
// import { Skeleton } from '@/components/ui/skeleton';
import { getTaskCounts } from '@/ssr/service/dashboard';
import DashboardProvider from '@/context/dashboard.context';
import TaskCounts from '@/components/dashboard/task-counts';

export const metadata: Metadata = {
  title: 'Dashboard - Task Management System',
  description: 'Police Department Task Management System Dashboard',
};

export default async function DashboardPage() {
  const res = await getTaskCounts();
  const taskCounts = res.code === 200 ? res.data : null;

  return (
    <DashboardProvider stats={taskCounts}>
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Хянах самбар</h2>
          <p className="text-muted-foreground">
            Цагдаагийн газрын даалгаврын удирдлагын систем
          </p>
        </div>
        <TaskCounts />
        {/* <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Ерөнхий</TabsTrigger>
          <TabsTrigger value="tasks">Даалгавар</TabsTrigger>
          <TabsTrigger value="reports">Тайлан</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Даалгаврын гүйцэтгэл</CardTitle>
                <CardDescription>Нийт даалгаврын төлөв</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <TaskCompletionChart />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ажилтнуудын гүйцэтгэл</CardTitle>
                <CardDescription>
                  Топ 10 ажилтны даалгаврын гүйцэтгэл
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <TaskPerformanceChart />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Минии даалгавар</CardTitle>
                <CardDescription>Танд оноогдсон даалгаврууд</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/my-tasks">
                  Бүгдийг харах
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={<JobListCards status="all" isLoading={true} />}
              >
                <JobListCards status="all" />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ажлын хяналт</CardTitle>
                <CardDescription>Сүүлийн ажлууд</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/jobs">
                  Бүгдийг харах
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={<JobListCards status="all" isLoading={true} />}
              >
                <JobListCards status="all" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Даалгаврууд</CardTitle>
              <CardDescription>
                Энд таны бүх даалгаврууд харагдана
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <p>Даалгаврын жагсаалт энд харагдана.</p>
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Тайлангууд</CardTitle>
              <CardDescription>
                Энд таны бүх тайлангууд харагдана
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <p>Тайлангийн жагсаалт энд харагдана.</p>
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
      </div>
    </DashboardProvider>
  );
}
