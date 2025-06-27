'use client';

import {
  DataTableV2,
  TableParams,
  ColumnDef,
} from '@/components/data-table-v2';
import { useRouter } from 'next/navigation';
import { Task } from '@/lib/types/task.types';
import { ColumnHeader } from '../../data-table-v2/column-header';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { List } from '@/lib/types/global.types';
import { DataTablePagination } from '../../data-table-v2/pagination';
import StatusBadge from '../status-badge';
import PriorityBadge from '../priority-badge';
import TaskListToolbar from './toolbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FormTemplate } from '@/lib/types/form.types';

type TaskWithAction = Task & { action?: '' };
export default function TaskTableList({
  data,
  params,
  template,
}: {
  data?: List<TaskWithAction>;
  params: TableParams;
  clickToDetail?: boolean;
  tableKey?: string;
  template?: FormTemplate;
}) {
  const rows = data?.rows || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
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
    else {
      url.searchParams.delete(key);
    }
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

  const goToDetail = (row: Task) => {
    router.push(`/dashboard/task/detail/${row._id}`);
  };

  let dynamicColumns: ColumnDef<TaskWithAction>[] = [];
  if (template) {
    const dynamicColFields = template.fields?.filter(
      (item) => item.showInTable
    );

    if (dynamicColFields.length > 0) {
      dynamicColumns = dynamicColFields.map(
        (item): ColumnDef<TaskWithAction> => {
          return {
            key: item.name,
            header: (props) => (
              <ColumnHeader
                {...props}
                title={item.label}
                filterValue={params.filters?.[item.name]}
                type={item.type}
                onFilterChange={handleFilterChange}
                filterOptions={item.options?.map((op) => ({
                  value: op,
                  label: op,
                }))}
              />
            ),
            enableFilter: true,
            renderCell: (row) => (
              <div className="font-medium whitespace-nowrap truncate">
                {row.formValues?.[item.name]}
              </div>
            ),
          };
        }
      );
    }
  }
  const columns: ColumnDef<TaskWithAction>[] = [
    {
      key: 'title',
      header: (props) => (
        <ColumnHeader
          {...props}
          title="Даалгаварын нэр"
          className="max-w-[200px] w-[140px]"
        />
      ),
      renderCell: (row) => (
        <div className="font-medium whitespace-nowrap truncate">
          {row.title}
        </div>
      ),
    },
    ...dynamicColumns,
    {
      key: 'status',
      header: (props) => (
        <div className="flex items-center justify-center">
          <ColumnHeader {...props} title="Төлөв" />
        </div>
      ),

      renderCell: (row) => {
        return (
          <div className="flex justify-center items-center">
            <StatusBadge status={row.status} />
          </div>
        );
      },
    },
    {
      key: 'priority',
      header: (props) => (
        <div className="flex items-center justify-center">
          <ColumnHeader {...props} title="Яаралтай эсэх" />
        </div>
      ),
      renderCell: (row) => {
        return (
          <div className="flex items-center justify-center">
            <PriorityBadge priority={row.priority} />
          </div>
        );
      },
    },
    {
      key: 'assignee',
      header: (props) => (
        <ColumnHeader
          {...props}
          type={'user-select'}
          onFilterChange={handleFilterChange}
          filterValue={params.filters?.assignee}
          title="Хариуцагч"
        />
      ),
      enableFilter: true,
      renderCell: (row) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row?.assignee?.profileImageUrl} />
              <AvatarFallback className="text-xs">
                {row?.assignee?.givenname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="font-medium text-sm flex items-center">
              {row?.assignee?.givenname}
            </div>
          </div>
        );
      },
    },
    {
      key: 'createdBy',
      header: (props) => <ColumnHeader {...props} title="Үүсгэсэн" />,
      renderCell: (row) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row?.createdBy?.profileImageUrl} />
              <AvatarFallback className="text-xs">
                {row?.createdBy?.givenname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="font-medium text-sm flex items-center">
              {row?.createdBy?.givenname}
            </div>
          </div>
        );
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
      key: 'dueDate',
      header: (props) => (
        <div className="flex justify-center">
          <ColumnHeader {...props} title="Дуусах огноо" />
        </div>
      ),
      renderCell: (row) => {
        const now = new Date();
        const today = new Date(now.toDateString());
        const dueDate = row?.dueDate ? new Date(row?.dueDate) : new Date();

        return (
          <div
            className={cn(
              'text-center',
              'text-center',
              today > dueDate ? 'text-destructive' : ''
            )}
          >
            {format(dueDate, 'yyyy-MM-dd')}
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
        onRowClick={goToDetail}
        toolbar={
          <TaskListToolbar
            tableKey={'all-tasks'}
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
