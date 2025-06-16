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
import { usePathname, useRouter } from 'next/navigation';

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
    name: 'Идэвхтэй',
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
  onChange,
}: {
  status: string;
  data?: { key: string; name: string }[];
  onChange?: (e: string) => void;
}) => {
  return (
    <>
      <div className="flex gap-1 bg-muted rounded-md p-1 w-fit max-lg:hidden">
        {(data || statuses)?.map((s) => {
          return (
            <div
              key={s.key}
              className={cn(
                'rounded-sm px-3 py-1.5 text-sm cursor-pointer',
                status !== s.key ? 'bg-transparent' : 'bg-background'
              )}
              onClick={() => {
                onChange?.(s.key);
              }}
            >
              {s.name}
            </div>
          );
        })}
      </div>
      <div className="lg:hidden flex-1">
        <Select
          value={status}
          onValueChange={(e) => {
            onChange?.(e);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            {(data || statuses)?.map((s) => {
              return (
                <SelectItem key={s.key} value={s.key}>
                  {s.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default Statusbar;
