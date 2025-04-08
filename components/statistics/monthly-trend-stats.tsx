"use client"

import { useTheme } from "next-themes"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
  Bar,
  BarChart,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Monthly task data
const data = [
  {
    name: "1-р сар",
    completed: 15,
    inProgress: 5,
    overdue: 1,
    total: 21,
  },
  {
    name: "2-р сар",
    completed: 18,
    inProgress: 7,
    overdue: 2,
    total: 27,
  },
  {
    name: "3-р сар",
    completed: 20,
    inProgress: 8,
    overdue: 1,
    total: 29,
  },
  {
    name: "4-р сар",
    completed: 22,
    inProgress: 9,
    overdue: 3,
    total: 34,
  },
  {
    name: "5-р сар",
    completed: 25,
    inProgress: 10,
    overdue: 2,
    total: 37,
  },
  {
    name: "6-р сар",
    completed: 28,
    inProgress: 12,
    overdue: 3,
    total: 43,
  },
  {
    name: "7-р сар",
    completed: 18,
    inProgress: 7,
    overdue: 2,
    total: 27,
  },
  {
    name: "8-р сар",
    completed: 22,
    inProgress: 9,
    overdue: 1,
    total: 32,
  },
  {
    name: "9-р сар",
    completed: 25,
    inProgress: 12,
    overdue: 3,
    total: 40,
  },
  {
    name: "10-р сар",
    completed: 19,
    inProgress: 10,
    overdue: 2,
    total: 31,
  },
  {
    name: "11-р сар",
    completed: 32,
    inProgress: 15,
    overdue: 4,
    total: 51,
  },
  {
    name: "12-р сар",
    completed: 27,
    inProgress: 13,
    overdue: 2,
    total: 42,
  },
]

export function MonthlyTrendStats({ showDetailed = false }: { showDetailed?: boolean }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const last6MonthsData = data.slice(-6)

  return (
    <>
      {showDetailed ? (
        <Tabs defaultValue="line" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="line">Шугаман</TabsTrigger>
            <TabsTrigger value="area">Талбайн</TabsTrigger>
            <TabsTrigger value="bar">Баганан</TabsTrigger>
          </TabsList>
          <TabsContent value="line" className="pt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Нийт"
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
          </TabsContent>
          <TabsContent value="area" className="pt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stackId="1"
                    stroke="#4ade80"
                    fill="#4ade80"
                    name="Дууссан"
                  />
                  <Area
                    type="monotone"
                    dataKey="inProgress"
                    stackId="1"
                    stroke="#facc15"
                    fill="#facc15"
                    name="Хийгдэж буй"
                  />
                  <Area
                    type="monotone"
                    dataKey="overdue"
                    stackId="1"
                    stroke="#f87171"
                    fill="#f87171"
                    name="Хугацаа хэтэрсэн"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="bar" className="pt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Дууссан" fill="#4ade80" />
                  <Bar dataKey="inProgress" name="Хийгдэж буй" fill="#facc15" />
                  <Bar dataKey="overdue" name="Хугацаа хэтэрсэн" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last6MonthsData}>
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
      )}
    </>
  )
}

