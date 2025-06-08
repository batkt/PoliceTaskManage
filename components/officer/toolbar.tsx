import React from 'react';

import { ToolbarProps } from '../data-table-v2';
import SearchInput from '../task/search-input';

const OfficerListToolbar = ({ filters, onChangeFilter }: ToolbarProps) => {
  return (
    <div className="py-4">
      <SearchInput
        placeholder="Хайх..."
        value={filters?.search}
        onChange={(e: string) => {
          onChangeFilter('search', e);
        }}
        className="w-full md:max-w-[300px]"
      />
    </div>
  );
};

export default OfficerListToolbar;
