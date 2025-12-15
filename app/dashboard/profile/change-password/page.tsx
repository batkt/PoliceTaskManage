'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Save } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { changePassword } from '@/ssr/actions/auth';
import ProfileLayout from '@/components/profile/layout';
import { useAuth } from '@/context/auth-context';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Одоогийн нууц үгээ оруулна уу.'),
    newPassword: z.string().min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байна'),
    confirmPassword: z.string().min(1, 'Шинэ нууц үгийг давтаж оруулна уу.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Шинэ нууц үг давтан оруулсан нууц үгтэй тохирохгүй байна',
    path: ['confirmPassword'],
  });

type ChangePasswordData = z.infer<typeof schema>;

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  const { accessToken } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(schema),
    defaultValues: {
      confirmPassword: '',
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordData) => {
    try {
      const res = await changePassword(data, accessToken);
      if (res.isOk) {
        toast({
          variant: 'success',
          title: 'Амжилттай',
          description: `Таны нэвтрэх нууц үг амжилттай солигдлоо.`,
        });
        reset();
        return;
      }
      throw new Error(res.message);
    } catch (error) {
      let message = '';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: 'Алдаа гарлаа',
        description:
          message || 'Нууц үг солиход алдаа гарлаа. Дахин оролдоно уу.',
        variant: 'destructive',
      });
    }
  };

  return (
    <ProfileLayout active="change-password">
      <Card>
        <CardHeader>
          <CardTitle>Нууц үг солих</CardTitle>
          <CardDescription>
            Аюулгүй байдлаа сайжруулж нууц үгээ шинэчлээрэй.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <CardContent className="space-y-4">
            <Controller
              name="currentPassword"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Одоогийн нууц үг</Label>
                  <div className="relative">
                    <Input
                      {...field}
                      id="currentPassword"
                      type={showCurrent ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`pr-10 ${error ? 'border-red-500' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? (
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

            <Controller
              name="newPassword"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Шинэ нууц үг</Label>
                  <div className="relative">
                    <Input
                      {...field}
                      id="newPassword"
                      type={showNew ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`pr-10 ${error ? 'border-red-500' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-sm text-red-500">{error.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Нууц үг хамгийн багадаа 8 тэмдэгт агуулсан байх
                  </p>
                </div>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Нууц үг давтах</Label>
                  <div className="relative">
                    <Input
                      {...field}
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`pr-10 ${error ? 'border-red-500' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? (
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
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                'Хүлээгээрэй...'
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Хадгалах
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </ProfileLayout>
  );
};

export default ChangePassword;
