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
import { TaskStatus } from '@/lib/types/task.types';

export const metadata: Metadata = {
  title: 'Dashboard - Task Management System',
  description: 'Police Department Task Management System Dashboard',
};

export default async function DashboardPage() {
  const res = await getTaskCounts();
  const taskCounts = res.code === 200 ? res.data : undefined;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Хянах самбар</h2>
        <p className="text-muted-foreground">
          Цагдаагийн газрын даалгаврын удирдлагын систем
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Нийт даалгавар
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts?.total || 0}</div>
            {/* <p className="text-xs text-muted-foreground">+12.5% өмнөх сараас</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Хийгдэж буй</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {taskCounts?.[TaskStatus.IN_PROGRESS] || 0}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              33.8% нийт даалгавраас
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Дууссан</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {taskCounts?.[TaskStatus.COMPLETED] || 0}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              61.3% нийт даалгавраас
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Хугацаа хэтэрсэн
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts?.overdue || 0}</div>
            {/* <p className="text-xs text-muted-foreground">
              4.9% нийт даалгавраас
            </p> */}
          </CardContent>
        </Card>
      </div>

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
  );
}
