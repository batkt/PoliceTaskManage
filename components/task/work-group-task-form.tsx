'use client';

import type React from 'react';
import { Label } from '@/components/ui/label';
import type { FormComponentProps } from '@/lib/types/task-form.types';

import { Controller } from 'react-hook-form';
import { MultiUserSelect } from '../ui/multi-user-select';
import { UserSelect } from '../ui/user-select';
import { useUsers } from '@/context/user-context';
import { Input } from '../ui/input';

const WorkGroupTaskForm: React.FC<FormComponentProps> = ({ control }) => {
  const { users } = useUsers();

  return (
    <div>
      <div className="grid gap-4 py-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Ажлын хэсгийн нэр оруулна уу',
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="workGroupName">
                    Ажлын хэсгийн нэр{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="workGroupName"
                    className="peer"
                    placeholder="Ажлын хэсгийн нэр"
                    {...field}
                  />
                  {error && (
                    <span className="text-sm font-medium text-destructive">
                      {error.message}
                    </span>
                  )}
                </div>
              );
            }}
          />
        </div>
        <div className="md:col-span-2">
          <Controller
            control={control}
            name="leader"
            rules={{
              required: 'Ажлын хэсгийн ахлах сонгоно уу.',
            }}
            render={({
              field: { value, onChange, name },
              fieldState: { error },
            }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="members">
                    Ажлын хэсгийн ахлах{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <UserSelect
                    // users={users}
                    value={value}
                    onChange={onChange}
                    placeholder="Ажлын хэсгийн ахлах сонгох"
                    error={error}
                    name={name}
                    required
                  />
                </div>
              );
            }}
          />
        </div>
        <div className="md:col-span-2">
          <Controller
            control={control}
            name="members"
            rules={{
              required: 'Гишүүн сонгоно уу.',
            }}
            render={({
              field: { value, onChange, name },
              fieldState: { error },
            }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="members">
                    Гишүүд <span className="text-destructive">*</span>
                  </Label>
                  <MultiUserSelect
                    // users={users}
                    value={value}
                    onChange={onChange}
                    placeholder="Ажлын хэсэгт орох гишүүдийг сонгох"
                    error={error}
                    name={name}
                    required
                  />
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkGroupTaskForm;
