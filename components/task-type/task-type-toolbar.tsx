'use client';

import { ToolbarProps } from '@/components/data-table-v2';
import React from 'react';
import SearchInput from '../task/search-input';

const TaskTypeToolbar = ({ filters, onChangeFilter }: ToolbarProps) => {
  return (
    <div className="flex justify-end gap-4 mb-4">
      <SearchInput
        placeholder="Даалгаврын төрлийн нэрээр хайх..."
        value={filters?.search}
        onChange={(e: string) => {
          onChangeFilter('name', e);
        }}
      />
    </div>
  );
};

export default TaskTypeToolbar;
