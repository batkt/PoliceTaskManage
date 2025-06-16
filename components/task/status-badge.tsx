import React from 'react';
import { CheckCircle, CircleDot, Circle, Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskStatus } from '@/lib/types/task.types';

export const statuses = [
  {
    value: TaskStatus.PENDING,
    label: 'Эхлээгүй',
    icon: Circle,
    color: 'text-muted-foreground',
  },
  {
    value: TaskStatus.ACTIVE,
    label: 'Идэвхитэй',
    icon: CircleDot,
    color: 'text-lime-400',
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: 'Хийгдэж байгаа',
    icon: Hourglass,
    color: 'text-blue-500',
  },
  {
    value: TaskStatus.COMPLETED,
    label: 'Дууссан',
    icon: CheckCircle,
    color: 'text-green-500',
  },
  {
    value: TaskStatus.REVIEWED,
    label: 'Хянагдсан',
    icon: CheckCircle,
    color: 'text-green-500',
  },
];

const StatusBadge = ({
  status,
  className,
  onlyIcon = false,
}: {
  status: string;
  className?: string;
  onlyIcon?: boolean;
}) => {
  const found = statuses.find((_s) => _s.value === status);

  if (!found) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center min-w-fit',
        onlyIcon ? 'w-fit' : 'w-[100px]',
        className
      )}
    >
      {found.icon && <found.icon className={cn('mr-2 h-4 w-4', found.color)} />}
      {!onlyIcon ? (
        <span className="flex-1 whitespace-nowrap">{found.label}</span>
      ) : null}
    </div>
  );
};

export default StatusBadge;
