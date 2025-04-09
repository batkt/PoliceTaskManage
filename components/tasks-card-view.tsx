"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  AlertCircle,
  MoreHorizontal,
  Clock,
  Edit,
  Trash2,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { format, differenceInDays } from "date-fns";
import { TaskEditDialog } from "./task-edit-dialog";
import { ConfirmDialog } from "./confirm-dialog";
import { useToast } from "@/hooks/use-toast";

// Sample data for tasks
const initialTasksData = [
  {
    id: "TASK-8782",
    title: "Гэмт хэргийн тайлан бэлтгэх",
    status: "completed",
    priority: "high",
    assignee: "Отгонбаяр Б.",
    startDate: "2023-12-01",
    dueDate: "2023-12-15",
    description: "Сарын гэмт хэргийн тайланг бэлтгэж, удирдлагад танилцуулах",
    department: "Хэрэг бүртгэлийн хэлтэс",
  },
  {
    id: "TASK-7878",
    title: "Сургалтын хөтөлбөр боловсруулах",
    status: "in_progress",
    priority: "medium",
    assignee: "Дэлгэрмаа Д.",
    startDate: "2023-12-05",
    dueDate: "2023-12-20",
    description: "Шинэ ажилтнуудад зориулсан сургалтын хөтөлбөр боловсруулах",
    department: "Хяналтын хэлтэс",
  },
  {
    id: "TASK-7512",
    title: "Хэлтсийн ажлын тайлан",
    status: "in_progress",
    priority: "high",
    assignee: "Ганбаатар Б.",
    startDate: "2023-12-10",
    dueDate: "2023-12-25",
    description: "Хэлтсийн сарын ажлын тайланг бэлтгэх",
    department: "Эрүүгийн цагдаагийн хэлтэс",
  },
  {
    id: "TASK-2345",
    title: "Төсвийн төлөвлөгөө",
    status: "overdue",
    priority: "high",
    assignee: "Энхбаяр Б.",
    startDate: "2023-12-01",
    dueDate: "2023-12-10",
    description: "Дараа жилийн төсвийн төлөвлөгөө боловсруулах",
    department: "Захиргааны хэлтэс",
  },
  {
    id: "TASK-5288",
    title: "Ажилтнуудын үнэлгээ",
    status: "completed",
    priority: "medium",
    assignee: "Түвшинбаяр С.",
    startDate: "2023-12-15",
    dueDate: "2023-12-30",
    description: "Ажилтнуудын гүйцэтгэлийн үнэлгээг хийх",
    department: "Хяналтын хэлтэс",
  },
  {
    id: "TASK-3304",
    title: "Хэрэг бүртгэлийн тайлан",
    status: "pending",
    priority: "low",
    assignee: "Баярсайхан Т.",
    startDate: "2023-12-20",
    dueDate: "2024-01-05",
    description: "Хэрэг бүртгэлийн тайланг бэлтгэх",
    department: "Хэрэг бүртгэлийн хэлтэс",
  },
];

export function TasksCardView({ status = "all" }: { status?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tasksData, setTasksData] = useState(initialTasksData);
  const { toast } = useToast();

  useEffect(() => {
    const handleGlobalSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const term = customEvent.detail;
      if (term) {
        setSearchTerm(term);
      }
    };

    window.addEventListener("globalSearch", handleGlobalSearch);
    return () => {
      window.removeEventListener("globalSearch", handleGlobalSearch);
    };
  }, []);

  // Filter tasks based on status and search term
  const filteredTasks = tasksData.filter((task) => {
    // Filter by status
    if (status !== "all") {
      if (
        status === "active" &&
        !["pending", "in_progress"].includes(task.status)
      )
        return false;
      if (status === "completed" && task.status !== "completed") return false;
      if (status === "overdue" && task.status !== "overdue") return false;
    }

    // Filter by search term
    if (
      searchTerm &&
      !task.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Status mapping for display
  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      {
        label: string;
        variant:
          | "default"
          | "destructive"
          | "outline"
          | "secondary"
          | "success";
        icon: React.ReactNode;
      }
    > = {
      pending: {
        label: "Хүлээгдэж буй",
        variant: "outline",
        icon: <PauseCircle className="h-4 w-4 mr-1" />,
      },
      in_progress: {
        label: "Хийгдэж буй",
        variant: "secondary",
        icon: <PlayCircle className="h-4 w-4 mr-1" />,
      },
      completed: {
        label: "Дууссан",
        variant: "success",
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
      },
      overdue: {
        label: "Хоцорсон",
        variant: "destructive",
        icon: <AlertTriangle className="h-4 w-4 mr-1" />,
      },
    };

    return (
      statusMap[status] || { label: status, variant: "default", icon: null }
    );
  };

  // Priority mapping for display
  const getPriorityInfo = (priority: string) => {
    const priorityMap: Record<string, { label: string; className: string }> = {
      low: { label: "Бага", className: "text-blue-500 dark:text-blue-400" },
      medium: {
        label: "Дунд",
        className: "text-yellow-500 dark:text-yellow-400",
      },
      high: { label: "Өндөр", className: "text-red-500 dark:text-red-400" },
    };

    return priorityMap[priority] || { label: priority, className: "" };
  };

  // Calculate remaining days
  const getRemainingDays = (dueDate: string, status: string) => {
    if (status === "completed") {
      return {
        days: 0,
        text: "Дууссан",
        className: "text-green-500 dark:text-green-400",
      };
    }

    const today = new Date();
    const due = new Date(dueDate);
    const days = differenceInDays(due, today);

    if (days < 0) {
      return {
        days: Math.abs(days),
        text: `${Math.abs(days)} хоног хоцорсон`,
        className: "text-red-500 dark:text-red-400",
      };
    } else if (days === 0) {
      return {
        days: 0,
        text: "Өнөөдөр дуусна",
        className: "text-yellow-500 dark:text-yellow-400",
      };
    } else {
      return {
        days,
        text: `${days} хоног үлдсэн`,
        className: "text-blue-500 dark:text-blue-400",
      };
    }
  };

  // Handle task update
  const handleTaskUpdate = (updatedTask: any) => {
    setTasksData(
      tasksData.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

    toast({
      title: "Даалгавар шинэчлэгдлээ",
      description: "Даалгаврын мэдээлэл амжилттай шинэчлэгдлээ.",
    });
  };

  // Handle task delete
  const handleTaskDelete = (taskId: string) => {
    setTasksData(tasksData.filter((task) => task.id !== taskId));

    toast({
      title: "Даалгавар устгагдлаа",
      description: "Даалгавар амжилттай устгагдлаа.",
      variant: "destructive",
    });
  };

  // Handle status change
  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasksData(
      tasksData.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    const statusLabels: Record<string, string> = {
      pending: "Хүлээгдэж буй",
      in_progress: "Хийгдэж буй",
      completed: "Дууссан",
      overdue: "Хоцорсон",
    };

    toast({
      title: "Төлөв өөрчлөгдлөө",
      description: `Даалгаврын төлөв "${statusLabels[newStatus]}" болж өөрчлөгдлөө.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="h-4"></div>

      {filteredTasks.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">Даалгавар олдсонг��й</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => {
            const {
              label: statusLabel,
              variant: statusVariant,
              icon: statusIcon,
            } = getStatusInfo(task.status);
            const { label: priorityLabel, className: priorityClass } =
              getPriorityInfo(task.priority);
            const { text: remainingText, className: remainingClass } =
              getRemainingDays(task.dueDate, task.status);

            return (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b p-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium truncate">{task.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{task.id}</span>
                        <span>•</span>
                        <span className="truncate">{task.department}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Цэс нээх</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Үйлдлүүд</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(task.id)}
                        >
                          ID хуулах
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Төлөв өөрчлөх
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(task.id, "pending")
                                }
                              >
                                <PauseCircle className="mr-2 h-4 w-4" />
                                <span>Хүлээгдэж буй</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(task.id, "in_progress")
                                }
                              >
                                <PlayCircle className="mr-2 h-4 w-4" />
                                <span>Хийгдэж буй</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(task.id, "completed")
                                }
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                <span>Дууссан</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(task.id, "overdue")
                                }
                              >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                <span>Хоцорсон</span>
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <TaskEditDialog
                          task={task}
                          onTaskUpdated={handleTaskUpdate}
                        >
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Засах
                          </DropdownMenuItem>
                        </TaskEditDialog>
                        <DropdownMenuSeparator />
                        <ConfirmDialog
                          title="Даалгавар устгах"
                          description={`"${task.title}" даалгаврыг устгахдаа итгэлтэй байна уу?`}
                          onConfirm={() => handleTaskDelete(task.id)}
                        >
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Устгах
                          </DropdownMenuItem>
                        </ConfirmDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="flex flex-col gap-3">
                      {/* Status and Priority */}
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={statusVariant}
                          className="flex items-center"
                        >
                          {statusIcon}
                          {statusLabel}
                        </Badge>
                        <div className={`flex items-center ${priorityClass}`}>
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">
                            {priorityLabel}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>

                      {/* Dates and Remaining Time */}
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            Эхлэх:{" "}
                            {format(new Date(task.startDate), "yyyy/MM/dd")}
                          </span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            Дуусах:{" "}
                            {format(new Date(task.dueDate), "yyyy/MM/dd")}
                          </span>
                        </div>
                      </div>

                      {/* Remaining Days and Assignee */}
                      <div className="flex items-center justify-between mt-2">
                        <div
                          className={`flex items-center text-sm ${remainingClass}`}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{remainingText}</span>
                        </div>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="text-xs">
                              {task.assignee
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.assignee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
