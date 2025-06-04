import React from 'react';
import { CheckCircle, CircleDot, Circle, Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    icon: Hourglass,
    color: 'text-blue-500',
  },
  {
    value: 'completed',
    label: 'Дууссан',
    icon: CheckCircle,
    color: 'text-green-500',
  },
];

const StatusBadge = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  const found = statuses.find((_s) => _s.value === status);

  if (!found) {
    return null;
  }

  return (
    <div className={cn('flex w-[100px] items-center min-w-fit', className)}>
      {found.icon && <found.icon className={cn('mr-2 h-4 w-4', found.color)} />}
      <span className="flex-1 whitespace-nowrap">{found.label}</span>
    </div>
  );
};

export default StatusBadge;
