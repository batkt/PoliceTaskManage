import React from 'react';

import { ToolbarProps } from '../data-table-v2';
import SearchInput from '../task/search-input';

const BranchListToolbar = ({ filters, onChangeFilter }: ToolbarProps) => {
  return (
    <div className="pb-4 flex justify-end">
      <SearchInput
        placeholder="Хайх..."
        value={filters?.search}
        onChange={(e: string) => {
          onChangeFilter('search', e);
        }}
        className="w-full"
      />
    </div>
  );
};

export default BranchListToolbar;
