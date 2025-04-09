"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Даалгаврын нэр 3-аас дээш тэмдэгт байх ёстой",
  }),
  status: z.string({
    required_error: "Төлөв сонгоно уу",
  }),
  priority: z.string({
    required_error: "Чухал зэрэг сонгоно уу",
  }),
  assignee: z.string({
    required_error: "Хариуцагч сонгоно уу",
  }),
  startDate: z.date({
    required_error: "Эхлэх огноо сонгоно уу",
  }),
  dueDate: z.date({
    required_error: "Дуусах огноо сонгоно уу",
  }),
  description: z.string().min(5, {
    message: "Тайлбар 5-аас дээш тэмдэгт байх ёстой",
  }),
  department: z.string({
    required_error: "Хэлтэс сонгоно уу",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Sample data for dropdowns
const statusOptions = [
  { value: "pending", label: "Хүлээгдэж буй" },
  { value: "in_progress", label: "Хийгдэж буй" },
  { value: "completed", label: "Дууссан" },
  { value: "overdue", label: "Хоцорсон" },
];

const priorityOptions = [
  { value: "low", label: "Бага" },
  { value: "medium", label: "Дунд" },
  { value: "high", label: "Өндөр" },
];

const assigneeOptions = [
  { value: "Отгонбаяр Б.", label: "Отгонбаяр Б." },
  { value: "Дэлгэрмаа Д.", label: "Дэлгэрмаа Д." },
  { value: "Ганбаатар Б.", label: "Ганбаатар Б." },
  { value: "Энхбаяр Б.", label: "Энхбаяр Б." },
  { value: "Түвшинбаяр С.", label: "Түвшинбаяр С." },
  { value: "Баярсайхан Т.", label: "Баярсайхан Т." },
  { value: "Мөнхбат Д.", label: "Мөнхбат Д." },
  { value: "Баатарсүрэн Б.", label: "Баатарсүрэн Б." },
  { value: "Оюунчимэг Ч.", label: "Оюунчимэг Ч." },
  { value: "Батбаяр Н.", label: "Батбаяр Н." },
];

const departmentOptions = [
  { value: "Хэрэг бүртгэлийн хэлтэс", label: "Хэрэг бүртгэлийн хэлтэс" },
  { value: "Эрүүгийн цагдаагийн хэлтэс", label: "Эрүүгийн цагдаагийн хэлтэс" },
  { value: "Хяналтын хэлтэс", label: "Хяналтын хэлтэс" },
  { value: "Захиргааны хэлтэс", label: "Захиргааны хэлтэс" },
];

interface TaskEditDialogProps {
  children: React.ReactNode;
  task?: {
    id: string;
    title: string;
    status: string;
    priority: string;
    assignee: string;
    startDate?: string;
    dueDate: string;
    description?: string;
    department?: string;
  };
  onTaskUpdated?: (updatedTask: any) => void;
}

export function TaskEditDialog({
  children,
  task,
  onTaskUpdated,
}: TaskEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: task
      ? {
          title: task.title,
          status: task.status,
          priority: task.priority,
          assignee: task.assignee,
          startDate: task.startDate ? new Date(task.startDate) : new Date(),
          dueDate: new Date(task.dueDate),
          description: task.description || "",
          department: task.department || "Хэрэг бүртгэлийн хэлтэс",
        }
      : {
          title: "",
          status: "pending",
          priority: "medium",
          assignee: "",
          startDate: new Date(),
          dueDate: new Date(),
          description: "",
          department: "Хэрэг бүртгэлийн хэлтэс",
        },
  });

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);

      const updatedTask = {
        ...task,
        ...values,
        startDate: values.startDate.toISOString().split("T")[0],
        dueDate: values.dueDate.toISOString().split("T")[0],
      };

      if (onTaskUpdated) {
        onTaskUpdated(updatedTask);
      }

      toast({
        title: task ? "Даалгавар шинэчлэгдлээ" : "Даалгавар үүсгэгдлээ",
        description: task
          ? "Даалгаврын мэдээлэл амжилттай шинэчлэгдлээ."
          : "Шинэ даалгавар амжилттай үүсгэгдлээ.",
      });
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {task ? "Даалгавар засах" : "Шинэ даалгавар"}
          </DialogTitle>
          <DialogDescription>
            {task
              ? "Даалгаврын мэдээллийг шинэчилж, хадгална уу."
              : "Шинэ даалгаврын мэдээллийг оруулж, үүсгэнэ үү."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 py-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Даалгаврын нэр</FormLabel>
                    <FormControl>
                      <Input placeholder="Даалгаврын нэр" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Төлөв</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Төлөв сонгох" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Чухал зэрэг</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Чухал зэрэг сонгох" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                        {departmentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Хариуцагч</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Хариуцагч сонгох" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assigneeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Эхлэх огноо</FormLabel>
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
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дуусах огноо</FormLabel>
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
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Тайлбар</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Даалгаврын тайлбар"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
