'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemRightIndicator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Eye, EyeOff, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OfficerRegistrationData } from '@/lib/types/officer.types';
import { useMemo, useState } from 'react';
import { Branch } from '@/lib/types/branch.types';
import { useUsers } from '@/context/user-context';
import { registerUser } from '@/ssr/actions/user';
import { usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

interface OfficerRegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const schema = z.object({
  workerId: z.string().min(1, 'Алба хаагчийн код оруулна уу'),
  surname: z.string().min(1, 'Овог оруулна уу'),
  givenname: z.string().min(1, 'Нэр оруулна уу'),
  position: z.string().min(1, 'Албан тушаал оруулна уу'),
  rank: z.string().min(1, 'Цол оруулна уу'),
  branchId: z.string().min(1, 'Алба, хэлтэс сонгоно уу'),
  role: z.enum(['user', 'admin', 'manager']),
  password: z.string().min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байна'),
  joinedDate: z.date({ required_error: 'Элссэн огноо шаардлагатай' }),
});

export function OfficerRegisterModal({
  open,
  onOpenChange,
}: OfficerRegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const pathname = usePathname();
  const { authUser, accessToken } = useAuth();
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<OfficerRegistrationData>({
    resolver: zodResolver(schema),
    defaultValues: {
      workerId: '',
      surname: '',
      givenname: '',
      position: '',
      rank: '',
      branchId: '',
      role: 'user',
      password: '',
      joinedDate: new Date(),
    },
  });

  const { branches } = useUsers();

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

  const handleFormSubmit = async (data: OfficerRegistrationData) => {
    try {
      const { joinedDate, ...other } = data;
      const res = await registerUser(
        {
          ...other,
          joinedDate: format(joinedDate, 'yyyy-MM-dd'),
        },
        pathname,
        accessToken
      );
      if (res.isOk) {
        toast({
          variant: 'success',
          title: 'Амжилттай',
          description: `Алба хаагч амжилттай бүртгэгдлээ.`,
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
        description: message || 'Бүртгэх үед алдаа гарлаа. Дахин оролдоно уу.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  const getRoles = () => {
    if (authUser?.role === 'super-admin') {
      return [
        { label: 'Хэрэглэгч', value: 'user' },
        { label: 'Админ', value: 'admin' },
        { label: 'Cупер админ', value: 'super-admin' },
      ];
    }
    if (authUser?.role === 'admin') {
      return [
        { label: 'Хэрэглэгч', value: 'user' },
        { label: 'Админ', value: 'admin' },
      ];
    }
    return [{ label: 'Хэрэглэгч', value: 'user' }];
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl p-6 max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Алба хаагч бүртгэх</DialogTitle>
              <DialogDescription>
                Шинэ алба хаагчийн мэдээллийг бөглөнө үү
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6"
          autoComplete="off"
        >
          <div className="space-y-4">
            <Controller
              name="workerId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                  <Label>
                    Алба хаагчийн код <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...field}
                    autoComplete="off"
                    className={error && 'border-red-500'}
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                  <Label>
                    Үүрэг <span className="text-red-500">*</span>
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        getRoles().map((role) => (
                          <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  {error && (
                    <p className="text-sm text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['surname', 'givenname'].map((fieldName) => (
                <Controller
                  key={fieldName}
                  name={fieldName as 'surname' | 'givenname'}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div className="space-y-2">
                      <Label>
                        {fieldName === 'surname' ? 'Овог' : 'Нэр'}{' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...field}
                        autoComplete="off"
                        className={error && 'border-red-500'}
                      />
                      {error && (
                        <p className="text-sm text-red-500">{error.message}</p>
                      )}
                    </div>
                  )}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['position', 'rank'].map((fieldName) => (
                <Controller
                  key={fieldName}
                  name={fieldName as 'position' | 'rank'}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div className="space-y-2">
                      <Label>
                        {fieldName === 'position' ? 'Албан тушаал' : 'Цол'}{' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...field}
                        autoComplete="off"
                        className={error && 'border-red-500'}
                      />
                      {error && (
                        <p className="text-sm text-red-500">{error.message}</p>
                      )}
                    </div>
                  )}
                />
              ))}
            </div>

            <Controller
              name="branchId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                  <Label>
                    Алба, хэлтэс <span className="text-red-500">*</span>
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={error && 'border-red-500'}>
                      <SelectValue placeholder="Сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      {rootIds.flatMap((rootId) =>
                        renderBranchOptions(branchesTree, rootId)
                      )}
                    </SelectContent>
                  </Select>
                  {error && (
                    <p className="text-sm text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />

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

            <Controller
              name="joinedDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                  <Label>
                    Элссэн огноо <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                          error && 'border-red-500'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, 'yyyy-MM-dd')
                          : 'Огноо сонгох'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {error && (
                    <p className="text-sm text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <DialogFooter className="w-full !flex !items-center !justify-between">
            <Button type="button" variant="outline" onClick={handleClose}>
              Болих
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Бүртгэж байна...' : 'Бүртгэх'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
