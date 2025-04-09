"use client";

import type React from "react";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";
import { differenceInDays, format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
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
import { TaskEditDialog } from "./task-edit-dialog";
import { ConfirmDialog } from "./confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  AlertTriangle,
} from "lucide-react";

// This type is used to define the shape of our data.
export type Task = {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  assignee: string;
  startDate: string;
  dueDate: string;
  description?: string;
  department?: string;
};

const initialData: Task[] = [
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
  {
    id: "TASK-4562",
    title: "Хяналтын тайлан",
    status: "pending",
    priority: "medium",
    assignee: "Мөнхбат Д.",
    startDate: "2023-12-15",
    dueDate: "2024-01-10",
    description: "Хяналтын тайланг бэлтгэх",
    department: "Хяналтын хэлтэс",
  },
  {
    id: "TASK-9012",
    title: "Сар бүрийн тайлан",
    status: "overdue",
    priority: "high",
    assignee: "Баатарсүрэн Б.",
    startDate: "2023-11-25",
    dueDate: "2023-12-05",
    description: "Сар бүрийн тайланг бэлтгэх",
    department: "Захиргааны хэлтэс",
  },
  {
    id: "TASK-1209",
    title: "Хурлын тэмдэглэл",
    status: "completed",
    priority: "low",
    assignee: "Оюунчимэг Ч.",
    startDate: "2023-12-10",
    dueDate: "2023-12-12",
    description: "Хурлын тэмдэглэл бэлтгэх",
    department: "Захиргааны хэлтэс",
  },
  {
    id: "TASK-7623",
    title: "Шинэ журам боловсруулах",
    status: "in_progress",
    priority: "high",
    assignee: "Батбаяр Н.",
    startDate: "2023-12-20",
    dueDate: "2024-01-15",
    description: "Шинэ журам боловсруулах",
    department: "Хяналтын хэлтэс",
  },
];

export function TasksTableView({ status = "all" }: { status?: string }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [data, setData] = useState<Task[]>(initialData);
  const { toast } = useToast();

  // Filter data based on status prop
  const filteredData =
    status === "all"
      ? data
      : data.filter((task) => {
          if (status === "active")
            return task.status === "pending" || task.status === "in_progress";
          if (status === "completed") return task.status === "completed";
          if (status === "overdue") return task.status === "overdue";
          return true;
        });

  // Handle task update
  const handleTaskUpdate = (updatedTask: any) => {
    setData(
      data.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

    toast({
      title: "Даалгавар шинэчлэгдлээ",
      description: "Даалгаврын мэдээлэл амжилттай шинэчлэгдлээ.",
    });
  };

  // Handle task delete
  const handleTaskDelete = (taskId: string) => {
    setData(data.filter((task) => task.id !== taskId));

    toast({
      title: "Даалгавар устгагдлаа",
      description: "Даалгавар амжилттай устгагдлаа.",
      variant: "destructive",
    });
  };

  // Handle status change
  const handleStatusChange = (taskId: string, newStatus: string) => {
    setData(
      data.map((task) =>
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

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Даалгаврын нэр
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "status",
      header: "Төлөв",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

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

        const { label, variant, icon } = statusMap[status] || {
          label: status,
          variant: "default",
          icon: null,
        };

        return (
          <Badge variant={variant} className="flex items-center">
            {icon} {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Чухал зэрэг",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;

        const priorityMap: Record<
          string,
          { label: string; className: string }
        > = {
          low: { label: "Бага", className: "text-blue-500 dark:text-blue-400" },
          medium: {
            label: "Дунд",
            className: "text-yellow-500 dark:text-yellow-400",
          },
          high: { label: "Өндөр", className: "text-red-500 dark:text-red-400" },
        };

        const { label, className } = priorityMap[priority] || {
          label: priority,
          className: "",
        };

        return <div className={className}>{label}</div>;
      },
    },
    {
      accessorKey: "assignee",
      header: "Хариуцагч",
      cell: ({ row }) => <div>{row.getValue("assignee")}</div>,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Эхлэх огноо
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{format(new Date(row.getValue("startDate")), "yyyy/MM/dd")}</div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Дуусах огноо
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{format(new Date(row.getValue("dueDate")), "yyyy/MM/dd")}</div>
      ),
    },
    {
      id: "remainingDays",
      header: "Үлдсэн хугацаа",
      cell: ({ row }) => {
        const task = row.original;
        const { text, className } = getRemainingDays(task.dueDate, task.status);

        return (
          <div className={`flex items-center ${className}`}>
            <Clock className="mr-2 h-4 w-4" />
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Цэс нээх</span>
                <MoreHorizontal className="h-4 w-4" />
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
                <DropdownMenuSubTrigger>Төлөв өөрчлөх</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(task.id, "pending")}
                    >
                      <PauseCircle className="mr-2 h-4 w-4" />
                      <span>Хүлээгдэж буй</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(task.id, "in_progress")}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      <span>Хийгдэж буй</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(task.id, "completed")}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      <span>Дууссан</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(task.id, "overdue")}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      <span>Хоцорсон</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <TaskEditDialog task={task} onTaskUpdated={handleTaskUpdate}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Даалгавраар хайх..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Багана
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Даалгавар олдсонгүй
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Нийт {table.getFilteredRowModel().rows.length} даалгавар
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Өмнөх
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Дараах
          </Button>
        </div>
      </div>
    </div>
  );
}
