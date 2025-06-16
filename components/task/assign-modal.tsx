import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { UserSelect } from '../ui/user-select';
import { useUsers } from '@/context/user-context';
import { User } from '@/lib/types/user.types';
import { assignTask } from '@/ssr/actions/task';

interface AssignModalProps {
  taskId: string;
  currentUser: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssignModal = ({
  taskId,
  currentUser,
  open,
  onOpenChange,
}: AssignModalProps) => {
  const [loading, setLoading] = useState(false);
  const { users } = useUsers();
  const router = useRouter();
  const { toast } = useToast();
  const {
    handleSubmit,
    control,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      assignee: currentUser._id,
    },
  });

  const onSubmit = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await assignTask({
        taskId,
        assignTo: values.assignee,
      });
      if (res.code === 200) {
        toast({
          variant: 'success',
          title: 'Амжилттай',
          description: 'Даалгаврыг амжилттай хуваариллаа.',
        });
        onOpenChange(false);
        router.push('/dashboard/my-tasks');
        return;
      }
      throw new Error(res?.message);
    } catch (err) {
      let message = '';
      if (err instanceof Error) {
        message = err.message;
      }
      toast({
        variant: 'destructive',
        title: 'Амжилтгүй',
        description: message || 'Даалгавар хуваарилахад алдаа гарлаа',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2 text-start">
            Хариуцах алба хаагч хуваарилах
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  <Label htmlFor="members">Хариуцах алба хаагч</Label>
                  <UserSelect
                    users={users}
                    value={value as string}
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

          <div className="w-full flex justify-end">
            <Button disabled={loading || !isDirty}>Хуваарилах</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignModal;
