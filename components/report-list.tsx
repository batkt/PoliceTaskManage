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
export type Report = {
  id: string
  title: string
  status: "draft" | "submitted" | "approved" | "rejected"
  type: "monthly" | "quarterly" | "yearly"
  submittedDate: string
  approvedBy?: string
}

const data: Report[] = [
  {
    id: "REP-2023-12",
    title: "2023 оны 12-р сарын тайлан",
    status: "approved",
    type: "monthly",
    submittedDate: "2024-01-05",
    approvedBy: "Д. Батбаяр",
  },
  {
    id: "REP-2023-11",
    title: "2023 оны 11-р сарын тайлан",
    status: "approved",
    type: "monthly",
    submittedDate: "2023-12-05",
    approvedBy: "Д. Батбаяр",
  },
  {
    id: "REP-2023-10",
    title: "2023 оны 10-р сарын тайлан",
    status: "approved",
    type: "monthly",
    submittedDate: "2023-11-05",
    approvedBy: "Д. Батбаяр",
  },
  {
    id: "REP-2023-Q4",
    title: "2023 оны 4-р улирлын тайлан",
    status: "draft",
    type: "quarterly",
    submittedDate: "",
  },
  {
    id: "REP-2023-Q3",
    title: "2023 оны 3-р улирлын тайлан",
    status: "approved",
    type: "quarterly",
    submittedDate: "2023-10-10",
    approvedBy: "Д. Батбаяр",
  },
  {
    id: "REP-2023-Q2",
    title: "2023 оны 2-р улирлын тайлан",
    status: "approved",
    type: "quarterly",
    submittedDate: "2023-07-10",
    approvedBy: "Д. Батбаяр",
  },
  {
    id: "REP-2023-Q1",
    title: "2023 оны 1-р улирлын тайлан",
    status: "approved",
    type: "quarterly",
    submittedDate: "2023-04-10",
    approvedBy: "Д. Батбаяр",
  },
  {
    id: "REP-2022",
    title: "2022 оны жилийн тайлан",
    status: "approved",
    type: "yearly",
    submittedDate: "2023-01-15",
    approvedBy: "Д. Батбаяр",
  },
  {
    id: "REP-2021",
    title: "2021 оны жилийн тайлан",
    status: "approved",
    type: "yearly",
    submittedDate: "2022-01-15",
    approvedBy: "Д. Батбаяр",
  },
  {
    id: "REP-2023",
    title: "2023 оны жилийн тайлан",
    status: "submitted",
    type: "yearly",
    submittedDate: "2024-01-15",
  },
]

export const columns: ColumnDef<Report>[] = [
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
          Тайлангийн нэр
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
        draft: { label: "Ноорог", variant: "outline" },
        submitted: { label: "Илгээсэн", variant: "secondary" },
        approved: { label: "Батлагдсан", variant: "success" },
        rejected: { label: "Татгалзсан", variant: "destructive" },
      }

      const { label, variant } = statusMap[status] || { label: status, variant: "default" }

      return <Badge variant={variant}>{label}</Badge>
    },
  },
  {
    accessorKey: "submittedDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Илгээсэн огноо
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("submittedDate") || "-"}</div>,
  },
  {
    accessorKey: "approvedBy",
    header: "Баталсан",
    cell: ({ row }) => <div>{row.getValue("approvedBy") || "-"}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const report = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(report.id)}>ID хуулах</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Дэлгэрэнгүй харах</DropdownMenuItem>
            <DropdownMenuItem>Засах</DropdownMenuItem>
            <DropdownMenuItem>Хэвлэх</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Устгах</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ReportList({ type }: { type: string }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Filter data based on type prop
  const filteredData = data.filter((report) => report.type === type)

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
          placeholder="Тайлангаар хайх..."
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
                  Тайлан олдсонгүй
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Нийт {table.getFilteredRowModel().rows.length} тайлан
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

