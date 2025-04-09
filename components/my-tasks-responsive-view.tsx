"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { JobListCards } from "@/components/job-list-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Search, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { JobRegistrationDialog } from "@/components/job-registration-dialog";

// Mock data for tasks
const mockTasks = [
  {
    id: "TASK-8782",
    title: "Гэмт хэргийн газрын үзлэг хийх",
    status: "planned",
    startDate: "2023-04-15T00:00:00.000Z",
    endDate: "2023-04-20T00:00:00.000Z",
    assignees: [
      { id: "1", name: "Батаа", color: "blue" },
      { id: "2", name: "Дорж", color: "green" },
    ],
    type: "Хэрэг шалгах",
    system: "Хэрэг бүртгэл",
    description: "Гэмт хэргийн газрын үзлэг хийх, нотлох баримт цуглуулах",
    isUrgent: true,
  },
  {
    id: "TASK-7891",
    title: "Гэрч, хохирогчоос мэдүүлэг авах",
    status: "assigned",
    startDate: "2023-04-18T00:00:00.000Z",
    endDate: "2023-04-25T00:00:00.000Z",
    assignees: [
      { id: "1", name: "Батаа", color: "blue" },
      { id: "3", name: "Болд", color: "red" },
    ],
    type: "Мэдүүлэг авах",
    system: "Хэрэг бүртгэл",
    description: "Гэрч, хохирогчоос мэдүүлэг авах, баримтжуулах",
  },
  {
    id: "TASK-6543",
    title: "Шүүх эмнэлгийн шинжилгээ хийлгэх",
    status: "checking",
    startDate: "2023-04-20T00:00:00.000Z",
    endDate: "2023-05-10T00:00:00.000Z",
    assignees: [
      { id: "1", name: "Батаа", color: "blue" },
      { id: "4", name: "Сараа", color: "purple" },
    ],
    type: "Шинжилгээ",
    system: "Шүүх эмнэлэг",
    description: "Шүүх эмнэлгийн шинжилгээ хийлгэх, дүгнэлт гаргуулах",
  },
  {
    id: "TASK-5432",
    title: "Сэжигтнийг баривчлах",
    status: "completed",
    startDate: "2023-04-10T00:00:00.000Z",
    endDate: "2023-04-10T00:00:00.000Z",
    assignees: [
      { id: "1", name: "Батаа", color: "blue" },
      { id: "5", name: "Төмөр", color: "orange" },
      { id: "6", name: "Ганаа", color: "yellow" },
    ],
    type: "Баривчлах",
    system: "Хэрэг бүртгэл",
    description: "Сэжигтнийг баривчлах, эрх танилцуулах",
    isUrgent: true,
  },
  {
    id: "TASK-4321",
    title: "Нотлох баримт шинжлэх",
    status: "in_progress",
    startDate: "2023-04-22T00:00:00.000Z",
    endDate: "2023-05-05T00:00:00.000Z",
    assignees: [
      { id: "1", name: "Батаа", color: "blue" },
      { id: "7", name: "Дулмаа", color: "pink" },
    ],
    type: "Шинжилгээ",
    system: "Криминалистик",
    description: "Цуглуулсан нотлох баримтыг шинжлэх, дүгнэлт гаргах",
  },
];

type MyTasksResponsiveViewProps = {
  status?: string;
};

export function MyTasksResponsiveView({
  status = "all",
}: MyTasksResponsiveViewProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(mockTasks);

  // Filter tasks based on status and search query
  useEffect(() => {
    let filtered = [...mockTasks];

    // Filter by status if not "all"
    if (status !== "all") {
      filtered = filtered.filter((task) => task.status === status);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.id.toLowerCase().includes(query) ||
          task.type?.toLowerCase().includes(query) ||
          task.system?.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(filtered);
  }, [status, searchQuery]);

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
      }
    > = {
      planned: { label: "Эхлээгүй", variant: "outline" },
      assigned: { label: "Хуваарилагдсан", variant: "default" },
      in_progress: { label: "Хийгдэж буй", variant: "default" },
      checking: { label: "Шалгаж буй", variant: "secondary" },
      completed: { label: "Дууссан", variant: "success" },
      cancelled: { label: "Цуцалсан", variant: "destructive" },
    };

    return statusMap[status] || { label: status, variant: "default" };
  };

  // If mobile, show card view
  if (isMobile) {
    return <JobListCards status={status} />;
  }

  // Otherwise show list view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Даалгавар хайх..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}
        <div></div>
        <JobRegistrationDialog>
          <Button>Даалгавар нэмэх</Button>
        </JobRegistrationDialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Гарчиг</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead>Төрөл</TableHead>
              <TableHead>Систем</TableHead>
              <TableHead>Эхлэх огноо</TableHead>
              <TableHead>Дуусах огноо</TableHead>
              <TableHead className="text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Даалгавар олдсонгүй.
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => {
                const { label, variant } = getStatusInfo(task.status);

                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {task.assignees.map((a) => a.name).join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={variant}>{label}</Badge>
                    </TableCell>
                    <TableCell>{task.type || "-"}</TableCell>
                    <TableCell>{task.system || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(task.startDate), "yyyy/MM/dd")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(task.endDate), "yyyy/MM/dd")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Цэс нээх</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Үйлдлүүд</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              navigator.clipboard.writeText(task.id)
                            }
                          >
                            ID хуулах
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <JobRegistrationDialog editJob={task}>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              Засах
                            </DropdownMenuItem>
                          </JobRegistrationDialog>
                          <DropdownMenuItem className="text-destructive">
                            Устгах
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
