'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { JobListCards } from '@/components/job-list-cards';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/lib/types/task.types';

type MyTasksResponsiveViewProps = {
  status?: string;
  data?: Task[];
};

export function MyTasksResponsiveView({
  status = 'all',
  data = [],
}: MyTasksResponsiveViewProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const allTasks = data;

  // Status mapping for display
  const getStatusInfo = (status: string) => {
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
      pending: { label: 'Эхлээгүй', variant: 'secondary' },
      active: { label: 'Идэвхитэй', variant: 'yellow' },
      processing: { label: 'Хийгдэж байгаа', variant: 'default' },
      completed: { label: 'Дууссан', variant: 'success' },
    };

    return statusMap[status] || { label: status, variant: 'default' };
  };

  const renderType = (type: string) => {
    if (type === 'memo') {
      return 'Албан бичиг';
    }
    if (type === 'work-group') {
      return 'Ажлын хэсэг';
    }
    return '-';
  };

  const getPriorityData = (priority: string) => {
    const statusMap: Record<
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
    return statusMap[priority] || { label: priority, variant: 'default' };
  };

  // If mobile, show card view
  if (isMobile) {
    return <JobListCards status={status} />;
  }

  // Otherwise show list view
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Нэр</TableHead>
            <TableHead>Төлөв</TableHead>
            <TableHead>Төрөл</TableHead>
            <TableHead>Чухал зэрэг</TableHead>
            <TableHead>Эхлэх огноо</TableHead>
            <TableHead>Дуусах огноо</TableHead>
            <TableHead className="text-right">Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Даалгавар олдсонгүй.
              </TableCell>
            </TableRow>
          ) : (
            allTasks.map((task, index) => {
              const { label, variant } = getStatusInfo(task.status);
              const priorityData = getPriorityData(task.priority);

              return (
                <TableRow key={task._id}>
                  <TableCell className="font-medium max-w-[120px] truncate">
                    {task._id}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {task.assignees?.[0].givenname}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant}>{label}</Badge>
                  </TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>
                    <Badge variant={priorityData.variant}>
                      {priorityData.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(task.startDate), 'yyyy-MM-dd')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(task.dueDate), 'yyyy-MM-dd')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Цэс нээх</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Үйлдлүүд</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            // navigator.clipboard.writeText(task._id)
                          }}
                        >
                          Дэлгэрэнгүй харах
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* <JobRegistrationDialog editJob={task}>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              Засах
                            </DropdownMenuItem>
                          </JobRegistrationDialog> */}
                        <DropdownMenuItem className="text-destructive">
                          Устгах
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
