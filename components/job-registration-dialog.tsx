"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Loader2, Mic, MicOff, Play, Square, Trash2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Ажлын нэр 3-аас дээш тэмдэгт байх ёстой",
  }),
  type: z.string({
    required_error: "Ажлын төрлийг сонгоно уу",
  }),
  system: z.string({
    required_error: "Системийг сонгоно уу",
  }),
  assignedTo: z.string({
    required_error: "Ажилтныг сонгоно уу",
  }),
  imageUrl: z
    .string()
    .url({
      message: "Зөв URL оруулна уу",
    })
    .optional()
    .or(z.literal("")),
  isUrgent: z.boolean().default(false),
  startDate: z.date({
    required_error: "Эхлэх огноог сонгоно уу",
  }),
  endDate: z.date({
    required_error: "Дуусах огноог сонгоно уу",
  }),
  description: z.string().min(10, {
    message: "Тайлбар 10-аас дээш тэмдэгт байх ёстой",
  }),
})

type FormValues = z.infer<typeof formSchema>

// Sample data for dropdowns
const jobTypes = [
  { value: "investigation", label: "Мөрдөн байцаалт" },
  { value: "patrol", label: "Эргүүл" },
  { value: "administrative", label: "Захиргааны" },
  { value: "training", label: "Сургалт" },
  { value: "special", label: "Тусгай" },
]

const systems = [
  { value: "criminal", label: "Эрүүгийн хэрэг" },
  { value: "civil", label: "Иргэний хэрэг" },
  { value: "administrative", label: "Захиргааны хэрэг" },
  { value: "traffic", label: "Замын хөдөлгөөн" },
  { value: "other", label: "Бусад" },
]

const employees = [
  { value: "OFF-001", label: "Отгонбаяр Б." },
  { value: "OFF-002", label: "Дэлгэрмаа Д." },
  { value: "OFF-003", label: "Ганбаатар Б." },
  { value: "OFF-004", label: "Энхбаяр Б." },
  { value: "OFF-005", label: "Түвшинбаяр С." },
  { value: "OFF-006", label: "Баярсайхан Т." },
  { value: "OFF-007", label: "Мөнхбат Д." },
  { value: "OFF-008", label: "Баатарсүрэн Б." },
  { value: "OFF-009", label: "Оюунчимэг Ч." },
  { value: "OFF-010", label: "Батбаяр Н." },
]

export function JobRegistrationDialog({
  children,
  editJob = null,
}: {
  children: React.ReactNode
  editJob?: {
    id: string
    title: string
    status: string
    startDate: string
    endDate: string
    assignees: Array<{
      id: string
      name: string
      color: string
    }>
    type?: string
    system?: string
    description?: string
    isUrgent?: boolean
    audioUrl?: string
  } | null
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileSelected, setFileSelected] = useState<File | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editJob?.title || "",
      isUrgent: editJob?.isUrgent || false,
      imageUrl: "",
      description: editJob?.description || "",
      type: editJob?.type || "",
      system: editJob?.system || "",
      assignedTo: editJob?.assignees?.[0]?.id || "",
      startDate: editJob?.startDate ? new Date(editJob.startDate) : undefined,
      endDate: editJob?.endDate ? new Date(editJob.endDate) : undefined,
    },
  })

  // Set form values when editing
  useEffect(() => {
    if (editJob) {
      form.reset({
        title: editJob.title || "",
        isUrgent: editJob.isUrgent || false,
        imageUrl: "",
        description: editJob.description || "",
        type: editJob.type || "",
        system: editJob.system || "",
        assignedTo: editJob.assignees?.[0]?.id || "",
        startDate: editJob.startDate ? new Date(editJob.startDate) : undefined,
        endDate: editJob.endDate ? new Date(editJob.endDate) : undefined,
      })

      // Set audio if available
      if (editJob.audioUrl) {
        setAudioUrl(editJob.audioUrl)
        setRecordingTime(30) // Placeholder duration
      }
    }
  }, [editJob, form])

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioBlob(audioBlob)
        setAudioUrl(audioUrl)
        setIsRecording(false)
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Микрофон ашиглах боломжгүй байна",
        description: "Микрофон ашиглах зөвшөөрөл олгоно уу.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const deleteAudio = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    if (audioRef.current) {
      audioRef.current.src = ""
    }
  }

  // Format recording time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl && !editJob?.audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl, editJob])

  // Handle audio ended event
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setIsPlaying(false)
      }
    }
  }, [audioUrl])

  function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    // Create FormData to include audio
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString())
      } else {
        formData.append(key, String(value))
      }
    })

    if (audioBlob) {
      formData.append("audio", audioBlob, "recording.wav")
    }

    if (fileSelected) {
      formData.append("file", fileSelected)
    }

    // Add job ID if editing
    if (editJob?.id) {
      formData.append("id", editJob.id)
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setOpen(false)

      toast({
        title: editJob ? "Ажил амжилттай шинэчлэгдлээ" : "Ажил амжилттай бүртгэгдлээ",
        description: editJob
          ? "Ажил амжилттай шинэчлэгдэж, ажлын хяналт хэсэгт шинэчлэгдлээ."
          : "Ажил амжилттай бүртгэгдэж, ажлын хяналт хэсэгт нэмэгдлээ.",
      })

      // Reset form
      form.reset()
      setFileSelected(null)
      setAudioBlob(null)
      setAudioUrl(null)
      setRecordingTime(0)

      // Redirect to jobs page
      router.push("/dashboard/jobs?status=planned")
      router.refresh()
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0])
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[600px] overflow-hidden p-0 sm:p-6">
        <DialogHeader className="p-6 pb-2 sm:p-0">
          <DialogTitle>{editJob ? "Ажил засах" : "Ажил бүртгэх"}</DialogTitle>
          <DialogDescription>
            {editJob ? "Ажлын мэдээллийг шинэчилж, хадгална уу." : "Шинэ ажлын мэдээллийг бөглөж, бүртгэнэ үү."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] md:max-h-[70vh] px-6 sm:px-0">
          <div className="p-6 pt-2 sm:p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 py-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Ажлын нэр</FormLabel>
                        <FormControl>
                          <Input placeholder="Ажлын нэр" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ажлын төрөл</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Ажлын төрөл сонгох" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
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
                    name="system"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Систем</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Систем сонгох" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {systems.map((system) => (
                              <SelectItem key={system.value} value={system.value}>
                                {system.label}
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
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ажилтан</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Ажилтан сонгох" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.value} value={employee.value}>
                                {employee.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label htmlFor="file">Файл хавсаргах</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input id="file" type="file" onChange={handleFileChange} className="cursor-pointer" />
                    </div>
                    {fileSelected && (
                      <p className="mt-1 text-xs text-muted-foreground truncate">Сонгосон файл: {fileSelected.name}</p>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Зургийн URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <Label>Дуу бичлэг</Label>
                    <div className="mt-2 rounded-md border p-3">
                      {audioUrl ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <audio ref={audioRef} src={audioUrl} className="hidden" />
                              {isPlaying ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={stopAudio}
                                >
                                  <Square className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={playAudio}
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                              <span className="text-sm">Бичлэгийн хугацаа: {formatTime(recordingTime)}</span>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={deleteAudio}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isRecording ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                                  onClick={stopRecording}
                                >
                                  <MicOff className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={startRecording}
                                >
                                  <Mic className="h-4 w-4" />
                                </Button>
                              )}
                              <span className="text-sm">
                                {isRecording ? `Бичиж байна: ${formatTime(recordingTime)}` : "Дуу бичлэг хийх"}
                              </span>
                            </div>
                          </div>
                          {isRecording && <Progress value={(recordingTime % 60) * (100 / 60)} className="h-2" />}
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="isUrgent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Яаралтай эсэх</FormLabel>
                          <FormDescription>Энэ ажил яаралтай эсэхийг тодорхойлно</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
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
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "yyyy-MM-dd") : <span>Огноо сонгох</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
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
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "yyyy-MM-dd") : <span>Огноо сонгох</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
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
                          <Textarea placeholder="Ажлын тайлбар" className="resize-none" rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col gap-2 p-6 sm:flex-row sm:p-0">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Хаах
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className="w-full sm:w-auto"
          >
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
      </DialogContent>
    </Dialog>
  )
}

