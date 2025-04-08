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
export type Job = {
  id: string
  title: string
  department: string
  type: "investigation" | "patrol" | "administrative" | "training" | "special"
  priority: "low" | "medium" | "high" | "urgent"
  status: "planned" | "assigned" | "checking" | "completed" | "cancelled" | "in_progress"
  assignedTo: string
  startDate: string
  endDate: string
}

const data: Job[] = [
  {
    id: "JOB-001",
    title: "Гэмт хэргийн газар дээр очих",
    department: "Эрүүгийн цагдаагийн хэлтэс",
    type: "investigation",
    priority: "high",
    status: "completed",
    assignedTo: "Отгонбаяр Б.",
    startDate: "2023-12-01",
    endDate: "2023-12-01",
  },
  {
    id: "JOB-002",
    title: "Гэрч нараас мэдүүлэг авах",
    department: "Хэрэг бүртгэлийн хэлтэс",
    type: "investigation",
    priority: "medium",
    status: "in_progress",
    assignedTo: "Дэлгэрмаа Д.",
    startDate: "2023-12-05",
    endDate: "2023-12-10",
  },
  {
    id: "JOB-003",
    title: "Шөнийн эргүүл",
    department: "Эрүүгийн цагдаагийн хэлтэс",
    type: "patrol",
    priority: "medium",
    status: "planned",
    assignedTo: "Ганбаатар Б.",
    startDate: "2023-12-15",
    endDate: "2023-12-16",
  },
  {
    id: "JOB-004",
    title: "Сарын тайлан бэлтгэх",
    department: "Хяналтын хэлтэс",
    type: "administrative",
    priority: "low",
    status: "in_progress",
    assignedTo: "Энхбаяр Б.",
    startDate: "2023-12-20",
    endDate: "2023-12-25",
  },
  {
    id: "JOB-005",
    title: "Шинэ ажилтнуудад сургалт явуулах",
    department: "Хяналтын хэлтэс",
    type: "training",
    priority: "medium",
    status: "planned",
    assignedTo: "Түвшинбаяр С.",
    startDate: "2023-12-18",
    endDate: "2023-12-20",
  },
  {
    id: "JOB-006",
    title: "Онцгой байдлын сургуулилт",
    department: "Эрүүгийн цагдаагийн хэлтэс",
    type: "special",
    priority: "high",
    status: "planned",
    assignedTo: "Баярсайхан Т.",
    startDate: "2023-12-22",
    endDate: "2023-12-22",
  },
  {
    id: "JOB-007",
    title: "Хэргийн газрын үзлэг хийх",
    department: "Хэрэг бүртгэлийн хэлтэс",
    type: "investigation",
    priority: "urgent",
    status: "completed",
    assignedTo: "Мөнхбат Д.",
    startDate: "2023-12-02",
    endDate: "2023-12-02",
  },
  {
    id: "JOB-008",
    title: "Олон нийтийн арга хэмжээний хамгаалалт",
    department: "Эрүүгийн цагдаагийн хэлтэс",
    type: "special",
    priority: "high",
    status: "cancelled",
    assignedTo: "Баатарсүрэн Б.",
    startDate: "2023-12-10",
    endDate: "2023-12-10",
  },
  {
    id: "JOB-009",
    title: "Хэргийн материал бүрдүүлэх",
    department: "Хэрэг бүртгэлийн хэлтэс",
    type: "administrative",
    priority: "medium",
    status: "in_progress",
    assignedTo: "Оюунчимэг Ч.",
    startDate: "2023-12-08",
    endDate: "2023-12-15",
  },
  {
    id: "JOB-010",
    title: "Шинэ журмын сургалт",
    department: "Хяналтын хэлтэс",
    type: "training",
    priority: "low",
    status: "planned",
    assignedTo: "Батбаяр Н.",
    startDate: "2023-12-28",
    endDate: "2023-12-30",
  },
  {
    id: "JOB-011",
    title: "Гэрч нараас нэмэлт мэдүүлэг авах",
    department: "Хэрэг бүртгэлийн хэлтэс",
    type: "investigation",
    priority: "medium",
    status: "assigned",
    assignedTo: "Дэлгэрмаа Д.",
    startDate: "2023-12-12",
    endDate: "2023-12-14",
  },
  {
    id: "JOB-012",
    title: "Шинэ ажилтнуудын сургалтын үр дүнг шалгах",
    department: "Хяналтын хэлтэс",
    type: "training",
    priority: "low",
    status: "checking",
    assignedTo: "Түвшинбаяр С.",
    startDate: "2023-12-19",
    endDate: "2023-12-21",
  },
]

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ажлын нэр
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "department",
    header: "Хэлтэс",
    cell: ({ row }) => <div>{row.getValue("department")}</div>,
  },
  {
    accessorKey: "type",
    header: "Төрөл",
    cell: ({ row }) => {
      const type = row.getValue("type") as string

      const typeMap: Record<string, { label: string }> = {
        investigation: { label: "Мөрдөн байцаалт" },
        patrol: { label: "Эргүүл" },
        administrative: { label: "Захиргааны" },
        training: { label: "Сургалт" },
        special: { label: "Тусгай" },
      }

      const { label } = typeMap[type] || { label: type }

      return <div>{label}</div>
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
        high: { label: "Өндөр", className: "text-orange-500" },
        urgent: { label: "Яаралтай", className: "text-red-500 font-bold" },
      }

      const { label, className } = priorityMap[priority] || { label: priority, className: "" }

      return <div className={className}>{label}</div>
    },
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
        planned: { label: "Эхлээгүй", variant: "outline" },
        assigned: { label: "Хуваарилагдсан", variant: "default" },
        in_progress: { label: "Хийгдэж буй", variant: "default" },
        checking: { label: "Шалгаж буй", variant: "secondary" },
        completed: { label: "Дууссан", variant: "success" },
        cancelled: { label: "Цуцалсан", variant: "destructive" },
      }

      const { label, variant } = statusMap[status] || { label: status, variant: "default" }

      return <Badge variant={variant}>{label}</Badge>
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Хариуцагч",
    cell: ({ row }) => <div>{row.getValue("assignedTo")}</div>,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Эхлэх огноо
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("startDate")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const job = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(job.id)}>ID хуулах</DropdownMenuItem>
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

export function JobList({ status }: { status: string }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Map the status from URL to the actual status values in the data
  const statusMapping: Record<string, string[]> = {
    all: [],
    planned: ["planned"],
    assigned: ["assigned"],
    checking: ["checking"],
    completed: ["completed"],
  }

  // Filter data based on status prop
  const filteredData =
    status === "all" || !statusMapping[status] ? data : data.filter((job) => statusMapping[status].includes(job.status))

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
          placeholder="Ажлын нэрээр хайх..."
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
                  Ажил олдсонгүй
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">Нийт {table.getFilteredRowModel().rows.length} ажил</div>
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

