"use client"

import { useTheme } from "next-themes"
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Department data for the charts
const data = [
  { name: "Хэрэг бүртгэлийн хэлтэс", value: 45, color: "#4ade80", completed: 28, inProgress: 15, overdue: 2 }, // Green
  { name: "Эрүүгийн цагдаагийн хэлтэс", value: 38, color: "#facc15", completed: 22, inProgress: 12, overdue: 4 }, // Yellow
  { name: "Хяналтын хэлтэс", value: 32, color: "#60a5fa", completed: 20, inProgress: 10, overdue: 2 }, // Blue
  { name: "Захиргааны хэлтэс", value: 27, color: "#f87171", completed: 17, inProgress: 9, overdue: 1 }, // Red
]

// Custom tooltip component for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold">{`${payload[0].name}: ${payload[0].value}`}</p>
        <p className="text-sm text-muted-foreground">{`${payload[0].payload.percent}%`}</p>
      </div>
    )
  }
  return null
}

export function DepartmentStats({ showDetailed = false }: { showDetailed?: boolean }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const dataWithPercent = data.map((item) => ({
    ...item,
    percent: ((item.value / total) * 100).toFixed(1),
  }))

  return (
    <>
      {showDetailed ? (
        <Tabs defaultValue="pie" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pie">Диаграм</TabsTrigger>
            <TabsTrigger value="bar">Баганан</TabsTrigger>
          </TabsList>
          <TabsContent value="pie" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataWithPercent}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${percent}%`}
                    labelLine={false}
                  >
                    {dataWithPercent.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="bar" className="pt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Дууссан" fill="#4ade80" stackId="a" />
                  <Bar dataKey="inProgress" name="Хийгдэж буй" fill="#facc15" stackId="a" />
                  <Bar dataKey="overdue" name="Хугацаа хэтэрсэн" fill="#f87171" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithPercent}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${percent}%`}
                  labelLine={false}
                >
                  {dataWithPercent.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            {dataWithPercent.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="flex flex-col items-start">
                  <span className="text-xs font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.value} ажил ({item.percent}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

