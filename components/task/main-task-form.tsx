'use client';

import type React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { FormComponentProps } from '@/lib/types/task-form.types';

import { Controller, useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useUsers } from '@/context/user-context';

const jobTypes = [
  {
    value: 'memo',
    label: 'Албан бичиг',
  },
  {
    value: 'work-group',
    label: 'Ажлын хэсэг',
  },
];

const MainTaskForm: React.FC<FormComponentProps> = ({ control, watch }) => {
  const { users } = useUsers();
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Controller
            control={control}
            name="title"
            rules={{
              required: 'Ажлын нэр оруулна уу',
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="workName">
                    Ажлын нэр <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="workName"
                    className="peer"
                    placeholder="Ажлын нэр"
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
            name="description"
            render={({ field, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="description">Ажлын тайлбар</Label>
                  <Textarea
                    id="description"
                    placeholder="Ажлын тайлбар"
                    className="resize-none"
                    rows={4}
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
            name="type"
            rules={{
              required: 'Ажлын төрөл сонгоно уу',
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="workType">
                    Ажлын төрөл <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ажлын төрөл сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

        <Controller
          control={control}
          name="assigner"
          rules={{
            required: 'Ажлын төрөл сонгоно уу',
          }}
          render={({ field, fieldState: { error } }) => {
            return (
              <div className="space-y-2">
                <Label htmlFor="assigner">
                  Хариуцах алба хаагч{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ажилтан сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {`${user.surname} ${user.givenname}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error && (
                  <span className="text-sm font-medium text-destructive">
                    {error.message}
                  </span>
                )}
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="priority"
          rules={{
            required: 'Эрэмбэ сонгоно уу.',
          }}
          render={({ field: { value, onChange } }) => {
            return (
              <div className="space-y-2">
                <Label htmlFor="priority">
                  Эрэмбэ <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) => onChange(value)}
                  value={value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Эрэмбэ сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Бага</SelectItem>
                    <SelectItem value="medium">Дунд</SelectItem>
                    <SelectItem value="high">Яаралтай</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="startDate"
          rules={{
            required: 'Эхлэх огноо сонгоно уу.',
          }}
          render={({ field, fieldState: { error } }) => {
            return (
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Эхлэх огноо <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDate"
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'yyyy-MM-dd')
                      ) : (
                        <span>Огноо сонгох</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      fromDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {error && (
                  <span className="text-sm font-medium text-destructive">
                    {error.message}
                  </span>
                )}
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="endDate"
          rules={{
            required: 'Дуусах огноо сонгоно уу.',
          }}
          render={({ field, fieldState: { error } }) => {
            return (
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  Дуусах огноо <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'yyyy-MM-dd')
                      ) : (
                        <span>Огноо сонгох</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      fromDate={watch('startDate') || new Date()}
                    />
                  </PopoverContent>
                </Popover>
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
    </div>
  );
};

export default MainTaskForm;
