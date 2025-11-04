"use client";

import {
    BarChart,
    Bar,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import ApprovalRejectionGauge from "./approve-rejection-gauge";
import PerformersSection from "./performers-section";
import { COLORS } from "@/lib/utils";
import CustomTooltip from "./custom-tooltip";

function SuperAdminDashboard({
    data,
    branches,
    selectedBranch,
    setSelectedBranch,
    fetchPerformers,
}: any) {
    const { departmentStatusDistribution, approvalRejectionGauge, topPerformers, bottomPerformers } = data;

    return (
        <>
            {/* Department Status Distribution */}
            {departmentStatusDistribution && (
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">Салбаруудын ажлын төлөв</CardTitle>
                        <CardDescription>Бүх салбаруудын статус харьцуулалт</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={departmentStatusDistribution}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="branchName" angle={-45} textAnchor="end" height={100} />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)', radius: 8 }} />
                                <Legend />
                                <Bar dataKey="new" name="Шинэ" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="in_progress" name="Гүйцэтгэж байгаа" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="completed" name="Гүйцэтгэсэн" fill={COLORS.green} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="approved" name="Баталгаажсан" fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="rejected" name="Татгалзсан" fill={COLORS.red} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Approval/Rejection Gauge */}
            <ApprovalRejectionGauge data={approvalRejectionGauge} />

            {/* Top & Bottom Performers */}
            <PerformersSection
                topPerformers={topPerformers}
                bottomPerformers={bottomPerformers}
                branches={branches}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                fetchPerformers={fetchPerformers}
            />
        </>
    );
}

export default SuperAdminDashboard;