'use client';

import type React from 'react';
import { Label } from '@/components/ui/label';
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
import { Input } from '../ui/input';

const MemoTaskForm: React.FC<FormComponentProps> = ({ control, watch }) => {
  return (
    <div>
      <div className="grid gap-y-4 grid-cols-1">
        <div className="md:col-span-2">
          <Controller
            control={control}
            name="documentNumber"
            rules={{
              required: 'Албан бичгиййн дугаар оруулна уу',
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="documentNumber">
                    Албан бичгиййн дугаар{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="documentNumber"
                    className="peer"
                    placeholder="Албан бичгиййн дугаар"
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
            name="marking"
            rules={{
              required: 'Цохолт оруулна уу.',
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="marking">
                    Цохолт <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="marking"
                    placeholder="Цохолт"
                    rows={3}
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

        <Controller
          control={control}
          name="markingDate"
          rules={{
            required: 'Цохолтын огноо сонгоно уу.',
          }}
          render={({ field, fieldState: { error } }) => {
            return (
              <div className="space-y-2">
                <Label htmlFor="markingDate1">
                  Цохолтын огноо <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="markingDate1"
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

export default MemoTaskForm;
