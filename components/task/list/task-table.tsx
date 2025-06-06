'use client';

import {
  DataTableV2,
  TableParams,
  ColumnDef,
} from '@/components/data-table-v2';
import { usePathname, useRouter } from 'next/navigation';
import { Task, TaskStatus, TaskStatusChangeType } from '@/lib/types/task.types';
import { ColumnHeader } from '../../data-table-v2/column-header';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { List } from '@/lib/types/global.types';
import { DataTablePagination } from '../../data-table-v2/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { changeStatusAction } from '@/ssr/actions/task';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import TaskDetailDialog from '../task-detail';
import StatusBadge from '../status-badge';
import PriorityBadge from '../priority-badge';
import { TaskDetailModal } from '../task-detail-modal';

type TaskWithAction = Task & { action?: '' };
export default function TaskTableList({
  data,
  params,
  noAction = false,
  clickToDetail = false,
}: {
  data?: List<TaskWithAction>;
  params: TableParams;
  noAction?: boolean;
  clickToDetail?: boolean;
}) {
  const rows = data?.rows || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isOpenDetailDialog, setOpenDetailDialog] = useState(true);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

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

  const handleChangeStatus = async (data: TaskStatusChangeType) => {
    const res = await changeStatusAction(data, pathname);

    if (res.code === 200) {
      let text = 'Төлөвлөгөөг амжилттай эхлүүллээ';
      if (data.status === 'completed') {
        text = 'Төлөвлөгөөг амжилттай гүйцэтгэж дууслаа';
      }
      toast({
        variant: 'success',
        title: 'Амжилттай.',
        description: text,
      });
      setOpenDetailDialog(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Алдаа гарлаа.',
        description: res.message || 'Системийн алдаа',
      });
    }
  };

  const goToDetail = (row: Task) => {
    setCurrentTask(row);
    setOpenDetailDialog(true);
  };
  const columns: ColumnDef<TaskWithAction>[] = [
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
      key: 'assignees',
      header: (props) => <ColumnHeader {...props} title="Хариуцагч" />,
      renderCell: (row) => {
        return <div>{row?.assignees?.[0].givenname}</div>;
      },
    },
    {
      key: 'createdBy',
      header: (props) => <ColumnHeader {...props} title="Үүсгэсэн" />,
      renderCell: (row) => {
        return <div>{row?.createdBy?.givenname}</div>;
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

  if (!noAction) {
    columns.push({
      key: 'action',
      header: (props) => (
        <div className="flex justify-center">
          <ColumnHeader {...props} title="Үйлдэл" />
        </div>
      ),
      renderCell: (row) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Цэс нээх</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => goToDetail(row)}>
                Дэлгэрэнгүй
              </DropdownMenuItem>
              {['pending', 'active'].includes(row.status) ? (
                <DropdownMenuItem
                  onClick={() =>
                    handleChangeStatus({
                      status: TaskStatus.IN_PROGRESS,
                      taskId: row._id,
                    })
                  }
                >
                  Хийж эхлэх
                </DropdownMenuItem>
              ) : null}

              {row.status === TaskStatus.IN_PROGRESS ? (
                <DropdownMenuItem
                  onClick={() =>
                    handleChangeStatus({
                      status: TaskStatus.COMPLETED,
                      taskId: row._id,
                    })
                  }
                >
                  Дуусгах
                </DropdownMenuItem>
              ) : null}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="!text-red-600 hover:!bg-red-500/20">
                Устгах
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return (
    <div className="space-y-4">
      <DataTableV2
        columns={columns}
        data={rows}
        params={params}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onRowClick={clickToDetail ? goToDetail : undefined}
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
      {/* {isOpenDetailDialog && currentTask ? (
        <TaskDetailDialog
          task={currentTask}
          open={isOpenDetailDialog}
          onClose={() => {
            setOpenDetailDialog(false);
          }}
          handleStatusChange={handleChangeStatus}
        />
      ) : null} */}
      {isOpenDetailDialog && currentTask ? (
        <TaskDetailModal
          taskId={currentTask._id}
          open={isOpenDetailDialog}
          onOpenChange={(e) => {
            setOpenDetailDialog(e);
          }}
          handleStatusChange={handleChangeStatus}
        />
      ) : null}
    </div>
  );
}
