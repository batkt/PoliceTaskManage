'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

const formSchema = z.object({
  workerId: z
    .string()
    .min(5, {
      message: 'Ажилтны дугаар 5-аас дээш тэмдэгт байх ёстой',
    })
    .max(12, {
      message: 'Ажилтны дугаар 12-оос бага тэмдэгт байх ёстой',
    }),
  // .regex(/^[0-9]+$/, {
  //   message: 'Ажилтны дугаар зөвхөн тоо байх ёстой',
  // }),
  password: z.string().min(3, {
    message: 'Нууц үг 6-аас дээш тэмдэгт байх ёстой',
  }),
});

export function LoginForm() {
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workerId: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const res = await login(values);

      if (res?.code !== 200) {
        toast({
          title: 'Алдаа гарлаа',
          variant: 'destructive',
          description: res?.message,
        });
        return;
      }

      toast({
        title: 'Амжилттай нэвтэрлээ',
        variant: 'success',
        description: 'Системд тавтай морил',
      });

      router.replace('/dashboard');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-4 flex flex-col items-center justify-center space-y-2 text-center">
        <div className="rounded-full bg-primary/10 p-2">
          <img
            src="/tsagda.png"
            alt="Logo"
            className="h-16 w-16 object-contain"
          />
        </div>
        <h2 className="text-xl font-semibold">Ажил гүйцэтгэлийн систем</h2>
        <p className="text-xs text-muted-foreground">
          Системд нэвтрэхийн тулд мэдээллээ оруулна уу
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="workerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Хувийн дугаар</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345"
                    {...field}
                    className="bg-background/50 dark:bg-background/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Нууц үг</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="******"
                    {...field}
                    className="bg-background/50 dark:bg-background/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground"
              >
                Намайг сана
              </label>
            </div>
            <Button
              variant="link"
              size="sm"
              className="px-0 font-normal text-primary"
              onClick={() => {
                toast({
                  title: 'Нууц үг сэргээх',
                  description:
                    'Таны утасны дугаарт нууц үг сэргээх холбоос илгээгдлээ.',
                });
              }}
            >
              Нууц үг мартсан?
            </Button>
          </div>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Нэвтрэх...
              </>
            ) : (
              'Нэвтрэх'
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}
