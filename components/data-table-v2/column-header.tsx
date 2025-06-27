import React, { useState } from 'react';
import { ColumnDef } from '.';
import { Button } from '../ui/button';
import { ArrowDown, ArrowUp, ChevronsUpDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FieldType } from '@/lib/types/task-type.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerCustom,
} from '../ui/select';
import { UserSelect } from '../ui/user-select';

export type SortDirection = 'asc' | 'desc' | null;

export type ColumnHeaderProps<T> = {
  colConfig: ColumnDef<T>;
  sorting?: {
    sort?: string;
    order?: SortDirection;
  };
  filterValue?: string;
  additional?: Record<string, any>;
  type?: FieldType;
  filterOptions?: { value: string; label: string }[];
  onSortChange?: (sortKey: string, direction: SortDirection) => void;
  onFilterChange?: (key: string, value: string) => void;
};

export function ColumnHeader<T>({
  title,
  colConfig,
  sorting,
  filterValue = '',
  additional = {},
  type = 'text',
  filterOptions = [],
  onSortChange,
  onFilterChange,
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

  return (
    <div className={cn('flex gap-2', className)}>
      {colConfig.enableSort && (
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
      )}
      {colConfig.enableFilter && (
        <>
          {type === 'select' && (
            <Select
              onValueChange={(e) => {
                if (e === 'бүгд') {
                  onFilterChange?.(colConfig.key, '');
                  return;
                }
                onFilterChange?.(colConfig.key, e);
              }}
              defaultValue={filterValue}
            >
              <SelectTriggerCustom
                asChild
                className="focus:ring-0 border-none focus:border-none focus:ring-transparent h-fit"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="focus:ring-0 border-none focus:border-none focus:ring-transparent h-fit"
                >
                  <span className="whitespace-nowrap truncate">{title}</span>
                  <div className="relative">
                    <Filter />
                    <div
                      className={cn(
                        'absolute -top-0.5 -right-0.5 transition-all duration-200 size-2 rounded-full bg-red-400',
                        filterValue ? 'opacity-100' : 'opacity-0'
                      )}
                    ></div>
                  </div>
                </Button>
              </SelectTriggerCustom>
              <SelectContent>
                <SelectItem value="бүгд">Бүгд</SelectItem>
                {filterOptions.map(
                  (option: { label: string; value: string }) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          )}
          {(type === 'user-select' || type === 'multi-user-select') && (
            <UserSelect
              value={filterValue}
              onChange={(e) => {
                onFilterChange?.(colConfig.key, e);
              }}
              clearable={true}
              trigger={
                <Button type="button" variant="ghost" size="sm">
                  <span className="whitespace-nowrap truncate">{title}</span>
                  <div className="relative">
                    <Filter />
                    <div
                      className={cn(
                        'absolute -top-0.5 -right-0.5 transition-all duration-200 size-2 rounded-full bg-red-400',
                        filterValue ? 'opacity-100' : 'opacity-0'
                      )}
                    ></div>
                  </div>
                </Button>
              }
            />
          )}

          {!['select', 'user-select', 'multi-user-select'].includes(type) && (
            <div className={cn('whitespace-nowrap truncate', className)}>
              {title}
            </div>
          )}
        </>
      )}
    </div>
  );
}
