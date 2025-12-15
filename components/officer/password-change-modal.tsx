import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { changeUserPassword } from '@/ssr/actions/user';
import { useAuth } from '@/context/auth-context';

interface PasswordChangeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void,
    userId?: string,
}

const PasswordChangeModal = ({
    onOpenChange,
    userId,
    open,
}: PasswordChangeModalProps) => {

    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast();
    const { accessToken } = useAuth();
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: {
            password: '',
        },
    })

    const handleFormSubmit = async (values: FieldValues) => {
        try {
            const res = await changeUserPassword(userId!, values.password, accessToken);
            if (res.isOk) {
                toast({
                    title: 'Амжилттай',
                    description: 'Нууц үг амжилттай солигдлоо.',
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
                description: message || 'Нууц үг солиход алдаа гарлаа. Дахин оролдоно уу.',
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
                            <DialogTitle>Нууц үг солих</DialogTitle>
                            <DialogDescription>
                                Алба хаагчийн нууц үг солих
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-6"
                    autoComplete="off"
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div className="space-y-2">
                                <Label>
                                    Нууц үг <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        autoComplete="new-password"
                                        type={showPassword ? 'text' : 'password'}
                                        className={`pr-10 ${error ? 'border-red-500' : ''}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
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

export default PasswordChangeModal