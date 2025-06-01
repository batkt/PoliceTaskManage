'use client';

import type React from 'react';

import { useState } from 'react';
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
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
} from 'lucide-react';
import { differenceInDays, format } from 'date-fns';

import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { TaskEditDialog } from './task-edit-dialog';
import { ConfirmDialog } from './confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  AlertTriangle,
} from 'lucide-react';
import { List } from '@/lib/types/global.types';
import { Task } from '@/lib/types/task.types';
import { User } from '@/lib/types/user.types';

export function TasksTableView({
  status = 'all',
  data,
}: {
  status?: string;
  data?: List<Task>;
}) {
  const rows = data?.rows || [];
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    status !== 'all'
      ? [
          {
            id: 'status',
            value: status,
          },
        ]
      : []
  );
  const [paginationState, setPaginationState] = useState({
    pageIndex: (data?.currentPage || 1) - 1,
    pageSize: 10,
  });

  const { toast } = useToast();

  // Handle task update
  const handleTaskUpdate = (updatedTask: any) => {
    // setData(
    //   data.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    // );
    // toast({
    //   title: 'Даалгавар шинэчлэгдлээ',
    //   description: 'Даалгаврын мэдээлэл амжилттай шинэчлэгдлээ.',
    // });
  };

  // Handle task delete
  const handleTaskDelete = (taskId: string) => {
    // setData(data.filter((task) => task.id !== taskId));
    // toast({
    //   title: 'Даалгавар устгагдлаа',
    //   description: 'Даалгавар амжилттай устгагдлаа.',
    //   variant: 'destructive',
    // });
  };

  // Handle status change
  const handleStatusChange = (taskId: string, newStatus: string) => {
    // setData(
    //   data.map((task) =>
    //     task.id === taskId ? { ...task, status: newStatus } : task
    //   )
    // );
    // const statusLabels: Record<string, string> = {
    //   pending: 'Хүлээгдэж буй',
    //   in_progress: 'Хийгдэж буй',
    //   completed: 'Дууссан',
    //   overdue: 'Хоцорсон',
    // };
    // toast({
    //   title: 'Төлөв өөрчлөгдлөө',
    //   description: `Даалгаврын төлөв "${statusLabels[newStatus]}" болж өөрчлөгдлөө.`,
    // });
  };

  // Calculate remaining days
  const getRemainingDays = (dueDate: string, status: string) => {
    if (status === 'completed') {
      return {
        days: 0,
        text: 'Дууссан',
        className: 'text-green-500 dark:text-green-400',
      };
    }

    const today = new Date();
    const due = new Date(dueDate);
    const days = differenceInDays(due, today);

    if (days < 0) {
      return {
        days: Math.abs(days),
        text: `${Math.abs(days)} хоног хоцорсон`,
        className: 'text-red-500 dark:text-red-400',
      };
    } else if (days === 0) {
      return {
        days: 0,
        text: 'Өнөөдөр дуусна',
        className: 'text-yellow-500 dark:text-yellow-400',
      };
    } else {
      return {
        days,
        text: `${days} хоног үлдсэн`,
        className: 'text-blue-500 dark:text-blue-400',
      };
    }
  };

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: '_id',
      header: 'ID',
      cell: ({ row }) => (
        <div className="font-medium max-w-[100px] truncate">
          {row.getValue('_id')}
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Даалгаврын нэр
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Төлөв',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;

        const statusMap: Record<
          string,
          {
            label: string;
            variant:
              | 'default'
              | 'destructive'
              | 'outline'
              | 'secondary'
              | 'yellow'
              | 'success';
          }
        > = {
          pending: {
            label: 'Эхлээгүй',
            variant: 'outline',
          },
          active: {
            label: 'Идэвхитэй',
            variant: 'yellow',
          },
          processing: {
            label: 'Хийгдэж буй',
            variant: 'secondary',
          },
          completed: {
            label: 'Дууссан',
            variant: 'success',
          },
        };

        const { label, variant } = statusMap[status] || {
          label: status,
          variant: 'default',
        };

        return (
          <Badge variant={variant} className="flex items-center">
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: 'Чухал зэрэг',
      cell: ({ row }) => {
        const priority = row.getValue('priority') as string;

        const priorityMap: Record<
          string,
          {
            label: string;
            variant: 'default' | 'destructive' | 'warning';
          }
        > = {
          low: { label: 'Бага', variant: 'default' },
          medium: { label: 'Дунд', variant: 'warning' },
          high: { label: 'Яаралтай', variant: 'destructive' },
        };

        const { label, variant } = priorityMap[priority] || {
          label: priority,
          variant: 'default',
        };

        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      accessorKey: 'assigner',
      header: 'Хариуцагч',
      cell: ({ row }) => {
        const assigner = row.getValue('assigner') as User;
        return <div>{assigner.givenname}</div>;
      },
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Эхлэх огноо
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{format(new Date(row.getValue('startDate')), 'yyyy-MM-dd')}</div>
      ),
    },
    {
      accessorKey: 'endDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Дуусах огноо
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{format(new Date(row.getValue('endDate')), 'yyyy-MM-dd')}</div>
      ),
    },
    // {
    //   id: 'remainingDays',
    //   header: 'Үлдсэн хугацаа',
    //   cell: ({ row }) => {
    //     const task = row.original;
    //     const { text, className } = getRemainingDays(task., task.status);

    //     return (
    //       <div className={`flex items-center ${className}`}>
    //         <Clock className="mr-2 h-4 w-4" />
    //         <span>{text}</span>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   id: 'actions',
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const task = row.original;

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
    //           <DropdownMenuItem
    //             onClick={() => navigator.clipboard.writeText(task.id)}
    //           >
    //             ID хуулах
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuSub>
    //             <DropdownMenuSubTrigger>Төлөв өөрчлөх</DropdownMenuSubTrigger>
    //             <DropdownMenuPortal>
    //               <DropdownMenuSubContent>
    //                 <DropdownMenuItem
    //                   onClick={() => handleStatusChange(task.id, 'pending')}
    //                 >
    //                   <PauseCircle className="mr-2 h-4 w-4" />
    //                   <span>Хүлээгдэж буй</span>
    //                 </DropdownMenuItem>
    //                 <DropdownMenuItem
    //                   onClick={() => handleStatusChange(task.id, 'in_progress')}
    //                 >
    //                   <PlayCircle className="mr-2 h-4 w-4" />
    //                   <span>Хийгдэж буй</span>
    //                 </DropdownMenuItem>
    //                 <DropdownMenuItem
    //                   onClick={() => handleStatusChange(task.id, 'completed')}
    //                 >
    //                   <CheckCircle2 className="mr-2 h-4 w-4" />
    //                   <span>Дууссан</span>
    //                 </DropdownMenuItem>
    //                 <DropdownMenuItem
    //                   onClick={() => handleStatusChange(task.id, 'overdue')}
    //                 >
    //                   <AlertTriangle className="mr-2 h-4 w-4" />
    //                   <span>Хоцорсон</span>
    //                 </DropdownMenuItem>
    //               </DropdownMenuSubContent>
    //             </DropdownMenuPortal>
    //           </DropdownMenuSub>
    //           <TaskEditDialog task={task} onTaskUpdated={handleTaskUpdate}>
    //             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    //               <Edit className="mr-2 h-4 w-4" />
    //               Засах
    //             </DropdownMenuItem>
    //           </TaskEditDialog>
    //           <DropdownMenuSeparator />
    //           <ConfirmDialog
    //             title="Даалгавар устгах"
    //             description={`"${task.title}" даалгаврыг устгахдаа итгэлтэй байна уу?`}
    //             onConfirm={() => handleTaskDelete(task.id)}
    //           >
    //             <DropdownMenuItem
    //               onSelect={(e) => e.preventDefault()}
    //               className="text-red-600"
    //             >
    //               <Trash2 className="mr-2 h-4 w-4" />
    //               Устгах
    //             </DropdownMenuItem>
    //           </ConfirmDialog>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,

    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: true,

    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPaginationState,
    manualPagination: true,
    pageCount: data?.totalPages,

    rowCount: data?.total,
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
          placeholder="Даалгавраар хайх..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
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
                  Даалгавар олдсонгүй
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Нийт {data?.total} даалгавар
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
