'use client';

import { FormTemplate } from '@/lib/types/form.types';
import React from 'react';
import { ColumnDef, DataTableV2, TableParams } from '../data-table-v2';
import { ColumnHeader } from '../data-table-v2/column-header';
import TaskTypeToolbar from './task-type-toolbar';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';

const TaskTypesList = ({
  data,
  params,
}: {
  data?: FormTemplate[];
  params: TableParams;
}) => {
  const router = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    router.push(url.toString());
  };

  const columns: ColumnDef<FormTemplate & { action?: string }>[] = [
    {
      key: '_id',
      header: (props) => <ColumnHeader {...props} title="ID" />,
      renderCell: (row) => <div className="truncate">{row._id}</div>,
    },
    {
      key: 'name',
      header: (props) => (
        <ColumnHeader {...props} title="Даалгаварын төрлийн нэр" />
      ),
      renderCell: (row) => (
        <div className="font-medium whitespace-nowrap truncate">{row.name}</div>
      ),
    },
    {
      key: 'action',
      header: (props) => (
        <div className="flex justify-center">
          <ColumnHeader {...props} title="Үйлдэл" />
        </div>
      ),
      renderCell: (row) => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Цэс нээх</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {}}>
                  Дэлгэрэнгүй
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="!text-red-600 hover:!bg-red-500/20">
                  Устгах
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <DataTableV2
      columns={columns}
      data={data || []}
      params={params}
      toolbar={
        <TaskTypeToolbar
          filters={params.filters}
          onChangeFilter={handleFilterChange}
        />
      }
    />
  );
};

export default TaskTypesList;
