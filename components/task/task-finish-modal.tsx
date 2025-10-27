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
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';
import { changeStatusAction } from '@/ssr/actions/task';
import { TaskStatus } from '@/lib/types/task.types';

interface TaskFinishModalProps {
    taskId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TaskFinishModal = ({ taskId, open, onOpenChange }: TaskFinishModalProps) => {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const { toast } = useToast();
    const { handleSubmit, control } = useForm({
        defaultValues: {
            summary: '',
        },
    });

    const onSubmit = async (values: FieldValues) => {
        setLoading(true);
        try {
            const res = await changeStatusAction({
                status: TaskStatus.COMPLETED,
                taskId,
                summary: values.summary,
            }, pathname);

            if (res.code === 200) {
                toast({
                    variant: 'success',
                    title: 'Амжилттай.',
                    description: 'Төлөвлөгөөг амжилттай гүйцэтгэж дууслаа',
                });
                onOpenChange(false)
                return;
            }

            throw new Error(res.message || 'Системийн алдаа');
        } catch (err) {
            let message = '';
            if (err instanceof Error) {
                message = err.message;
            }
            toast({
                variant: 'destructive',
                title: 'Амжилтгүй',
                description: message || 'Төлөвлөгөөний мэдээлэл хадгалахад алдаа гарлаа',
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
                        Даалгавар дуусгах
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <Controller
                        control={control}
                        name="summary"
                        rules={{
                            required: "Дүгнэлт оруулна уу?"
                        }}
                        render={({ field, fieldState: { error } }) => {
                            return (
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Дүгнэлт /Биелэлт/
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder={
                                            'Дүгнэлт бичих'
                                        }
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
                        <Button disabled={loading}>Дуусгах</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TaskFinishModal;
