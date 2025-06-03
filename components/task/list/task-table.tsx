'use client';

import {
  DataTableV2,
  TableParams,
  ColumnDef,
} from '@/components/data-table-v2';
import { useRouter } from 'next/navigation';
import { Task } from '@/lib/types/task.types';
import { ColumnHeader } from '../../data-table-v2/column-header';
import { Badge } from '../../ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CheckCircle, CircleDot, Circle, Timer } from 'lucide-react';
import { List } from '@/lib/types/global.types';
import { DataTablePagination } from '../../data-table-v2/pagination';

export const statuses = [
  {
    value: 'pending',
    label: 'Эхлээгүй',
    icon: Circle,
    color: 'text-muted-foreground',
  },
  {
    value: 'active',
    label: 'Идэвхитэй',
    icon: CircleDot,
    color: 'text-lime-400',
  },
  {
    value: 'processing',
    label: 'Хийгдэж байгаа',
    icon: Timer,
    color: 'text-blue-500',
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircle,
    color: 'text-green-500',
  },
];

export const priorities: {
  label: string;
  value: string;
  variant: 'lime' | 'yellow' | 'destructive';
}[] = [
  {
    label: 'Бага',
    value: 'low',
    variant: 'lime',
  },
  {
    label: 'Дунд',
    value: 'medium',
    variant: 'yellow',
  },
  {
    label: 'Өндөр',
    value: 'high',
    variant: 'destructive',
  },
];

export default function TaskTableList({
  data,
  params,
}: {
  data?: List<Task>;
  params: TableParams;
}) {
  const rows = data?.rows || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;
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

  const columns: ColumnDef<Task>[] = [
    {
      key: '_id',
      header: (props) => <ColumnHeader {...props} title="ID" />,
      renderCell: (row) => (
        <div className="max-w-[80px] truncate">{row._id}</div>
      ),
    },
    {
      key: 'title',
      header: (props) => <ColumnHeader {...props} title="Даалгаварын нэр" />,
      renderCell: (row) => (
        <div className="max-w-[200px] w-[140px] font-medium">{row.title}</div>
      ),
    },
    {
      key: 'status',
      header: (props) => <ColumnHeader {...props} title="Төлөв" />,

      renderCell: (row) => {
        const status = statuses.find((status) => status.value === row.status);

        if (!status) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center">
            {status.icon && (
              <status.icon className={cn('mr-2 h-4 w-4', status.color)} />
            )}
            <span>{status.label}</span>
          </div>
        );
      },
      //   filterFn: (row, id, value) => {
      //     return value.includes(row.getValue(id));
      //   },
    },
    {
      key: 'priority',
      header: (props) => <ColumnHeader {...props} title="Яаралтай эсэх" />,
      renderCell: (row) => {
        const priority = priorities.find(
          (priority) => priority.value === row.priority
        );

        if (!priority) {
          return null;
        }

        return (
          <div className="flex items-center justify-center">
            <Badge variant={priority.variant}>{priority.label}</Badge>
          </div>
        );
      },
      //   filterFn: (row, id, value) => {
      //     return value.includes(row.getValue(id));
      //   },
    },
    {
      key: 'assigner',
      header: (props) => <ColumnHeader {...props} title="Хариуцагч" />,
      renderCell: (row) => {
        return <div>{row?.assigner?.givenname}</div>;
      },
    },
    {
      key: 'startDate',
      header: (props) => (
        <div className="flex justify-center">
          <ColumnHeader {...props} title="Эхлэх огноо" />
        </div>
      ),
      renderCell: (row) => (
        <div className="text-center">
          {format(new Date(row.startDate), 'yyyy-MM-dd')}
        </div>
      ),
      enableSort: true,
    },
    {
      key: 'endDate',
      header: (props) => (
        <div className="flex justify-center">
          <ColumnHeader {...props} title="Дуусах огноо" />
        </div>
      ),
      renderCell: (row) => {
        const now = new Date();
        const today = new Date(now.toDateString());
        const endDate = new Date(row.endDate);

        return (
          <div
            className={cn(
              'text-center',
              today > endDate ? 'text-destructive' : ''
            )}
          >
            {format(endDate, 'yyyy-MM-dd')}
          </div>
        );
      },
      enableSort: true,
    },
  ];

  return (
    <div className="space-y-4">
      <DataTableV2
        columns={columns}
        data={rows}
        params={params}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        //   toolbar={
        //     <TableToolbar
        //       filters={params.filters}
        //       onChangeFilter={handleFilterChange}
        //     />
        //   }
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
