'use client';

import React from 'react';
import { ColumnDef, DataTableV2, TableParams } from '../data-table-v2';
import { DataTablePagination } from '../data-table-v2/pagination';
import { List } from '@/lib/types/global.types';
import { Notification } from '@/lib/types/notification.types';
import { ColumnHeader } from '../data-table-v2/column-header';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { usePathname, useRouter } from 'next/navigation';
import { useNotifications } from '@/context/notification-context';
import { useTasks } from '@/context/task-context';

const NotificationList = ({
  data,
  params,
}: {
  data?: List<Notification>;
  params: TableParams;
}) => {
  const { markAsRead } = useNotifications();
  const { openTaskDetailModal } = useTasks();
  const pathname = usePathname();
  const total = data?.total || 1;
  const totalPages = data?.totalPages || 1;
  const rows = data?.rows || [];

  const router = useRouter();

  const columns: ColumnDef<Notification>[] = [
    {
      key: 'title',
      header: (props) => {
        return <ColumnHeader {...props} title="Нэр" className="w-[200px]" />;
      },
      renderCell: (row) => {
        return (
          <div>
            <div className="font-medium">{row.title}</div>
            <div className="font-medium text-muted-foreground">
              {row.message}
            </div>
          </div>
        );
      },
    },

    {
      key: 'read',
      header: (props) => {
        return (
          <div className="flex items-center justify-center">
            <ColumnHeader {...props} title="Төлөв" />
          </div>
        );
      },
      renderCell: (row) => {
        return (
          <Badge variant={row.read ? 'default' : 'success'}>
            {row.read ? 'Уншсан' : 'Уншаагүй'}
          </Badge>
        );
      },
    },
    {
      key: 'createdAt',
      header: (props) => {
        return <ColumnHeader {...props} title="Ирсэн огноо" />;
      },
      renderCell: (row) => {
        const dateValue = row.createdAt as string;
        if (!dateValue) {
          return null;
        }
        return (
          <div className="text-center whitespace-nowrap">
            {format(new Date(dateValue), 'yyyy-MM-dd')}
          </div>
        );
      },
    },
  ];

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
        onRowClick={async (data) => {
          await markAsRead(data, pathname);
          if (data.type === 'task') {
            openTaskDetailModal(data?.taskId!);
          }
        }}
        // toolbar={
        //   <OfficerListToolbar
        //     filters={params.filters}
        //     onChangeFilter={handleFilterChange}
        //   />
        // }
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
};

export default NotificationList;
