"use client"

import { useTheme } from "next-themes"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

// Priority data for the pie chart
const data = [
  { name: "Өндөр", value: 35, color: "#f87171" }, // Red
  { name: "Дунд", value: 52, color: "#facc15" }, // Yellow
  { name: "Бага", value: 55, color: "#4ade80" }, // Green
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

export function TasksByPriorityChart() {
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
      <div className="mt-4 flex justify-center gap-8 text-center">
        {dataWithPercent.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="mt-1 text-2xl font-bold">{item.value}</div>
            <div className="text-xs text-muted-foreground">{item.percent}%</div>
          </div>
        ))}
      </div>
    </>
  )
}

