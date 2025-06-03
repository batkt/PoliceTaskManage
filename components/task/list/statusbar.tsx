'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import AddTaskButton from '../add-task-button';
import { useRouter } from 'next/navigation';

const statuses = [
  {
    key: 'all',
    name: 'Бүгд',
  },
  {
    key: 'pending',
    name: 'Эхлээгүй',
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

const Statusbar = ({
  status,
  data,
  hideButton = false,
  me = false,
}: {
  status: string;
  data?: { key: string; name: string }[];
  hideButton?: boolean;
  me?: boolean;
}) => {
  const router = useRouter();
  return (
    <div className="flex justify-between gap-4">
      <div className="flex gap-1 bg-muted rounded-md p-1 max-lg:hidden">
        {(data || statuses)?.map((s) => {
          return (
            <Link key={s.key} href={`/dashboard/my-tasks?status=${s.key}`}>
              <div
                className={cn(
                  'rounded-sm px-3 py-1.5 text-sm',
                  status !== s.key ? 'bg-transparent' : 'bg-background'
                )}
              >
                {s.name}
              </div>
            </Link>
          );
        })}
      </div>
      <div className="lg:hidden flex-1">
        <Select
          value={status}
          onValueChange={(e) => {
            router.push(`/dashboard/my-tasks?status=${e}`);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            {(data || statuses)?.map((s) => {
              return (
                <Link key={s.key} href={`/dashboard/my-tasks?status=${s.key}`}>
                  <SelectItem key={s.key} value={s.key}>
                    {s.name}
                  </SelectItem>
                </Link>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      {hideButton ? null : <AddTaskButton me={me} />}
    </div>
  );
};

export default Statusbar;
