'use client';

import { ToolbarProps } from '@/components/data-table-v2';
import React from 'react';
import Statusbar from './statusbar';
import SearchInput from '../search-input';

const statuses = [
  {
    key: 'all',
    name: 'Бүгд',
  },
  {
    key: 'active',
    name: 'Идэвхитэй',
  },
  {
    key: 'processing',
    name: 'Хийгдэж байгаа',
  },
  {
    key: 'completed',
    name: 'Дууссан',
  },
];

const TaskListToolbar = ({
  filters,
  onChangeFilter,
  tableKey,
}: ToolbarProps & { tableKey: string }) => {
  return (
    <div className="flex max-md:flex-col-reverse md:justify-between gap-4 mb-4">
      <Statusbar
        data={tableKey === 'all-tasks' ? statuses : undefined}
        status={filters?.status || 'all'}
        onChange={(e) => {
          onChangeFilter('status', e);
        }}
      />
      <SearchInput
        placeholder="Даалгаврын нэрээр хайх..."
        value={filters?.search}
        onChange={(e: string) => {
          onChangeFilter('search', e);
        }}
      />
    </div>
  );
};

export default TaskListToolbar;
