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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
export type Deputy = {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  status: "active" | "on_leave" | "training"
  taskCount: number
}

const data: Deputy[] = [
  {
    id: "DEP-001",
    name: "Отгонбаяр Б.",
    position: "Ахлах мөрдөгч",
    department: "Хэрэг бүртгэлийн хэлтэс",
    email: "otgonbayar.b@police.gov.mn",
    phone: "99887766",
    status: "active",
    taskCount: 12,
  },
  {
    id: "DEP-002",
    name: "Дэлгэрмаа Д.",
    position: "Мөрдөгч",
    department: "Хэрэг бүртгэлийн хэлтэс",
    email: "delgermaa.d@police.gov.mn",
    phone: "99112233",
    status: "active",
    taskCount: 8,
  },
  {
    id: "DEP-003",
    name: "Ганбаатар Б.",
    position: "Ахлах мөрдөгч",
    department: "Эрүүгийн цагдаагийн хэлтэс",
    email: "ganbaatar.b@police.gov.mn",
    phone: "99445566",
    status: "on_leave",
    taskCount: 5,
  },
  {
    id: "DEP-004",
    name: "Энхбаяр Б.",
    position: "Мөрдөгч",
    department: "Эрүүгийн цагдаагийн хэлтэс",
    email: "enkhbayar.b@police.gov.mn",
    phone: "99778899",
    status: "active",
    taskCount: 10,
  },
  {
    id: "DEP-005",
    name: "Түвшинбаяр С.",
    position: "Ахлах мөрдөгч",
    department: "Хяналтын хэлтэс",
    email: "tuvshinbayar.s@police.gov.mn",
    phone: "99001122",
    status: "training",
    taskCount: 3,
  },
  {
    id: "DEP-006",
    name: "Баярсайхан Т.",
    position: "Мөрдөгч",
    department: "Хяналтын хэлтэс",
    email: "bayarsaikhan.t@police.gov.mn",
    phone: "99334455",
    status: "active",
    taskCount: 7,
  },
  {
    id: "DEP-007",
    name: "Мөнхбат Д.",
    position: "Ахлах мөрдөгч",
    department: "Хэрэг бүртгэлийн хэлтэс",
    email: "munkhbat.d@police.gov.mn",
    phone: "99667788",
    status: "active",
    taskCount: 9,
  },
  {
    id: "DEP-008",
    name: "Баатарсүрэн Б.",
    position: "Мөрдөгч",
    department: "Эрүүгийн цагдаагийн хэлтэс",
    email: "baatarsuren.b@police.gov.mn",
    phone: "99990011",
    status: "on_leave",
    taskCount: 4,
  },
  {
    id: "DEP-009",
    name: "Оюунчимэг Ч.",
    position: "Ахлах мөрдөгч",
    department: "Хяналтын хэлтэс",
    email: "oyunchimeg.ch@police.gov.mn",
    phone: "99223344",
    status: "active",
    taskCount: 11,
  },
  {
    id: "DEP-010",
    name: "Батбаяр Н.",
    position: "Мөрдөгч",
    department: "Хэрэг бүртгэлийн хэлтэс",
    email: "batbayar.n@police.gov.mn",
    phone: "99556677",
    status: "training",
    taskCount: 6,
  },
]

export const columns: ColumnDef<Deputy>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Нэр
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={row.getValue("name")} />
            <AvatarFallback>{row.getValue("name").toString().substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "position",
    header: "Албан тушаал",
    cell: ({ row }) => <div>{row.getValue("position")}</div>,
  },
  {
    accessorKey: "department",
    header: "Хэлтэс",
    cell: ({ row }) => <div>{row.getValue("department")}</div>,
  },
  {
    accessorKey: "email",
    header: "Имэйл",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
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
        active: { label: "Идэвхтэй", variant: "success" },
        on_leave: { label: "Чөлөөтэй", variant: "outline" },
        training: { label: "Сургалтанд", variant: "secondary" },
      }

      const { label, variant } = statusMap[status] || { label: status, variant: "default" }

      return <Badge variant={variant}>{label}</Badge>
    },
  },
  {
    accessorKey: "taskCount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Даалгавар
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("taskCount")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const deputy = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(deputy.id)}>ID хуулах</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Дэлгэрэнгүй харах</DropdownMenuItem>
            <DropdownMenuItem>Даалгавар оноох</DropdownMenuItem>
            <DropdownMenuItem>Тайлан харах</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Засах</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DeputyList() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
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
          placeholder="Нэрээр хайх..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
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
                  Дэд удирдлага олдсонгүй
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Нийт {table.getFilteredRowModel().rows.length} дэд удирдлага
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

