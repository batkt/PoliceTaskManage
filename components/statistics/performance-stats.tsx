"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText } from "lucide-react"

// Officer performance data
const data = [
  {
    id: "OFF-001",
    name: "Отгонбаяр Б.",
    completed: 18,
    inProgress: 3,
    overdue: 1,
    department: "Хэрэг бүртгэлийн хэлтэс",
    position: "Ахлах мөрдөгч",
    efficiency: 92,
  },
  {
    id: "OFF-002",
    name: "Дэлгэрмаа Д.",
    completed: 15,
    inProgress: 4,
    overdue: 0,
    department: "Хэрэг бүртгэлийн хэлтэс",
    position: "Мөрдөгч",
    efficiency: 88,
  },
  {
    id: "OFF-003",
    name: "Ганбаатар Б.",
    completed: 14,
    inProgress: 2,
    overdue: 2,
    department: "Эрүүгийн цагдаагийн хэлтэс",
    position: "Ахлах мөрдөгч",
    efficiency: 85,
  },
  {
    id: "OFF-004",
    name: "Энхбаяр Б.",
    completed: 12,
    inProgress: 5,
    overdue: 1,
    department: "Эрүүгийн цагдаагийн хэлтэс",
    position: "Мөрдөгч",
    efficiency: 80,
  },
  {
    id: "OFF-005",
    name: "Түвшинбаяр С.",
    completed: 11,
    inProgress: 3,
    overdue: 0,
    department: "Хяналтын хэлтэс",
    position: "Ахлах мөрдөгч",
    efficiency: 90,
  },
  {
    id: "OFF-006",
    name: "Баярсайхан Т.",
    completed: 10,
    inProgress: 2,
    overdue: 1,
    department: "Хяналтын хэлтэс",
    position: "Мөрдөгч",
    efficiency: 82,
  },
  {
    id: "OFF-007",
    name: "Мөнхбат Д.",
    completed: 9,
    inProgress: 4,
    overdue: 0,
    department: "Хэрэг бүртгэлийн хэлтэс",
    position: "Ахлах мөрдөгч",
    efficiency: 86,
  },
  {
    id: "OFF-008",
    name: "Баатарсүрэн Б.",
    completed: 8,
    inProgress: 3,
    overdue: 2,
    department: "Эрүүгийн цагдаагийн хэлтэс",
    position: "Мөрдөгч",
    efficiency: 75,
  },
  {
    id: "OFF-009",
    name: "Оюунчимэг Ч.",
    completed: 7,
    inProgress: 2,
    overdue: 0,
    department: "Хяналтын хэлтэс",
    position: "Ахлах мөрдөгч",
    efficiency: 89,
  },
  {
    id: "OFF-010",
    name: "Батбаяр Н.",
    completed: 6,
    inProgress: 3,
    overdue: 1,
    department: "Хэрэг бүртгэлийн хэлтэс",
    position: "Мөрдөгч",
    efficiency: 78,
  },
]

export function PerformanceStats() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Ажилтнуудын ажлын гүйцэтгэлийн харьцуулалт</div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Дэлгэрэнгүй харах
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Ажилтнуудын гүйцэтгэлийн дэлгэрэнгүй</DialogTitle>
              <DialogDescription>Бүх ажилтнуудын ажлын гүйцэтгэлийн дэлгэрэнгүй мэдээлэл</DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Нэр</TableHead>
                    <TableHead>Хэлтэс</TableHead>
                    <TableHead>Албан тушаал</TableHead>
                    <TableHead className="text-center">Дууссан</TableHead>
                    <TableHead className="text-center">Хийгдэж буй</TableHead>
                    <TableHead className="text-center">Хугацаа хэтэрсэн</TableHead>
                    <TableHead className="text-center">Үр ашиг (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((officer) => (
                    <TableRow key={officer.id}>
                      <TableCell className="font-medium">{officer.name}</TableCell>
                      <TableCell>{officer.department}</TableCell>
                      <TableCell>{officer.position}</TableCell>
                      <TableCell className="text-center">
                        <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                          {officer.completed}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                          {officer.inProgress}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="rounded-full bg-red-100 px-2 py-1 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
                          {officer.overdue}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${officer.efficiency}%` }}
                            ></div>
                          </div>
                          <span className="ml-2">{officer.efficiency}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" scale="band" width={100} tick={{ fontSize: 12 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="font-bold">{label}</div>
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center">
                          <div className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-sm">
                            {entry.name}: {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend />
            <Bar dataKey="completed" fill="#4ade80" name="Дууссан" radius={[0, 4, 4, 0]} barSize={20} />
            <Bar dataKey="inProgress" fill="#facc15" name="Хийгдэж буй" radius={[0, 4, 4, 0]} barSize={20} />
            <Bar dataKey="overdue" fill="#f87171" name="Хугацаа хэтэрсэн" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#4ade80]"></div>
          <span className="text-sm">Дууссан</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#facc15]"></div>
          <span className="text-sm">Хийгдэж буй</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#f87171]"></div>
          <span className="text-sm">Хугацаа хэтэрсэн</span>
        </div>
      </div>
    </div>
  )
}

