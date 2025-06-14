'use client';

import { useCallback, useEffect, useState } from 'react';
import {
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
import { List } from '@/lib/types/global.types';
import { User } from '@/lib/types/user.types';
import { format } from 'date-fns';
import { Branch } from '@/lib/types/branch.types';
import { useRouter } from 'next/navigation';
import { ColumnDef, DataTableV2, TableParams } from '../data-table-v2';
import OfficerListToolbar from './toolbar';
import { DataTablePagination } from '../data-table-v2/pagination';
import { ColumnHeader } from '../data-table-v2/column-header';

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

export const columns: ColumnDef<User & { status?: string }>[] = [
  {
    key: 'givenname',
    header: (props) => {
      return <ColumnHeader {...props} title="Нэр" />;
    },
    renderCell: (row) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`/placeholder.svg?height=32&width=32`}
              alt={row.givenname}
            />
            <AvatarFallback>
              {row.givenname?.toString().substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.givenname}</div>
        </div>
      );
    },
  },
  {
    key: 'workerId',
    header: (props) => {
      return <ColumnHeader {...props} title="Код" />;
    },
    renderCell: (row) => <div>{row.workerId}</div>,
  },
  {
    key: 'rank',
    header: (props) => {
      return <ColumnHeader {...props} title="Цол" />;
    },
    renderCell: (row) => <div>{row.rank}</div>,
  },
  {
    key: 'branch',
    header: (props) => {
      return <ColumnHeader {...props} title="Хэлтэс" className="w-[140px]" />;
    },
    renderCell: (row) => {
      const branch = row.branch as Branch;
      if (!branch) {
        return null;
      }
      return <div className="line-clamp-2">{branch?.name}</div>;
    },
  },
  {
    key: 'position',
    header: (props) => {
      return <ColumnHeader {...props} title="Албан тушаал" />;
    },
    renderCell: (row) => <div>{row.position}</div>,
  },
  {
    key: 'status',
    header: () => {
      return <div className="text-center">Төлөв</div>;
    },
    renderCell: (row) => {
      return <Badge variant={'success'}>Идэвхитэй</Badge>;
    },
  },
  {
    key: 'joinedDate',
    header: (props) => {
      return <ColumnHeader {...props} title="Элссэн огноо" />;
    },
    renderCell: (row) => {
      const dateValue = row.joinedDate as string;
      if (!dateValue) {
        return null;
      }
      return (
        <div className="text-center">
          {format(new Date(dateValue), 'yyyy-MM-dd')}
        </div>
      );
    },
    enableSort: true,
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
  params,
}: {
  data?: List<User>;
  params: TableParams;
}) {
  const total = data?.total || 1;
  const totalPages = data?.totalPages || 1;
  const rows = data?.rows || [];

  const router = useRouter();

  const handleSortChange = (key: string, direction: 'asc' | 'desc' | null) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', key);
    if (direction) url.searchParams.set('order', direction);
    else {
      url.searchParams.delete('sort');
      url.searchParams.delete('order');
    }
    url.searchParams.set('page', '1');
    router.push(url.toString());
  };

  const handleFilterChange = (key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    url.searchParams.set('page', '1');
    router.push(url.toString());
  };

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    router.push(url.toString());
  };

  const handlePageSizeChange = (pageSize: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('pageSize', pageSize.toString());
    url.searchParams.set('page', '1');
    router.push(url.toString());
  };

  return (
    <div className="space-y-4">
      <DataTableV2
        columns={columns}
        data={rows}
        params={params}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        toolbar={
          <OfficerListToolbar
            filters={params.filters}
            onChangeFilter={handleFilterChange}
          />
        }
      />
      <DataTablePagination
        pagination={{
          total,
          totalPages,
          page: params.page,
          pageSize: params.pageSize,
        }}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
