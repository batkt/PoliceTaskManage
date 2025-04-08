"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Хэрэглэгчийн нэр 2-оос дээш тэмдэгт байх ёстой",
    })
    .max(30, {
      message: "Хэрэглэгчийн нэр 30-аас бага тэмдэгт байх ёстой",
    }),
  email: z
    .string()
    .min(2, {
      message: "Имэйл 2-оос дээш тэмдэгт байх ёстой",
    })
    .email("Зөв имэйл хаяг оруулна уу"),
  bio: z.string().max(160).min(4),
  urls: z
    .object({
      twitter: z.string().url({ message: "Зөв URL оруулна уу" }).optional(),
      github: z.string().url({ message: "Зөв URL оруулна уу" }).optional(),
      facebook: z.string().url({ message: "Зөв URL оруулна уу" }).optional(),
    })
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  username: "batbold",
  email: "batbold@police.gov.mn",
  bio: "Цагдаагийн ерөнхий газрын хэрэг бүртгэлийн хэлтсийн дарга",
  urls: {
    twitter: "https://twitter.com/batbold",
    github: "https://github.com/batbold",
    facebook: "https://facebook.com/batbold",
  },
}

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Профайл шинэчлэгдлээ",
      description: "Таны профайл амжилттай шинэчлэгдлээ.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Хэрэглэгчийн нэр</FormLabel>
              <FormControl>
                <Input placeholder="Хэрэглэгчийн нэр" {...field} />
              </FormControl>
              <FormDescription>Энэ нь таны нэвтрэх нэр юм. Та үүнийг хэзээ ч өөрчилж болно.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имэйл</FormLabel>
              <FormControl>
                <Input placeholder="Имэйл" {...field} />
              </FormControl>
              <FormDescription>Таны имэйл хаяг. Энэ нь мэдэгдэл хүлээн авахад ашиглагдана.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Танилцуулга</FormLabel>
              <FormControl>
                <Textarea placeholder="Өөрийн тухай товч танилцуулга" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>Та өөрийн тухай товч танилцуулга бичнэ үү.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <h3 className="mb-4 text-lg font-medium">Сошиал холбоосууд</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="urls.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input placeholder="https://twitter.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="urls.github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="urls.facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">Хадгалах</Button>
      </form>
    </Form>
  )
}

