"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts"

// Task status data for the pie chart
const data = [
  { name: "Дууссан", value: 87, color: "#4ade80" }, // Green
  { name: "Хийгдэж буй", value: 48, color: "#facc15" }, // Yellow
  { name: "Хугацаа хэтэрсэн", value: 7, color: "#f87171" }, // Red
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

// Custom active shape for the pie chart
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

  return (
    <g>
      <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill={fill} className="text-2xl font-bold">
        {value}
      </text>
      <text x={cx} y={cy + 35} dy={8} textAnchor="middle" fill={fill} className="text-sm">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

export function TaskCompletionStats() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [activeIndex, setActiveIndex] = useState(0)

  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const dataWithPercent = data.map((item) => ({
    ...item,
    percent: ((item.value / total) * 100).toFixed(1),
  }))

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  return (
    <>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercent}
              cx="50%"
              cy="50%"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {dataWithPercent.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
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

