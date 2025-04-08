"use client"

import { useState } from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
export type Task = {
  id: string
  title: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  priority: "low" | "medium" | "high"
  assignee: string
  dueDate: string
}

const data: Task[] = [
  {
    id: "TASK-8782",
    title: "Гэмт хэргийн тайлан бэлтгэх",
    status: "completed",
    priority: "high",
    assignee: "Отгонбаяр Б.",
    dueDate: "2023-12-15",
  },
  {
    id: "TASK-7878",
    title: "Сургалтын хөтөлбөр боловсруулах",
    status: "in_progress",
    priority: "medium",
    assignee: "Дэлгэрмаа Д.",
    dueDate: "2023-12-20",
  },
  {
    id: "TASK-7512",
    title: "Хэлтсийн ажлын тайлан",
    status: "in_progress",
    priority: "high",
    assignee: "Ганбаатар Б.",
    dueDate: "2023-12-25",
  },
  {
    id: "TASK-2345",
    title: "Төсвийн төлөвлөгөө",
    status: "overdue",
    priority: "high",
    assignee: "Энхбаяр Б.",
    dueDate: "2023-12-10",
  },
  {
    id: "TASK-5288",
    title: "Ажилтнуудын үнэлгээ",
    status: "completed",
    priority: "medium",
    assignee: "Түвшинбаяр С.",
    dueDate: "2023-12-30",
  },
  {
    id: "TASK-3304",
    title: "Хэрэг бүртгэлийн тайлан",
    status: "pending",
    priority: "low",
    assignee: "Баярсайхан Т.",
    dueDate: "2024-01-05",
  },
  {
    id: "TASK-4562",
    title: "Хяналтын тайлан",
    status: "pending",
    priority: "medium",
    assignee: "Мөнхбат Д.",
    dueDate: "2024-01-10",
  },
  {
    id: "TASK-9012",
    title: "Сар бүрийн тайлан",
    status: "overdue",
    priority: "high",
    assignee: "Баатарсүрэн Б.",
    dueDate: "2023-12-05",
  },
  {
    id: "TASK-1209",
    title: "Хурлын тэмдэглэл",
    status: "completed",
    priority: "low",
    assignee: "Оюунчимэг Ч.",
    dueDate: "2023-12-12",
  },
  {
    id: "TASK-7623",
    title: "Шинэ журам боловсруулах",
    status: "in_progress",
    priority: "high",
    assignee: "Батбаяр Н.",
    dueDate: "2024-01-15",
  },
]

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Даалгаврын нэр
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: "Төлөв",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      const statusMap: Record<
        string,
        { label: string; variant: "default" | "destructive" | "outline" | "secondary" | "success" }
      > = {
        pending: { label: "Хүлээгдэж буй", variant: "outline" },
        in_progress: { label: "Хийгдэж буй", variant: "secondary" },
        completed: { label: "Дууссан", variant: "success" },
        overdue: { label: "Хоцорсон", variant: "destructive" },
      }

      const { label, variant } = statusMap[status] || { label: status, variant: "default" }

      return <Badge variant={variant}>{label}</Badge>
    },
  },
  {
    accessorKey: "priority",
    header: "Чухал зэрэг",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string

      const priorityMap: Record<string, { label: string; className: string }> = {
        low: { label: "Бага", className: "text-blue-500" },
        medium: { label: "Дунд", className: "text-yellow-500" },
        high: { label: "Өндөр", className: "text-red-500" },
      }

      const { label, className } = priorityMap[priority] || { label: priority, className: "" }

      return <div className={className}>{label}</div>
    },
  },
  {
    accessorKey: "assignee",
    header: "Хариуцагч",
    cell: ({ row }) => <div>{row.getValue("assignee")}</div>,
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Дуусах хугацаа
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("dueDate")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(task.id)}>ID хуулах</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Дэлгэрэнгүй харах</DropdownMenuItem>
            <DropdownMenuItem>Засах</DropdownMenuItem>
            <DropdownMenuItem>Төлөв өөрчлөх</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Устгах</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function TaskList({ status }: { status: string }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Filter data based on status prop
  const filteredData =
    status === "all"
      ? data
      : data.filter((task) => {
          if (status === "active") return task.status === "pending" || task.status === "in_progress"
          if (status === "completed") return task.status === "completed"
          if (status === "overdue") return task.status === "overdue"
          return true
        })

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
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Даалгавраар хайх..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
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
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
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
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Дараах
          </Button>
        </div>
      </div>
    </div>
  )
}

