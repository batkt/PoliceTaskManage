import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MyTasksResponsiveView } from "@/components/my-tasks-responsive-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "My Tasks - Task Management System",
  description: "Police Department Task Management System My Tasks",
};

export default function MyTasksPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status || "all";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Минии даалгавар</h2>
        <p className="text-muted-foreground">Танд оноогдсон даалгаврууд</p>
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
            {/* <CardHeader>
              <CardTitle>Бүх даалгавар</CardTitle>
              <CardDescription>Танд оноогдсон бүх даалгаврын жагсаалт</CardDescription>
            </CardHeader> */}
            <CardContent className="mt-4">
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <MyTasksResponsiveView status="all" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planned" className="space-y-4">
          <Card>
            {/* <CardHeader>
              <CardTitle>Эхлээгүй даалгаврууд</CardTitle>
              <CardDescription>
                Төлөвлөгдсөн боловч эхлээгүй байгаа даалгаврууд
              </CardDescription>
            </CardHeader> */}
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <MyTasksResponsiveView status="planned" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          <Card>
            {/* <CardHeader>
              <CardTitle>Хуваарилагдсан даалгаврууд</CardTitle>
              <CardDescription>Танд хуваарилагдсан даалгаврууд</CardDescription>
            </CardHeader> */}
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <MyTasksResponsiveView status="assigned" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checking" className="space-y-4">
          <Card>
            {/* <CardHeader>
              <CardTitle>Шалгах даалгаврууд</CardTitle>
              <CardDescription>Шалгагдаж буй даалгаврууд</CardDescription>
            </CardHeader> */}
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <MyTasksResponsiveView status="checking" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            {/* <CardHeader>
              <CardTitle>Дууссан даалгаврууд</CardTitle>
              <CardDescription>Амжилттай дууссан даалгаврууд</CardDescription>
            </CardHeader> */}
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <MyTasksResponsiveView status="completed" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
