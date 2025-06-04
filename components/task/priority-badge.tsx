import React from 'react';
import { Badge } from '../ui/badge';

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

const PriorityBadge = ({ priority }: { priority: string }) => {
  const found = priorities.find((_p) => _p.value === priority);

  if (!found) {
    return null;
  }

  return <Badge variant={found.variant}>{found.label}</Badge>;
};

export default PriorityBadge;
