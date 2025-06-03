import React, { useRef, useState } from 'react';
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ToolbarProps } from '../data-table-v2';
// import { Button } from '../ui/button';

const OfficerListToolbar = ({ filters, onChangeFilter }: ToolbarProps) => {
  const timer = useRef<NodeJS.Timeout>(null);
  const [text, setText] = useState(filters?.givenname || '');

  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Нэрээр хайх..."
        value={text}
        onChange={(event) => {
          const val = event.target.value;
          setText(val);
          if (timer?.current) {
            clearTimeout(timer.current);
          }
          timer.current = setTimeout(() => {
            onChangeFilter('givenname', val);
          }, 700);
        }}
        className="max-w-sm"
      />
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Багана
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              const columnInfo = columnInformations?.find(
                (col) => col.key === column.id
              );
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnInfo?.name}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
};

export default OfficerListToolbar;
