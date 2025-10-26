import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { createAudit } from '@/ssr/actions/audit';
import { useToast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';
import { Input } from '../ui/input';

interface AuditModalProps {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuditModal = ({ taskId, open, onOpenChange }: AuditModalProps) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { toast } = useToast();
  const { handleSubmit, control, watch, reset } = useForm({
    defaultValues: {
      isApproved: 'approved',
      comments: '',
      point: '',
    },
  });

  const onSubmit = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await createAudit(
        {
          taskId,
          result: values.isApproved,
          point: values.point,
          comments: values.comments,
        },
        pathname
      );
      if (res.code === 200) {
        reset();
        toast({
          variant: 'success',
          title: 'Амжилттай',
          description: 'Даалгаврт амжилттай хяналт хийлээ',
        });
        onOpenChange(false);
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
        description: message || 'Хяналтын мэдээлэл хадгалахад гарлаа',
      });
    } finally {
      setLoading(false);
    }
  };

  const isApproved = watch('isApproved');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2 text-start">
            Даалгавар хянах
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="isApproved"
            rules={{
              required: 'Шийдвэр сонгоно уу',
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label>Шиидвэр</Label>
                  <Select
                    onValueChange={(value) => onChange(value)}
                    value={value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Шиидвэр" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rejected">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          Буцаах
                        </div>
                      </SelectItem>
                      <SelectItem value="approved">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          Зөвшөөрөх
                        </div>
                      </SelectItem>
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

          {
            isApproved === 'approved' ? (<Controller
              control={control}
              name="point"
              render={({ field, fieldState: { error } }) => {
                return (
                  <div className="space-y-2">
                    <Label htmlFor="point">
                      Үнэлгээний оноо
                    </Label>
                    <Input
                      id="point"
                      placeholder={
                        "Үнэлгээний оноо"
                      }
                      className="resize-none"
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
            />) : null
          }


          <Controller
            control={control}
            name="comments"
            render={({ field, fieldState: { error } }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {isApproved === 'approved'
                      ? 'Сэтгэгдэл / Тайлбар'
                      : 'Шалтгаан'}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={
                      isApproved === 'approved'
                        ? 'Тайлбар бичих...'
                        : 'Шалтгаан бичих'
                    }
                    className="resize-none"
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

          <div className="w-full flex justify-end">
            <Button disabled={loading}>Хадгалах</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuditModal;
