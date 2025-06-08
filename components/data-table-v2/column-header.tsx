import React from 'react';
import { ColumnDef } from '.';
import { Button } from '../ui/button';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortDirection = 'asc' | 'desc' | null;

export type ColumnHeaderProps<T> = {
  colConfig: ColumnDef<T>;
  sorting?: {
    sort?: string;
    order?: SortDirection;
  };
  onSortChange?: (sortKey: string, direction: SortDirection) => void;
};

export function ColumnHeader<T>({
  title,
  colConfig,
  sorting,
  onSortChange,
  className = '',
}: {
  title: string;
  className?: string;
} & ColumnHeaderProps<T>) {
  const sort = sorting?.sort;
  const order = sorting?.order;

  const handleSort = (key: string) => {
    const isCurrent = sort === key;
    let next: SortDirection = null;

    if (!isCurrent) next = 'asc';
    else if (order === 'asc') next = 'desc';
    else if (order === 'desc') next = null;
    else next = 'asc';

    onSortChange?.(next ? key : '', next);
  };

  if (!colConfig?.enableSort && !colConfig?.enableFilter) {
    return (
      <div className={cn('whitespace-nowrap truncate', className)}>{title}</div>
    );
  }

  if (colConfig?.enableSort) {
    return (
      <div className={className}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort(colConfig?.key?.toString())}
        >
          <span className="whitespace-nowrap truncate">{title}</span>
          {order === 'desc' ? (
            <ArrowDown />
          ) : order === 'asc' ? (
            <ArrowUp />
          ) : (
            <ChevronsUpDown />
          )}
        </Button>
      </div>
    );
  }
  return <div></div>;
}
