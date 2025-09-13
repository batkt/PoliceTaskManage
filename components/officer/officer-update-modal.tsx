'use client';

import { useForm, Controller, FieldValues } from 'react-hook-form';
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
import { CalendarIcon, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { Branch } from '@/lib/types/branch.types';
import { useUsers } from '@/context/user-context';
import { updateUser } from '@/ssr/actions/user';
import { usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types/user.types';
import { useAuth } from '@/context/auth-context';

interface OfficerUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: User;
}

const schema = z.object({
  workerId: z.string().min(3, 'Алба хаагчийн код оруулна уу'),
  surname: z.string().min(2, 'Овог оруулна уу'),
  givenname: z.string().min(2, 'Нэр оруулна уу'),
  position: z.string().min(3, 'Албан тушаал оруулна уу'),
  rank: z.string().min(3, 'Цол оруулна уу'),
  branchId: z.string().min(4, 'Алба, хэлтэс сонгоно уу'),
  role: z.string().min(4, 'Үүрэг сонгоно уу'),
  joinedDate: z.date({ required_error: 'Элссэн огноо шаардлагатай' }),
});

export function OfficerUpdateModal({
  open,
  data,
  onOpenChange,
}: OfficerUpdateModalProps) {
  const pathname = usePathname();
  const { toast } = useToast();
  const { authUser } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      workerId: data?.workerId || '',
      surname: data?.surname || '',
      givenname: data?.givenname || '',
      position: data?.position || '',
      rank: data?.rank || '',
      branchId: data?.branch?._id || '',
      role: data?.role || 'user',
      joinedDate: data?.joinedDate ? new Date(data.joinedDate) : undefined,
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

  const handleFormSubmit = async (data: FieldValues) => {
    try {
      const { joinedDate, ...other } = data as User;
      const res = await updateUser(
        {
          ...other,
          joinedDate: joinedDate ? format(joinedDate, 'yyyy-MM-dd') : "",
        },
        pathname
      );
      if (res.code === 200) {
        toast({
          variant: 'success',
          title: 'Амжилттай',
          description: `Алба хаагчын мэдээллийг амжилттай хадгаллаа.`,
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
        description: message || 'Алба хаагчын мэдээллийг хадгалах үед алдаа гарлаа. Дахин оролдоно уу.',
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
              <DialogTitle>Алба хаагчын мэдээлэл засах</DialogTitle>
              <DialogDescription>
                Алба хаагчийн мэдээллийг бүрэн гүйцэт бөглөнө үү
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
                    disabled={true}
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
              {isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
