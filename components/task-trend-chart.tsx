"use client"

import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Monthly task data
const data = [
  {
    name: "7-р сар",
    completed: 18,
    inProgress: 7,
    overdue: 2,
  },
  {
    name: "8-р сар",
    completed: 22,
    inProgress: 9,
    overdue: 1,
  },
  {
    name: "9-р сар",
    completed: 25,
    inProgress: 12,
    overdue: 3,
  },
  {
    name: "10-р сар",
    completed: 19,
    inProgress: 10,
    overdue: 2,
  },
  {
    name: "11-р сар",
    completed: 32,
    inProgress: 15,
    overdue: 4,
  },
  {
    name: "12-р сар",
    completed: 27,
    inProgress: 13,
    overdue: 2,
  },
]

export function TaskTrendChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="name"
            stroke={isDark ? "#888888" : "#888888"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={isDark ? "#888888" : "#888888"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
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
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#4ade80"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Дууссан"
          />
          <Line
            type="monotone"
            dataKey="inProgress"
            stroke="#facc15"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Хийгдэж буй"
          />
          <Line
            type="monotone"
            dataKey="overdue"
            stroke="#f87171"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Хугацаа хэтэрсэн"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

