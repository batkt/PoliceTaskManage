import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/task-list";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Tasks - Task Management System",
  description: "Police Department Task Management System Tasks",
};

export default function TasksPage() {
  return (
    <div className="flex-1 space-y-4 pt-6 ">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Даалгаврууд</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Шинэ даалгавар
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
            <CardHeader>
              <CardTitle>Бүх даалгаврууд</CardTitle>
              <CardDescription>
                Таны бүх даалгаврууд энд харагдаж байна
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList status="all" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Идэвхтэй даалгаврууд</CardTitle>
              <CardDescription>Одоо хийгдэж буй даалгаврууд</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList status="active" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Дууссан даалгаврууд</CardTitle>
              <CardDescription>Амжилттай дууссан даалгаврууд</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList status="completed" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Хугацаа хэтэрсэн даалгаврууд</CardTitle>
              <CardDescription>
                Хугацаа хэтэрсэн даалгаврууд энд харагдана
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList status="overdue" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
