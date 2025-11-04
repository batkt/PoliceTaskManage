"use client";

import { COLORS } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Progress } from "@/components/ui/progress";

const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-4 min-w-[120px]">
                <div className="flex items-center gap-2 mb-2">
                    <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: data.payload.color }}
                    />
                    <span className="text-sm font-medium text-foreground">
                        {data.name}
                    </span>
                </div>
                <p className="text-2xl font-bold text-foreground tabular-nums">
                    {data.value.toFixed(1)}%
                </p>
            </div>
        );
    }
    return null;
};

const ApprovalRejectionGauge = ({ data }: any) => {
    if (!data) return null;

    const gaugeData = [
        { name: "Зөвшөөрсөн", value: data.approvalRate, color: COLORS.green },
        { name: "Татгалзсан", value: data.rejectionRate, color: COLORS.red },
        { name: "Үлдсэн", value: 100 - data.approvalRate - data.rejectionRate, color: "#e5e7eb" },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Хяналт</CardTitle>
                    <CardDescription>Ажлын хяналтын үзүүлэлт</CardDescription>
                </CardHeader>
                <CardContent className="relative overflow-hidden h-[260px]">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={gaugeData}
                                cx="50%"
                                cy="50%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {gaugeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-4 mt-4 relative -top-[130px]">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {data.approvalRate.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Зөвшөөрсөн</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {data.rejectionRate.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Татгалзсан</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Хянагдсан ажлуудын тоо</CardTitle>
                    <CardDescription>Нийт {data.totalReviews} ажил</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm">Зөвшөөрсөн</span>
                            <span className="text-sm font-medium">{data.approved}</span>
                        </div>
                        <Progress value={(data.approved / data.totalReviews) * 100} className="h-3" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm">Татгалзсан</span>
                            <span className="text-sm font-medium">{data.rejected}</span>
                        </div>
                        <Progress
                            value={(data.rejected / data.totalReviews) * 100}
                            className="h-3"
                            indicatorClassName="bg-red-500"
                        />
                    </div>
                    <div className="pt-4 border-t">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Дундаж оноо</span>
                            <span className="text-2xl font-bold">{data.avgScore.toFixed(1)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ApprovalRejectionGauge;