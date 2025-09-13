"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Нэр 2-оос дээш тэмдэгт байх ёстой",
  }),
  lastName: z.string().min(1, {
    message: "Овог 1-ээс дээш тэмдэгт байх ёстой",
  }),
  rank: z.string({
    required_error: "Цолыг сонгоно уу",
  }),
  department: z.string({
    required_error: "Хэлтсийг сонгоно уу",
  }),
  position: z.string({
    required_error: "Албан тушаалыг сонгоно уу",
  }),
  phone: z
    .string()
    .min(8, {
      message: "Утасны дугаар 8-аас дээш тэмдэгт байх ёстой",
    })
    .max(12, {
      message: "Утасны дугаар 12-оос бага тэмдэгт байх ёстой",
    })
    .regex(/^[0-9]+$/, {
      message: "Утасны дугаар зөвхөн тоо байх ёстой",
    }),
  email: z
    .string()
    .email({
      message: "Зөв имэйл хаяг оруулна уу",
    })
    .optional()
    .or(z.literal("")),
  gender: z.enum(["male", "female"], {
    required_error: "Хүйсийг сонгоно уу",
  }),
  birthDate: z.date({
    required_error: "Төрсөн огноог сонгоно уу",
  }),
  joinDate: z.date({
    required_error: "Ажилд орсон огноог сонгоно уу",
  }),
  address: z.string().min(5, {
    message: "Хаяг 5-аас дээш тэмдэгт байх ёстой",
  }),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Sample data for dropdowns
const ranks = [
  { value: "ахлагч", label: "Ахлагч" },
  { value: "ахлах-ахлагч", label: "Ахлах ахлагч" },
  { value: "дэд-ахлагч", label: "Дэд ахлагч" },
  { value: "ахмад", label: "Ахмад" },
  { value: "хошууч", label: "Хошууч" },
  { value: "дэд-хурандаа", label: "Дэд хурандаа" },
  { value: "хурандаа", label: "Хурандаа" },
];

const departments = [
  { value: "хэрэг-бүртгэлийн-хэлтэс", label: "Хэрэг бүртгэлийн хэлтэс" },
  { value: "эрүүгийн-цагдаагийн-хэлтэс", label: "Эрүүгийн цагдаагийн хэлтэс" },
  { value: "хяналтын-хэлтэс", label: "Хяналтын хэлтэс" },
  { value: "захиргааны-хэлтэс", label: "Захиргааны хэлтэс" },
];

const positions = [
  { value: "мөрдөгч", label: "Мөрдөгч" },
  { value: "ахлах-мөрдөгч", label: "Ахлах мөрдөгч" },
  { value: "хэсгийн-төлөөлөгч", label: "Хэсгийн төлөөлөгч" },
  { value: "хэлтсийн-дарга", label: "Хэлтсийн дарга" },
  { value: "газрын-дарга", label: "Газрын дарга" },
];

export function OfficerRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      bio: "",
    },
  });

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    // Create FormData to include photo
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    });

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);

      toast({
        title: "Ажилтан амжилттай бүртгэгдлээ",
        description:
          "Ажилтан амжилттай бүртгэгдэж, ажилтны жагсаалтад нэмэгдлээ.",
      });

      // Reset form
      form.reset();
      setPhotoPreview(null);

      // Redirect to officers page
      router.push("/dashboard/officers");
      router.refresh();
    }, 1500);
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-primary/20">
                {photoPreview ? (
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-auto cursor-pointer"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Зураг оруулах (заавал биш)
                </p>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Овог</FormLabel>
                <FormControl>
                  <Input placeholder="Овог" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Нэр</FormLabel>
                <FormControl>
                  <Input placeholder="Нэр" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Хүйс</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <label
                        htmlFor="male"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Эрэгтэй
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <label
                        htmlFor="female"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Эмэгтэй
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Төрсөн огноо</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "yyyy-MM-dd")
                        ) : (
                          <span>Огноо сонгох</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цол</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Цол сонгох" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ranks.map((rank) => (
                      <SelectItem key={rank.value} value={rank.value}>
                        {rank.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Хэлтэс</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Хэлтэс сонгох" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem
                        key={department.value}
                        value={department.value}
                      >
                        {department.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Албан тушаал</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Албан тушаал сонгох" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.value} value={position.value}>
                        {position.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="joinDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ажилд орсон огноо</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "yyyy-MM-dd")
                        ) : (
                          <span>Огноо сонгох</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Утасны дугаар</FormLabel>
                <FormControl>
                  <Input placeholder="99887766" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имэйл хаяг</FormLabel>
                <FormControl>
                  <Input placeholder="example@police.gov.mn" {...field} />
                </FormControl>
                <FormDescription>Заавал биш</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Гэрийн хаяг</FormLabel>
                <FormControl>
                  <Input placeholder="Гэрийн хаяг" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Товч танилцуулга</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Товч танилцуулга"
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Заавал биш</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/officers")}
          >
            Цуцлах
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Хадгалж байна...
              </>
            ) : (
              "Хадгалах"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
