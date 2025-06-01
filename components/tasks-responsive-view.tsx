'use client';
import { useMediaQuery } from '@/hooks/use-media-query';
import { TasksCardView } from '@/components/tasks-card-view';
import { TasksTableView } from '@/components/tasks-table-view';
import { Task } from '@/lib/types/task.types';
import { List } from '@/lib/types/global.types';

export function TasksResponsiveView({
  status = 'all',
  data,
}: {
  status?: string;
  data?: List<Task>;
}) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return isMobile ? (
    <TasksCardView status={status} />
  ) : (
    <TasksTableView status={status} data={data} />
  );
}
