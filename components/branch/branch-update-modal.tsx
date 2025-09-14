import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { UserPlus } from 'lucide-react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateBranch } from '@/ssr/actions/branch';
import { Branch } from '@/lib/types/branch.types';

interface BranchUpdateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void,
    data?: Branch,
}

const BranchUpdateModal = ({
    onOpenChange,
    data,
    open,
}: BranchUpdateModalProps) => {

    const { toast } = useToast();
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: {
            name: data?.name,
        },
    })

    const handleFormSubmit = async (values: FieldValues) => {
        try {
            const res = await updateBranch({
                _id: data?._id,
                name: values.name,
            }, '/branches'
            );
            if (res.code === 200) {
                toast({
                    title: 'Амжилттай',
                    description: 'Алба хэлтэс амжилттай засварлагдлаа.',
                    variant: 'success',
                });
                onOpenChange(false);
                reset();
                return;
            }
            throw new Error(res.message);
        } catch (error) {
            let message = '';
            if (error instanceof Error) {
                message = error?.message;
            }
            toast({
                title: 'Алдаа гарлаа',
                description: message || 'Алба, хэлтэс засварлахад алдаа гарлаа. Дахин оролдоно уу.',
                variant: 'destructive',
            });
        }
    }

    const handleClose = () => {
        onOpenChange(false);
        reset();
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg p-6 max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle>Алба, хэлтэс засах</DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-6"
                    autoComplete="off"
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div className="space-y-2">
                                <Label>
                                    Алба, хэлтэс нэр <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    {...field}
                                    type='text'
                                    className={`pr-10 ${error ? 'border-red-500' : ''}`}
                                />
                                {error && (
                                    <p className="text-sm text-red-500">{error.message}</p>
                                )}
                            </div>
                        )}
                    />

                    <DialogFooter className="w-full !flex !items-center !justify-between">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Болих
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default BranchUpdateModal