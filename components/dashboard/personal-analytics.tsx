"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { COLORS } from "@/lib/utils";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./custom-tooltip";
import { Badge } from "@/components/ui/badge";

function PersonalAnalytics({ data, showAllSections = false }: any) {
    if (!data) return null;

    const { completionTime, onTimePerformance, approvalStats, dueToday, overdueTasks, tasksToReview, monthlyTrend } = data;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Таны гүйцэтгэл</h3>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Дундаж гүйцэтгэх хугацаа</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {completionTime.avgCompletionDays.toFixed(1)} өдөр
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {completionTime.totalCompleted} ажил гүйцэтгэсэн
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Хугацаандаа гүйцэтгэх</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {onTimePerformance.onTimeRate.toFixed(1)}%
                        </div>
                        <Progress value={onTimePerformance.onTimeRate} className="h-2 mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                            {onTimePerformance.onTimeTasks}/{onTimePerformance.totalTasks} цагтаа
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Дундаж хоцролт</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-600">
                            {onTimePerformance.avgDelayDays.toFixed(1)} өдөр
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {onTimePerformance.lateTasks} хоцорсон
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Approval/Rejection */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Таны гүйцэтгэсэн ажлын хяналт</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm">Зөвшөөрсөн</span>
                                <span className="text-sm font-medium">{approvalStats.approved}</span>
                            </div>
                            <Progress value={approvalStats.approvalRate} className="h-3" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm">Татгалзсан</span>
                                <span className="text-sm font-medium">{approvalStats.rejected}</span>
                            </div>
                            <Progress
                                value={approvalStats.rejectionRate}
                                className="h-3"
                                indicatorClassName="bg-red-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Сарын чиг хандлага</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={monthlyTrend}>
                                <defs>
                                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: COLORS.green, strokeWidth: 2, strokeDasharray: '5 5' }} />
                                <Area
                                    type="monotone"
                                    dataKey="tasksCompleted"
                                    stroke={COLORS.green}
                                    fillOpacity={1}
                                    fill="url(#colorCompleted)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Due Today & Overdue */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-orange-500/20 border-orange-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            Өнөөдөр дуусах ({dueToday.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {dueToday.slice(0, 5).map((task: any) => (
                                <div key={task.taskId} className="flex justify-between items-center p-2 border rounded">
                                    <span className="text-sm truncate">{task.title}</span>
                                    <Badge variant="outline">{task.priority}</Badge>
                                </div>
                            ))}
                            {dueToday.length === 0 && (
                                <p className="text-sm text-muted-foreground">Өнөөдөр дуусах ажил байхгүй</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-red-500/20 border-red-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            Хугацаа хэтэрсэн ({overdueTasks.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {overdueTasks.slice(0, 5).map((task: any) => (
                                <div key={task.taskId} className="flex justify-between items-center p-2 border rounded">
                                    <span className="text-sm truncate">{task.title}</span>
                                    <Badge variant="destructive">{task.daysOverdue} өдөр</Badge>
                                </div>
                            ))}
                            {overdueTasks.length === 0 && (
                                <p className="text-sm text-muted-foreground">Хугацаа хэтэрсэн ажил байхгүй</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tasks to Review */}
            {tasksToReview && tasksToReview.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            Хянах боломжтой ажлууд ({tasksToReview.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ажлын нэр</TableHead>
                                    <TableHead>Ажилтан</TableHead>
                                    <TableHead>Дууссан огноо</TableHead>
                                    <TableHead className="text-right">Хүлээсэн хоног</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasksToReview.slice(0, 5).map((task: any) => (
                                    <TableRow key={task.taskId}>
                                        <TableCell className="font-medium">{task.title}</TableCell>
                                        <TableCell>{task.assignee}</TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(task.completedDate).toLocaleDateString("mn-MN")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline">{task.waitingDays} өдөр</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default PersonalAnalytics;