"use client"

import { useTheme } from "next-themes"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

// Department data for the pie chart
const data = [
  { name: "Хэрэг бүртгэлийн хэлтэс", value: 45, color: "#4ade80" }, // Green
  { name: "Эрүүгийн цагдаагийн хэлтэс", value: 38, color: "#facc15" }, // Yellow
  { name: "Хяналтын хэлтэс", value: 32, color: "#60a5fa" }, // Blue
  { name: "Захиргааны хэлтэс", value: 27, color: "#f87171" }, // Red
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

export function TasksByDepartmentChart() {
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
                {item.value} даалгавар ({item.percent}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

