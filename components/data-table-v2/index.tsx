'use client';

import { ColumnHeaderProps, SortDirection } from './column-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export type TableParams = {
  page: number;
  pageSize: number;
  sort?: string;
  order?: SortDirection;
  filters: Record<string, string | undefined>;
};

export type ToolbarProps = {
  filters: Record<string, string | undefined>;
  onChangeFilter: (key: string, value: string) => void;
};

export type ColumnDef<T> = {
  key: keyof T;
  header: (data: ColumnHeaderProps<T>) => React.ReactNode;
  renderCell: (row: T) => React.ReactNode;
  enableSort?: boolean;
  enableFilter?: boolean;
  filterRender?: (
    value: string,
    onChange: (val: string) => void
  ) => React.ReactNode;
};

type TableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  toolbar?: React.ReactNode;
  params: TableParams;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortKey: string, direction: SortDirection) => void;
  onFilterChange?: (key: string, value: string) => void;
};

export function DataTableV2<T extends Record<string, any>>({
  columns,
  data,
  toolbar,
  params,
  onSortChange,
  onFilterChange,
}: TableProps<T>) {
  const { sort, order, filters } = params;

  const handleFilterChange = (key: string, value: string) => {
    onFilterChange?.(key, value);
  };

  return (
    <div>
      {toolbar && <div>{toolbar}</div>}

      <div className="flex gap-4 flex-wrap">
        {columns.map((col) =>
          col.enableFilter && col.filterRender ? (
            <div key={String(col.key)} className="flex flex-col text-sm">
              <label className="text-muted-foreground">
                {col.header({
                  colConfig: col,
                  sorting: {
                    sort,
                    order,
                  },
                  onSortChange,
                })}
              </label>
              {col.filterRender(filters[String(col.key)] ?? '', (val) =>
                handleFilterChange(String(col.key), val)
              )}
            </div>
          ) : null
        )}
      </div>

      <div className="overflow-auto rounded border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => {
                return (
                  <TableHead key={String(col.key)} className="p-2 text-left">
                    {col.header({
                      colConfig: col,
                      sorting: {
                        sort,
                        order,
                      },
                      onSortChange,
                    })}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {col.renderCell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
