'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Trash2,
  Type,
  Hash,
  FileText,
  List,
  Eye,
  Settings,
  ChevronUp,
  ChevronDown,
  User,
  Users,
  CalendarIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type {
  FieldType,
  CreateFormData,
  CreateFormField,
} from '@/lib/types/task-type.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { UserSelect } from '../ui/user-select';
import { User as UserType } from '@/lib/types/user.types';
import { MultiUserSelect } from '../ui/multi-user-select';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import FormOptionsInput from './form-optoins-input';
import { createForm } from '@/ssr/actions/task';
import { useRouter } from 'next/navigation';

const fieldTypeIcons: Record<FieldType, React.ReactNode> = {
  text: <Type className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  textarea: <FileText className="h-4 w-4" />,
  select: <List className="h-4 w-4" />,
  date: <CalendarIcon className="h-4 w-4" />,
  'user-select': <User className="h-4 w-4" />,
  'multi-user-select': <Users className="h-4 w-4" />,
};

const fieldTypeLabels: Record<FieldType, string> = {
  text: 'Текст оролт',
  number: 'Тоон оролт',
  textarea: 'Текст /олон мөрт/',
  select: 'Сонголт',
  date: 'Огноо сонголт',
  'user-select': 'Алба хаагч сонголт',
  'multi-user-select': 'Алба хаагч сонголт /олноор/',
};

// Group field types by category
const fieldTypes = {
  name: 'Оролтуул',
  types: [
    'text',
    'number',
    'textarea',
    'select',
    'date',
    'user-select',
    'multi-user-select',
  ] as FieldType[],
};
// Mock users for user select fields
const mockUsers: UserType[] = [
  {
    _id: 'user1',
    surname: 'Эрдэнэ',
    givenname: 'Бат',
    rank: 'Ахмад',
    position: 'Мэргэжилтэн',
    workerId: '',
    role: 'user',
  },
  {
    _id: 'user2',
    surname: 'Анхбаяр',
    givenname: 'Хонгор',
    rank: 'Ахмад',
    position: 'Мэргэжилтэн',
    workerId: '',
    role: 'user',
  },
  {
    _id: 'user3',
    surname: 'Цоожил',
    givenname: 'Баяраа',
    rank: 'Ахмад',
    position: 'Мэргэжилтэн',
    workerId: '',
    role: 'user',
  },
  {
    _id: 'user4',
    surname: 'Сарандаваа',
    givenname: 'Болороо',
    rank: 'Ахмад',
    position: 'Мэргэжилтэн',
    workerId: '',
    role: 'user',
  },
  {
    _id: 'user5',
    surname: 'Билгүүн',
    givenname: 'Нямхүү',
    rank: 'Ахмад',
    position: 'Мэргэжилтэн',
    workerId: '',
    role: 'user',
  },
];

export function TaskTypeBuilder() {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<CreateFormData>({
    defaultValues: {
      name: '',
      description: '',
      fields: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'fields',
  });
  const previewFields = watch('fields');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, any>>({});
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const router = useRouter();

  const generateFieldId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateFieldName = (
    type: FieldType,
    existingFields: CreateFormField[]
  ) => {
    const baseNames: Record<FieldType, string> = {
      text: 'text_field',
      number: 'number_field',
      textarea: 'textarea_field',
      select: 'select_field',
      date: 'date_field',
      'user-select': 'user_field',
      'multi-user-select': 'users_field',
    };

    const baseName = baseNames[type];
    const existingNames = existingFields.map((field) => field.name);

    let counter = 1;
    let fieldName = `${baseName}_${counter}`;

    while (existingNames.includes(fieldName)) {
      counter++;
      fieldName = `${baseName}_${counter}`;
    }

    return fieldName;
  };

  const addField = (type: FieldType) => {
    clearErrors('fields');
    const newField: CreateFormField = {
      tempId: generateFieldId(),
      name: generateFieldName(type, previewFields),
      label: fieldTypeLabels[type],
      type,
      required: false,
      showInTable: false,
      placeholder: '',
      options: type === 'select' ? ['Утга 1', 'Утга 2'] : undefined,
    };

    append(newField);

    // Set the new field as active
    setTimeout(() => {
      setActiveFieldId(newField.tempId);
    }, 100);
  };

  const removeField = (fieldId: string, index: number) => {
    remove(index);
    // If the active field is removed, clear the active field
    if (activeFieldId === fieldId) {
      setActiveFieldId(null);
    }
  };

  const moveField = (direction: 'up' | 'down', index: number) => {
    const fromIndex = index;
    let toIndex = direction === 'up' ? index - 1 : index + 1;
    move(fromIndex, toIndex);
  };

  const handlePreviewChange = (fieldId: string, value: any) => {
    setPreviewData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const onSubmit = async (values: CreateFormData) => {
    if (values.fields.length === 0) {
      setError('fields', {
        type: 'manual',
        message: 'Заавал талбар нэмэх шаардлагатай!',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createForm(values);
      if (res.code === 200 && res.data === true) {
        toast({
          variant: 'success',
          title: 'Амжилттай',
          description: `Даалгаврын төрөл амжилттай үүслээ.`,
        });
        router.push('/dashboard/task-type');
        setPreviewData({});
        return;
      }
      throw new Error(res?.message);
    } catch (error) {
      let message = '';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: 'Амжилтгүй',
        description: message || 'Даалгаврын төрөл үүсгэхэд алдаа гарлаа.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldPreview = (field: CreateFormField) => {
    const value = previewData[field.tempId] || '';

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <Input
            placeholder={field.placeholder || field.label}
            type={field.type}
            value={value}
            onChange={(e) => handlePreviewChange(field.tempId, e.target.value)}
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder || field.label}
            value={value}
            onChange={(e) => handlePreviewChange(field.tempId, e.target.value)}
          />
        );
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(val) => handlePreviewChange(field.tempId, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'date':
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
                {value ? (
                  format(value, 'yyyy-MM-dd')
                ) : (
                  <span>Огноо сонгох</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto" align="start">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(e) => handlePreviewChange(field.tempId, e)}
                fromDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        );
      case 'user-select':
        return (
          <UserSelect
            users={mockUsers}
            value={value}
            onChange={(e) => handlePreviewChange(field.tempId, e)}
          />
        );
      case 'multi-user-select':
        return (
          <MultiUserSelect
            users={mockUsers}
            value={value || []}
            onChange={(e) => handlePreviewChange(field.tempId, e)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto py-4">
      {/* Form Header */}
      <div className="mb-8">
        <div className="grid grid-cols-3 mb-4">
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Даалгаврын төрлийн нэр оруулна уу',
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="typeName">
                    Даалгаврын төрлийн нэр{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={'typeName'}
                    placeholder="Даалгаврын төрлийн нэр"
                    autoFocus
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
          name="description"
          render={({ field }) => {
            return (
              <div className="space-y-2">
                <Label htmlFor="desc">Тайлбар</Label>
                <Textarea
                  id="desc"
                  placeholder="Даалгаврын төрлийг үүсгэх болсон зорилго, тайлбар бичиж болно (Заавал биш)"
                  rows={2}
                  className="resize-none"
                  {...field}
                />
              </div>
            );
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Field Types - Column 1 */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Талбарууд</CardTitle>
            <CardDescription>Талбар дээр дарж формд нэмээрэй</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div key={fieldTypes.name} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {fieldTypes.name}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {fieldTypes.types.map((type) => (
                  <TooltipProvider key={type}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addField(type)}
                          className="justify-start w-full pl-2"
                        >
                          <div className="flex items-center w-full">
                            <div className="flex h-8 w-8 items-center justify-center mr-1">
                              {fieldTypeIcons[type]}
                            </div>
                            <span>{fieldTypeLabels[type]}</span>
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{fieldTypeLabels[type]}-г формд нэмэх</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Fields - Column 2 */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Формын талбарууд</CardTitle>
                  <CardDescription>
                    Талбаруудын тохиргоог хийгээрэй
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="config">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="config">Тохиргоо</TabsTrigger>
                  <TabsTrigger value="preview">Харагдац</TabsTrigger>
                </TabsList>
                <TabsContent value="config" className="mt-4">
                  {fields.length === 0 ? (
                    <>
                      <div
                        className={cn(
                          'text-center py-12 border-2 border-dashed rounded-lg',
                          errors.fields ? 'border-destructive' : 'border-border'
                        )}
                      >
                        <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-1">
                          Талбар нэмээгүй байна
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Зүүн талын талбарууд хэсгээс сонгож нэмнэ үү
                        </p>
                      </div>
                      {errors.fields && (
                        <span className="text-sm font-medium text-destructive">
                          {errors.fields.message}
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      {fields.map((field, index) => {
                        const labelValue = watch(`fields.${index}.label`);
                        const requiredValue = watch(`fields.${index}.required`);

                        return (
                          <Collapsible
                            key={field.tempId}
                            open={activeFieldId === field.tempId}
                            onOpenChange={(open) => {
                              if (open) {
                                setActiveFieldId(field.tempId);
                              } else if (activeFieldId === field.tempId) {
                                setActiveFieldId(null);
                              }
                            }}
                          >
                            <Card
                              className={`border ${
                                activeFieldId === field.tempId
                                  ? 'border-primary ring-1 ring-primary'
                                  : 'border-border'
                              }`}
                            >
                              <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-muted/50 p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                                          activeFieldId === field.tempId
                                            ? 'bg-primary/10'
                                            : 'bg-muted'
                                        }`}
                                      >
                                        {fieldTypeIcons[field.type]}
                                      </div>
                                      <div>
                                        <CardTitle className="text-base">
                                          {labelValue}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                          {fieldTypeLabels[field.type]}
                                          {requiredValue && ' • Заавал бөглөнө'}
                                        </CardDescription>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                moveField('up', index);
                                              }}
                                              disabled={index === 0}
                                              className="h-8 w-8 p-0"
                                            >
                                              <ChevronUp className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            Дээш зөөх
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                moveField('down', index);
                                              }}
                                              disabled={
                                                index ===
                                                previewFields.length - 1
                                              }
                                              className="h-8 w-8 p-0"
                                            >
                                              <ChevronDown className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            Доош зөөх
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                removeField(
                                                  field.tempId,
                                                  index
                                                );
                                              }}
                                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            Талбар устгах
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </div>
                                </CardHeader>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <CardContent className="pt-0 px-4 pb-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Controller
                                      control={control}
                                      name={`fields.${index}.label`}
                                      rules={{
                                        required: 'Талбарын нэр оруулна уу',
                                      }}
                                      render={({
                                        field: subField,
                                        fieldState: { error },
                                      }) => {
                                        return (
                                          <div className="space-y-2">
                                            <Label
                                              htmlFor={`inputname_${index}`}
                                            >
                                              Талбарын нэр
                                            </Label>
                                            <Input
                                              id={`inputname_${index}`}
                                              {...subField}
                                              placeholder="Талбарын нэр"
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
                                      name={`fields.${index}.placeholder`}
                                      render={({ field: subField }) => {
                                        return (
                                          <div className="space-y-2">
                                            <Label
                                              htmlFor={`placeholder_${index}`}
                                            >
                                              Хоосон үед харагдах текст
                                            </Label>
                                            <Input
                                              id={`placeholder_${index}`}
                                              {...subField}
                                              placeholder="Текст оруулна уу"
                                            />
                                          </div>
                                        );
                                      }}
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Controller
                                      control={control}
                                      name={`fields.${index}.required`}
                                      render={({
                                        field: { value, onChange },
                                      }) => {
                                        return (
                                          <div className="mt-4 flex items-center space-x-2">
                                            <Switch
                                              checked={value}
                                              onCheckedChange={(checked) =>
                                                onChange(checked)
                                              }
                                              id={`required-${index}`}
                                            />
                                            <Label
                                              htmlFor={`required-${index}`}
                                            >
                                              Заавал бөглөх эсэх
                                            </Label>
                                          </div>
                                        );
                                      }}
                                    />

                                    <Controller
                                      control={control}
                                      name={`fields.${index}.showInTable`}
                                      render={({
                                        field: { value, onChange },
                                      }) => {
                                        return (
                                          <div className="mt-4 flex items-center space-x-2">
                                            <Switch
                                              checked={value}
                                              onCheckedChange={(checked) =>
                                                onChange(checked)
                                              }
                                              id={`required-${index}`}
                                            />
                                            <Label
                                              htmlFor={`required-${index}`}
                                            >
                                              Хүснэгтэд харуулах эсэх
                                            </Label>
                                          </div>
                                        );
                                      }}
                                    />
                                  </div>

                                  {field.type === 'select' && (
                                    <Controller
                                      control={control}
                                      name={`fields.${index}.options`}
                                      render={({
                                        field: { value, onChange },
                                      }) => {
                                        return (
                                          <FormOptionsInput
                                            value={value}
                                            onChange={onChange}
                                          />
                                        );
                                      }}
                                    />
                                  )}
                                </CardContent>
                              </CollapsibleContent>
                            </Card>
                          </Collapsible>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="preview" className="mt-4">
                  <p className="text-xs text-muted-foreground bg-muted px-4 py-2 rounded-sm mb-4">
                    Форм хэрхэн харагдах, ажиллагаа зэргийг шалгах боломжтой.
                  </p>
                  {previewFields.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Хоосон байна</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {previewFields.map((field) => (
                        <div key={field.tempId} className="space-y-2">
                          <Label>
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </Label>
                          {renderFieldPreview(field)}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="w-full flex justify-end mt-4 mb-8">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
        </Button>
      </div>
    </form>
  );
}
