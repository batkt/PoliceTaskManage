'use client';

import { useCallback, useEffect, useState } from 'react';
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
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { List, Pagination, Sort } from '@/lib/types/global.types';
import { User } from '@/lib/types/user.types';
import { format } from 'date-fns';
import { Branch } from '@/lib/types/branch.types';
import { usePathname, useRouter } from 'next/navigation';
import { queryStringBuilder } from '@/lib/query.util';

const columnInformations = [
  {
    key: 'givenname',
    name: 'Нэр',
  },
  {
    key: 'rank',
    name: 'Цол',
  },
  {
    key: 'branch',
    name: 'Хэлтэс',
  },
  {
    key: 'position',
    name: 'Албан тушаал',
  },
  {
    key: 'status',
    name: 'Төлөв',
  },
  {
    key: 'joinedDate',
    name: 'Элссэн огноо',
  },
];

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'givenname',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Нэр
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`/placeholder.svg?height=32&width=32`}
              alt={row.getValue('givenname')}
            />
            <AvatarFallback>
              {row.getValue('givenname')?.toString().substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.getValue('givenname')}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'rank',
    header: 'Цол',
    cell: ({ row }) => <div>{row.getValue('rank')}</div>,
  },
  {
    accessorKey: 'branch',
    header: 'Хэлтэс',
    cell: ({ row }) => {
      const branch = row.getValue('branch') as Branch;
      if (!branch) {
        return null;
      }
      return <div>{branch?.name}</div>;
    },
  },
  {
    accessorKey: 'position',
    header: 'Албан тушаал',
    cell: ({ row }) => <div>{row.getValue('position')}</div>,
  },
  {
    accessorKey: 'status',
    header: () => {
      return <div className="text-center">Төлөв</div>;
    },
    cell: ({ row }) => {
      return <Badge variant={'success'}>Идэвхитэй</Badge>;
    },
  },
  {
    accessorKey: 'joinedDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Элссэн огноо
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue('joinedDate') as string;
      if (!dateValue) {
        return null;
      }
      return (
        <div className="text-center">
          {format(new Date(dateValue), 'yyyy-MM-dd')}
        </div>
      );
    },
  },
  // {
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const officer = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Цэс нээх</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Үйлдлүүд</DropdownMenuLabel>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>Дэлгэрэнгүй харах</DropdownMenuItem>
  //           <DropdownMenuItem>Засах</DropdownMenuItem>
  //           <DropdownMenuItem>Даалгавар оноох</DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem className="text-red-600">Устгах</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

export function OfficerList({
  data,
  pagination,
  sort,
  filters,
}: {
  data?: List<User>;
  pagination?: Pagination;
  sort?: Sort;
  filters?: Record<string, string | number>;
}) {
  const total = data?.total || 1;
  const totalPages = data?.totalPages || 1;
  const rows = data?.rows || [];
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 2;

  const router = useRouter();
  const pathname = usePathname();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    filters
      ? Object.keys(filters).map((fKey) => {
          return {
            id: fKey,
            value: filters[fKey],
          };
        })
      : []
  );

  const [paginationState, setPaginationState] = useState({
    pageIndex: page - 1,
    pageSize: pageSize,
  });

  const filterRoute = useCallback(
    (filter: Record<string, string | number | undefined | null>) => {
      const q = {
        page: page,
        pageSize,
        sortBy: sort?.sortBy,
        sortOrder: sort?.sortOrder,
        filters: filters ? encodeURIComponent(JSON.stringify(filters)) : '',
        ...filter,
      };
      router.push(`${pathname}?${queryStringBuilder(q)}`);
    },
    [page, pageSize, sort, filters]
  );

  useEffect(() => {
    if (sorting?.length > 0) {
      filterRoute({
        sortBy: sorting[0].id,
        sortOrder: sorting[0].desc ? 'desc' : 'asc',
        page: 1,
      });
    }
  }, [sorting]);

  useEffect(() => {
    console.log('wtf');
    if (columnFilters?.length > 0) {
      const filters = columnFilters.reduce<Record<string, unknown>>(
        (acc, cur) => {
          acc[cur.id] = cur.value;
          return acc;
        },
        {}
      );

      filterRoute({
        page: 1,
        filters: encodeURIComponent(JSON.stringify(filters)),
      });
    } else {
      filterRoute({
        page: 1,
        filters: '',
      });
    }
  }, [columnFilters]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPaginationState,
    pageCount: totalPages,
    manualPagination: true,

    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,

    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: true,

    state: {
      sorting,
      columnFilters,
      pagination: paginationState,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Нэрээр хайх..."
          value={
            (table.getColumn('givenname')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('givenname')?.setFilterValue(event.target.value)
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
                const columnInfo = columnInformations?.find(
                  (col) => col.key === column.id
                );
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnInfo?.name}
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
                  data-state={row.getIsSelected() && 'selected'}
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
                  Ажилтан олдсонгүй
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Нийт {total} ажилтан
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              filterRoute({ page: page - 1 });
            }}
            disabled={page <= 1}
          >
            Өмнөх
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              filterRoute({ page: page + 1 });
            }}
            disabled={totalPages <= page}
          >
            Дараах
          </Button>
        </div>
      </div>
    </div>
  );
}
