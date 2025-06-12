'use client';

import type React from 'react';

import { useEffect, useMemo, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { CalendarIcon, PlusIcon, TrashIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemRightIndicator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import { createTask } from '@/app/actions/task-actions';
import type { ICreateTaskInput } from '@/lib/types/task.types';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useUsers } from '@/context/user-context';
import { MultiUserSelect } from '../ui/multi-user-select';
import { FileUploader } from '../file-uploader';
import { createTask } from '@/ssr/actions/task';
import { useToast } from '@/hooks/use-toast';
import { UploadedFile } from '@/lib/types/file.types';
import { useAuth } from '@/context/auth-context';
import { FieldTypes, FormTemplate } from '@/lib/types/form.types';
import { Branch } from '@/lib/types/branch.types';
import { UserSelect } from '../ui/user-select';
import { FormField } from '@/lib/types/task-type.types';

type FormInputType = Omit<ICreateTaskInput, 'fileIds'> & {
  files: UploadedFile[];
  formValues: Record<string, string | Date | string[] | undefined>;
};

export function TaskForm({
  type,
  types = [],
  branches = [],
  formTemplateId,
}: {
  type?: string;
  types?: FormTemplate[];
  branches?: Branch[];
  formTemplateId?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { authUser } = useAuth();

  const defaultValues: FormInputType = {
    title: '',
    description: '',
    formTemplateId: formTemplateId || '',
    branchId: authUser?.branch?._id || '',
    assignee: type === 'own' ? authUser?._id || '' : '',
    startDate: new Date(),
    files: [],
    dueDate: undefined,
    priority: 'medium',
    formValues: {},
  };

  const { control, watch, handleSubmit, setValue, reset } =
    useForm<FormInputType>({
      defaultValues: defaultValues,
    });
  const { users } = useUsers();
  const formId = watch('formTemplateId');
  const selectedForm = types.find((t) => t._id === formId);

  useEffect(() => {
    setValue('branchId', authUser?.branch?._id || '');
  }, [authUser]);

  const branchesTree = useMemo(() => {
    const tree: Record<string, Branch[]> = {};
    for (const branch of branches) {
      const parentId = branch.parent || 'root';
      if (!tree[parentId]) tree[parentId] = [];
      tree[parentId].push(branch);
    }
    return tree;
  }, [branches]);

  const rootIds = Object.keys(branchesTree).filter(
    (parentId) =>
      !Object.values(branchesTree)
        .flat()
        .some((b) => b._id === parentId)
  );

  function renderBranchOptions(
    tree: Record<string, Branch[]>,
    parentId: string,
    level = 0
  ): React.ReactNode[] {
    if (!tree[parentId]) return [];

    return tree[parentId].flatMap((branch) => [
      <SelectItemRightIndicator
        key={branch._id}
        value={branch._id}
        style={{ paddingLeft: 8 + level * 16 }}
      >
        {branch.name}
      </SelectItemRightIndicator>,
      ...renderBranchOptions(tree, branch._id, level + 1),
    ]);
  }

  const onSubmit = async (formData: FieldValues) => {
    setIsSubmitting(true);
    const { files, formValues, ...other } = formData as FormInputType;
    try {
      console.log(other, formValues);
      const res = await createTask({
        ...other,
        formValues,
        fileIds: files.map((f) => f._id),
      });

      if (res.code === 200) {
        toast({
          variant: 'success',
          title: 'Амжилттай.',
          description: 'Даалгавар амжилттай үүслээ.',
        });
        reset();
        router.push(
          type === 'own' ? '/dashboard/my-tasks' : '/dashboard/tasks'
        );
      } else {
        throw new Error(res.message || 'Алдаа гарлаа');
      }
    } catch (error) {
      let message = 'Даалгавар үүсгэхэд алдаа гарлаа.';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Амжилтгүй',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectDataUser =
    type === 'own' ? users : users.filter((u) => u._id !== authUser?._id);

  const renderFieldPreview = (field: FormField, formFields: any) => {
    if (
      field.type === FieldTypes.TEXT_INPUT ||
      field.type === FieldTypes.NUMBER_INPUT
    ) {
      return (
        <Input
          placeholder={field.placeholder || 'Текст оруулна уу.'}
          type={field.type}
          {...formFields}
        />
      );
    }
    if (field.type === FieldTypes.TEXTAREA) {
      return (
        <Textarea
          placeholder={field.placeholder || 'Текст бичих...'}
          {...formFields}
        />
      );
    }
    if (field.type === FieldTypes.SELECT) {
      const { value, onChange } = formFields;
      return (
        <Select value={value} onValueChange={(val) => onChange(val)}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || 'Сонгох'} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option: string, index: number) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field.type === FieldTypes.DATE) {
      const { value, onChange } = formFields;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={'outline'}
              className={cn(
                'w-full pl-3 text-left font-normal',
                !value && 'text-muted-foreground'
              )}
            >
              {value ? format(value, 'yyyy-MM-dd') : <span>Огноо сонгох</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(e) => onChange(e)}
              fromDate={new Date()}
            />
          </PopoverContent>
        </Popover>
      );
    }
    if (field.type === FieldTypes.MULTI_USER_SELECT) {
      const { value, onChange } = formFields;
      return (
        <MultiUserSelect
          users={users}
          value={value || []}
          onChange={(e) => onChange(e)}
          placeholder={field.placeholder || 'Алба хаагч сонгоно уу'}
        />
      );
    }
    if (field.type === FieldTypes.USER_SELECT) {
      const { value, onChange } = formFields;
      return (
        <UserSelect
          users={users}
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={field.placeholder || 'Алба хаагч сонгоно уу'}
        />
      );
    }

    return null;
  };

  return (
    <Card className="w-full bg-transparent border-none max-md:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <CardHeader className="max-md:px-0 border-b">
          <CardTitle>Шинээр даалгавал үүсгэх</CardTitle>
          <CardDescription>
            Шаардлагатай мэдээллүүдийг бүрэн гүйцэт оруулж даалгавар үүсгээрэй.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full max-w-2xl mx-auto space-y-6 max-md:p-0 mt-6">
          <Controller
            control={control}
            name="title"
            rules={{
              required: 'Даалгаврын нэр оруулна уу',
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="workName">
                    Даалгаврын нэр <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="workName"
                    className="peer"
                    placeholder="Даалгаврын нэр"
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

          <Controller
            control={control}
            name="description"
            render={({ field, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="description">Тайлбар</Label>
                  <Textarea
                    id="description"
                    placeholder="Тайлбар бичих..."
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

          <Controller
            control={control}
            name="formTemplateId"
            render={({ field: { value, onChange }, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="description">Төрөл</Label>
                  <Select
                    onValueChange={(value) => {
                      reset(defaultValues);
                      onChange(value);
                    }}
                    value={value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Төрөл сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      {types?.map((item) => {
                        return (
                          <SelectItem value={item._id} key={item._id}>
                            <div className="flex items-center">{item.name}</div>
                          </SelectItem>
                        );
                      })}
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
            name="branchId"
            render={({ field: { value, onChange }, fieldState: { error } }) => {
              console.log('branchId ', value);
              return (
                <div className="space-y-2">
                  <Label htmlFor="description">Алба, хэлтэс</Label>
                  <Select
                    onValueChange={(value) => onChange(value)}
                    value={value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Алба, хэлтэс" />
                    </SelectTrigger>
                    <SelectContent>
                      {rootIds.flatMap((rootId) =>
                        renderBranchOptions(branchesTree, rootId)
                      )}
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

          <div className="space-y-2">
            <Controller
              control={control}
              name="assignee"
              rules={{
                required: 'Хариуцах алба хаагч сонгоно уу',
              }}
              render={({
                field: { value, onChange, name },
                fieldState: { error },
              }) => {
                return (
                  <div className="space-y-2">
                    <Label htmlFor="members">
                      Хариуцах алба хаагч{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <UserSelect
                      users={selectDataUser}
                      value={value as string}
                      disabled={type === 'own'}
                      onChange={onChange}
                      placeholder="Хариуцах алба хаагч сонгоно уу"
                      error={error}
                      name={name}
                      required
                    />
                  </div>
                );
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="dueDate"
              rules={{
                required: 'Дуусах огноо сонгоно уу.',
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">
                      Дуусах огноо <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="dueDate"
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

          <Controller
            control={control}
            name="priority"
            rules={{
              required: 'Сонгоно уу.',
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="priority">
                    Яаралтай эсэх <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => onChange(value)}
                    value={value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Эрэмбэ сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          Бага
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          Дунд
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                          Өндөр
                        </div>
                      </SelectItem>
                      {/* <SelectItem value="urgent">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          Urgent
                        </div>
                      </SelectItem> */}
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

          {selectedForm?.fields?.map((item) => {
            return (
              <Controller
                key={item.name}
                control={control}
                name={`formValues.${item.name}`}
                rules={
                  item.required
                    ? {
                        required: 'Утга оруулна уу.',
                      }
                    : {}
                }
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="priority">
                        {item.label}{' '}
                        {item.required ? (
                          <span className="text-destructive">*</span>
                        ) : (
                          ''
                        )}
                      </Label>

                      {renderFieldPreview(item, { value, onChange })}
                      {error && (
                        <span className="text-sm font-medium text-destructive">
                          {error.message}
                        </span>
                      )}
                    </div>
                  );
                }}
              />
            );
          })}

          <div className="space-y-2">
            <Label>Файлууд</Label>
            <Controller
              control={control}
              name="files"
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => {
                return (
                  <FileUploader
                    value={value}
                    onChange={onChange}
                    error={error}
                    isEdit={true}
                  />
                );
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between w-full max-w-2xl mx-auto">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Буцах
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Үүсгэж байна...' : 'Даалгавар үүсгэх'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
