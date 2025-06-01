'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import MainTaskForm from './main-task-form';
import { TaskFormData } from '@/lib/types/task-form.types';
import { useForm } from 'react-hook-form';
import MemoTaskForm from './memo-task-form';
import WorkGroupTaskForm from './work-group-task-form';
import { Button } from '../ui/button';
import { LucideLoader2 } from 'lucide-react';
import {
  CreateMemoTaskType,
  CreateWorkGroupTaskType,
} from '@/lib/types/task.types';
import { useToast } from '../ui/use-toast';
import { createMemoTask, createWorkGroupTask } from '@/ssr/actions/task';
import { usePathname } from 'next/navigation';

const CreateTaskDialog = ({
  isEdit = false,
  open = false,
  onHide = () => {},
}: {
  isEdit?: boolean;
  onHide: () => void;
  open: boolean;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const pathname = usePathname();

  const { register, control, setValue, watch, handleSubmit, reset } =
    useForm<TaskFormData>({
      // resolver: zodResolver(formSchema),
      defaultValues: {
        title: '',
        description: '',
        type: 'memo',
        assigner: '',
        startDate: undefined,
        endDate: undefined,
        priority: 'medium',
        // Memo
        marking: '',
        markingVoiceUrl: '',
        markingDate: undefined,
        documentNumber: '',
        // WorkGroup
        name: '',
        leader: '',
        members: [],
      },
    });

  const handleHide = () => {
    onHide();
  };

  const onSubmit = async (values: TaskFormData) => {
    try {
      setIsSubmitting(true);
      const cleanedData: any = {
        title: values.title,
        description: values.description,
        type: values.type,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
        priority: values.priority,
        assigner: values.assigner,
      };

      let requestResponse = {
        title: 'Даалгавар',
        description: '',
      };
      // Add type-specific values
      if (values.type === 'memo') {
        cleanedData.marking = values.marking;
        cleanedData.markingVoiceUrl = values.markingVoiceUrl;
        cleanedData.markingDate = values.markingDate?.toISOString();
        cleanedData.documentNumber = values.documentNumber;
        requestResponse = await createMemoTaskSubmit(cleanedData);
      } else if (values.type === 'work-group') {
        cleanedData.name = values.name;
        cleanedData.leader = values.leader;
        cleanedData.members = values.members;
        requestResponse = await createWorkGroupTaskSubmit(cleanedData);
      }

      console.log('Merged Form Data:', cleanedData);
      toast(requestResponse);

      handleHide();
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createMemoTaskSubmit = async (data: CreateMemoTaskType) => {
    const res = await createMemoTask(data, pathname);

    if (res.code === 200) {
      return {
        title: 'Амжилттай',
        description: 'Албан бичгийн даалгавар амжилттай үүслээ.',
      };
    }

    return {
      title: 'Амжилтгүй',
      description: 'Албан бичгийн даалгавар үүсгэхэд алдаа гарлаа.',
      variant: 'destructive',
    };
  };

  const createWorkGroupTaskSubmit = async (data: CreateWorkGroupTaskType) => {
    const res = await createWorkGroupTask(data, pathname);

    if (res.code === 200) {
      return {
        title: 'Амжилттай',
        description: 'Ажлын хэсэг даалгавар амжилттай үүслээ.',
      };
    }
    return {
      title: 'Амжилтгүй',
      description: 'Ажлын хэсэг даалгавар үүсгэхэд алдаа гарлаа.',
      variant: 'destructive',
    };
  };

  const selectedType = watch('type');

  const renderSubForm = () => {
    switch (selectedType) {
      case 'memo':
        return <MemoTaskForm control={control} />;
      case 'work-group':
        return <WorkGroupTaskForm watch={watch} control={control} />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        if (e === false) onHide();
      }}
    >
      <DialogContent className="w-[95vw] max-w-[600px] p-4">
        <DialogHeader className="p-2">
          <DialogTitle>{isEdit ? 'Ажил засах' : 'Ажил бүртгэх'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Ажлын мэдээллийг шинэчилж, хадгална уу.'
              : 'Шинэ ажлын мэдээллийг бөглөж, бүртгэнэ үү.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] md:max-h-[70vh] pt-0">
          <div className="space-y-4 m-2">
            <MainTaskForm control={control} watch={watch} />
            {renderSubForm()}
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-col gap-2 px-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleHide}
            className="w-full sm:w-auto"
          >
            Хаах
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Хадгалж байна...
              </>
            ) : (
              'Хадгалах'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
