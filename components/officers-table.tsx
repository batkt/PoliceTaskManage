"use client";

import { useState, useEffect, useCallback } from "react";
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
import { ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This type is used to define the shape of our data.
export type Officer = {
  id: string;
  register: string;
  lastName: string;
  firstName: string;
  rank: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  status: "active" | "on_leave" | "training" | "retired";
  joinDate: string;
  imageUrl?: string;
};

const data: Officer[] = [
  {
    id: "OFF-001",
    register: "АБ12345678",
    lastName: "Отгонбаяр",
    firstName: "Батбаяр",
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
    register: "ЦД87654321",
    lastName: "Дэлгэрмаа",
    firstName: "Дорж",
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
    register: "ЕФ98765432",
    lastName: "Ганбаатар",
    firstName: "Баатар",
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
    register: "ЖИ45678901",
    lastName: "Энхбаяр",
    firstName: "Баяр",
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
    register: "КЛ23456789",
    lastName: "Түвшинбаяр",
    firstName: "Сүхбаатар",
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
    register: "МН34567890",
    lastName: "Баярсайхан",
    firstName: "Төмөр",
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
    register: "ОП45678901",
    lastName: "Мөнхбат",
    firstName: "Дорж",
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
    register: "РС56789012",
    lastName: "Баатарсүрэн",
    firstName: "Баяр",
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
    register: "ТУ67890123",
    lastName: "Оюунчимэг",
    firstName: "Чимэг",
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
    register: "ФХ78901234",
    lastName: "Батбаяр",
    firstName: "Наран",
    rank: "Ахлах ахлагч",
    department: "Хэрэг бүртгэлийн хэлтэс",
    position: "Мөрдөгч",
    phone: "99556677",
    email: "batbayar.n@police.gov.mn",
    status: "training",
    joinDate: "2020-02-18",
  },
];

export const columns: ColumnDef<Officer>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "image",
    header: "Зураг",
    cell: ({ row }) => {
      const officer = row.original;
      return (
        <div className="flex justify-center">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={officer.imageUrl || `/placeholder.svg?height=40&width=40`}
              alt={officer.firstName}
            />
            <AvatarFallback>
              {officer.lastName.charAt(0)}
              {officer.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "lastName",
    header: "Овог",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("lastName")}</div>
    ),
  },
  {
    accessorKey: "firstName",
    header: "Нэр",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("firstName")}</div>
    ),
  },
  {
    accessorKey: "register",
    header: "Регистр",
    cell: ({ row }) => <div>{row.getValue("register")}</div>,
  },
  {
    accessorKey: "rank",
    header: "Цол",
    cell: ({ row }) => <div>{row.getValue("rank")}</div>,
  },
  {
    accessorKey: "department",
    header: "Тасаг",
    cell: ({ row }) => <div>{row.getValue("department")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const officer = row.original;

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
              onClick={() => navigator.clipboard.writeText(officer.id)}
            >
              ID хуулах
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Дэлгэрэнгүй харах</DropdownMenuItem>
            <DropdownMenuItem>Засах</DropdownMenuItem>
            <DropdownMenuItem>Даалгавар оноох</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Устгах</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function OfficersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [table, setTable] = useState(
    useReactTable({
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
        globalFilter,
      },
      onGlobalFilterChange: setGlobalFilter,
    })
  );

  useEffect(() => {
    setTable(
      useReactTable({
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
          globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
      })
    );
  }, [sorting, columnFilters, globalFilter]);

  const handleGlobalSearch = useCallback(
    (searchTerm: string) => {
      table.setGlobalFilter(searchTerm);
    },
    [table]
  );

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent;
      handleGlobalSearch(customEvent.detail);
    };

    window.addEventListener("globalSearch", listener);

    return () => {
      window.removeEventListener("globalSearch", listener);
    };
  }, [handleGlobalSearch]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex-1"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
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
                  Алба хаагч олдсонгүй
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Нийт {table.getFilteredRowModel().rows.length} алба хаагч
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
