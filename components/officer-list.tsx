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
export type Officer = {
  id: string
  name: string
  rank: string
  department: string
  position: string
  phone: string
  email: string
  status: "active" | "on_leave" | "training" | "retired"
  joinDate: string
}

const data: Officer[] = [
  {
    id: "OFF-001",
    name: "Отгонбаяр Б.",
    rank: "Ахлах ахлагч",
    department: "Хэрэг бүртгэлийн хэлтэс",
    position: "Ахлах мөрдөгч",
    phone: "99887766",
    email: "otgonbayar.b@police.gov.mn",
    status: "active",
    joinDate: "2015-05-12",
  },
  {
    id: "OFF-002",
    name: "Дэлгэрмаа Д.",
    rank: "Дэд хурандаа",
    department: "Хэрэг бүртгэлийн хэлтэс",
    position: "Мөрдөгч",
    phone: "99112233",
    email: "delgermaa.d@police.gov.mn",
    status: "active",
    joinDate: "2010-03-15",
  },
  {
    id: "OFF-003",
    name: "Ганбаатар Б.",
    rank: "Хошууч",
    department: "Эрүүгийн цагдаагийн хэлтэс",
    position: "Ахлах мөрдөгч",
    phone: "99445566",
    email: "ganbaatar.b@police.gov.mn",
    status: "on_leave",
    joinDate: "2012-08-20",
  },
  {
    id: "OFF-004",
    name: "Энхбаяр Б.",
    rank: "Ахмад",
    department: "Эрүүгийн цагдаагийн хэлтэс",
    position: "Мөрдөгч",
    phone: "99778899",
    email: "enkhbayar.b@police.gov.mn",
    status: "active",
    joinDate: "2018-01-10",
  },
  {
    id: "OFF-005",
    name: "Түвшинбаяр С.",
    rank: "Дэд хурандаа",
    department: "Хяналтын хэлтэс",
    position: "Ахлах мөрдөгч",
    phone: "99001122",
    email: "tuvshinbayar.s@police.gov.mn",
    status: "training",
    joinDate: "2008-11-05",
  },
  {
    id: "OFF-006",
    name: "Баярсайхан Т.",
    rank: "Ахлах ахлагч",
    department: "Хяналтын хэлтэс",
    position: "Мөрдөгч",
    phone: "99334455",
    email: "bayarsaikhan.t@police.gov.mn",
    status: "active",
    joinDate: "2019-04-22",
  },
  {
    id: "OFF-007",
    name: "Мөнхбат Д.",
    rank: "Хошууч",
    department: "Хэрэг бүртгэлийн хэлтэс",
    position: "Ахлах мөрдөгч",
    phone: "99667788",
    email: "munkhbat.d@police.gov.mn",
    status: "active",
    joinDate: "2014-07-15",
  },
  {
    id: "OFF-008",
    name: "Баатарсүрэн Б.",
    rank: "Ахмад",
    department: "Эрүүгийн цагдаагийн хэлтэс",
    position: "Мөрдөгч",
    phone: "99990011",
    email: "baatarsuren.b@police.gov.mn",
    status: "retired",
    joinDate: "2005-09-30",
  },
  {
    id: "OFF-009",
    name: "Оюунчимэг Ч.",
    rank: "Дэд хурандаа",
    department: "Хяналтын хэлтэс",
    position: "Ахлах мөрдөгч",
    phone: "99223344",
    email: "oyunchimeg.ch@police.gov.mn",
    status: "active",
    joinDate: "2007-12-03",
  },
  {
    id: "OFF-010",
    name: "Батбаяр Н.",
    rank: "Ахлах ахлагч",
    department: "Хэрэг бүртгэлийн хэлтэс",
    position: "Мөрдөгч",
    phone: "99556677",
    email: "batbayar.n@police.gov.mn",
    status: "training",
    joinDate: "2020-02-18",
  },
]

export const columns: ColumnDef<Officer>[] = [
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
    accessorKey: "rank",
    header: "Цол",
    cell: ({ row }) => <div>{row.getValue("rank")}</div>,
  },
  {
    accessorKey: "department",
    header: "Хэлтэс",
    cell: ({ row }) => <div>{row.getValue("department")}</div>,
  },
  {
    accessorKey: "position",
    header: "Албан тушаал",
    cell: ({ row }) => <div>{row.getValue("position")}</div>,
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
        retired: { label: "Тэтгэвэрт", variant: "destructive" },
      }

      const { label, variant } = statusMap[status] || { label: status, variant: "default" }

      return <Badge variant={variant}>{label}</Badge>
    },
  },
  {
    accessorKey: "joinDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Элссэн огноо
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("joinDate")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const officer = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(officer.id)}>ID хуулах</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Дэлгэрэнгүй харах</DropdownMenuItem>
            <DropdownMenuItem>Засах</DropdownMenuItem>
            <DropdownMenuItem>Даалгавар оноох</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Устгах</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function OfficerList() {
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
                  Ажилтан олдсонгүй
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Нийт {table.getFilteredRowModel().rows.length} ажилтан
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

