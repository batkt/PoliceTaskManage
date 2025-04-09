import type { Metadata } from "next";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TasksResponsiveView } from "@/components/tasks-responsive-view";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Tasks - Task Management System",
  description: "Police Department Task Management System Tasks",
};

export default function TasksPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ажлын жагсаалт</h2>
        <Button>
          <Plus className=" h-4 w-4" />
        </Button>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Бүгд</TabsTrigger>
          <TabsTrigger value="active">Идэвхтэй</TabsTrigger>
          <TabsTrigger value="completed">Дууссан</TabsTrigger>
          <TabsTrigger value="overdue">Хугацаа хэтэрсэн</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            {/* <CardHeader>
              <CardTitle>Бүх даалгаврууд</CardTitle>
              <CardDescription>
                Таны бүх даалгаврууд энд харагдаж байна
              </CardDescription>
            </CardHeader> */}
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <TasksResponsiveView status="all" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <Card>
            {/* <CardHeader>
              <CardTitle>Идэвхтэй даалгаврууд</CardTitle>
              <CardDescription>Одоо хийгдэж буй даалгаврууд</CardDescription>
            </CardHeader> */}
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <TasksResponsiveView status="active" />
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
                <TasksResponsiveView status="completed" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="overdue" className="space-y-4">
          <Card>
            {/* <CardHeader>
              <CardTitle>Хугацаа хэтэрсэн даалгаврууд</CardTitle>
              <CardDescription>
                Хугацаа хэтэрсэн даалгаврууд энд харагдана
              </CardDescription>
            </CardHeader> */}
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <TasksResponsiveView status="overdue" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
