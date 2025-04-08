"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Shield, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
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
  password: z.string().min(6, {
    message: "Нууц үг 6-аас дээш тэмдэгт байх ёстой",
  }),
})

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // For demo purposes, always succeed
      toast({
        title: "Амжилттай нэвтэрлээ",
        description: "Системд тавтай морил",
      })

      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-4 flex flex-col items-center justify-center space-y-2 text-center">
        <div className="rounded-full bg-primary/10 p-2">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">ЦЕГ-н Даалгаврын Удирдлагын Систем</h2>
        <p className="text-xs text-muted-foreground">Системд нэвтрэхийн тулд мэдээллээ оруулна уу</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Утас</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="99112233"
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
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                Намайг сана
              </label>
            </div>
            <Button
              variant="link"
              size="sm"
              className="px-0 font-normal text-primary"
              onClick={() => {
                toast({
                  title: "Нууц үг сэргээх",
                  description: "Таны утасны дугаарт нууц үг сэргээх холбоос илгээгдлээ.",
                })
              }}
            >
              Нууц үг мартсан?
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Нэвтрэх...
              </>
            ) : (
              "Нэвтрэх"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

