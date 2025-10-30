'use client';

import { format } from 'date-fns';
import { ColumnDef, DataTableV2, TableParams } from '../data-table-v2';
import { ColumnHeader } from '../data-table-v2/column-header';
import StatusBadge from '../task/status-badge';
import { TaskReport } from '@/lib/types/task.types';

export function ReportList({
  data = [],
  params,
}: {
  data?: TaskReport[];
  params: TableParams;
}) {
  const columns: ColumnDef<TaskReport>[] = [
    {
      key: 'title',
      header: (props) => (
        <ColumnHeader
          {...props}
          title="Даалгаварын нэр"
          className="max-w-[200px] w-[140px]"
        />
      ),
      renderCell: (row) => (
        <div className="font-medium whitespace-nowrap truncate">
          {row.title}
        </div>
      ),
    },
    {
      key: 'formTemplateId',
      header: (props) => (
        <ColumnHeader
          {...props}
          title="Төрөл"
          className="max-w-[200px] w-[140px]"
        />
      ),
      renderCell: (row) => {
        const formTemplate = row.formTemplate;
        return (
          <div className="font-medium whitespace-nowrap truncate">
            {formTemplate?.name}
          </div>
        );
      },
    },
    {
      key: 'completedDate',
      header: (props) => (
        <div className="flex justify-center">
          <ColumnHeader {...props} title="Дуусгасан огноо" />
        </div>
      ),
      renderCell: (row) => (
        <div className="text-center">
          {format(new Date(row.completedDate), 'yyyy-MM-dd')}
        </div>
      ),
    },
    {
      key: 'reviewedDate',
      header: (props) => (
        <div className="flex justify-center">
          <ColumnHeader {...props} title="Хянасан огноо" />
        </div>
      ),
      renderCell: (row) => (
        <div className="text-center">
          {format(new Date(row.audit.createdAt), 'yyyy-MM-dd')}
        </div>
      ),
    },
    {
      key: 'reviewedBy',
      header: (props) => (
        <div className="flex justify-center">
          <ColumnHeader {...props} title="Хянагч" />
        </div>
      ),
      renderCell: (row) => (
        <div className="text-center">
          {row.audit.checkedBy?.rank} {row.audit.checkedBy?.surname?.[0]}.{row.audit.checkedBy?.givenname}
        </div>
      ),
    },
    {
      key: 'status',
      header: (props) => (
        <div className="flex items-center justify-center">
          <ColumnHeader {...props} title="Төлөв" />
        </div>
      ),

      renderCell: (row) => {
        return (
          <div className="flex justify-center items-center">
            <StatusBadge status={row.status} />
          </div>
        );
      },
    }
  ];

  return (
    <div className="space-y-4">
      <DataTableV2
        columns={columns}
        data={data}
        params={params}
      />
    </div>
  );
}
