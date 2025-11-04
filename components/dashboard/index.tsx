"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    CheckCircle2,
    Calendar as CalendarIcon,
    FileText,
    Award,
    Clock,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { getMasterDashboard } from "@/lib/service/dashboard";
import { useUsers } from "@/context/user-context";
import SuperAdminDashboard from "@/components/dashboard/super-admin-dashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import UserDashboard from "@/components/dashboard/user-dashboard";
import DashboardLoader from "@/components/dashboard/dashboard-loader";


export default function Dashboard() {
    const { accessToken, authUser } = useAuth();
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
    });
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBranch, setSelectedBranch] = useState<string>("all");
    const { branches } = useUsers();

    const userRole = authUser?.role || "user";

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                startDate: format(dateRange.from, "yyyy-MM-dd"),
                endDate: format(dateRange.to, "yyyy-MM-dd"),
            });

            const result = await getMasterDashboard(params.toString(), accessToken);

            console.log(result)
            if (result.code === 200) {
                setDashboardData(result.data);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPerformers = async (branchFilter?: string) => {
        try {
            const params = new URLSearchParams({
                startDate: format(dateRange.from, "yyyy-MM-dd"),
                endDate: format(dateRange.to, "yyyy-MM-dd"),
                ...(branchFilter && branchFilter !== "all" && { branchId: branchFilter }),
            });

            const response = await fetch(
                `/api/dashboard/top-bottom-performers?${params}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            const result = await response.json();
            if (response.ok) {
                setDashboardData((prev: any) => ({
                    ...prev,
                    topPerformers: result.data.topPerformers,
                    bottomPerformers: result.data.bottomPerformers,
                }));
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (loading || !dashboardData) {
        return <DashboardLoader />;
    }

    const { summary } = dashboardData;

    return (
        <div className="min-h-screen">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Хянах самбар
                                </h2>
                                <p className="text-muted-foreground">
                                    Ажлуудын статистик болон гүйцэтгэлийн үзүүлэлтүүд
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start shadow-sm">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(dateRange.from, "MMM dd")} -{" "}
                                    {format(dateRange.to, "MMM dd, yyyy")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="range"
                                    selected={{ from: dateRange.from, to: dateRange.to }}
                                    onSelect={(range: any) => {
                                        if (range?.from && range?.to) {
                                            setDateRange({ from: range.from, to: range.to });
                                        }
                                    }}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Нийт ажлууд
                            </CardTitle>
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{summary.totalTasks}</div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Гүйцэтгэсэн
                            </CardTitle>
                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{summary.completedTasks}</div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Баталгаажсан
                            </CardTitle>
                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Award className="h-5 w-5 text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{summary.approvedTasks}</div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Өнөөдөр дуусах
                            </CardTitle>
                            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-amber-600">
                                {summary.dueToday}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Super-admin Dashboard */}
                {userRole === "super-admin" && (
                    <SuperAdminDashboard
                        data={dashboardData}
                        branches={branches}
                        selectedBranch={selectedBranch}
                        setSelectedBranch={setSelectedBranch}
                        fetchPerformers={fetchPerformers}
                    />
                )}

                {/* Admin Dashboard */}
                {userRole === "admin" && (
                    <AdminDashboard
                        data={dashboardData}
                        branches={branches}
                        selectedBranch={selectedBranch}
                        setSelectedBranch={setSelectedBranch}
                        fetchPerformers={fetchPerformers}
                    />
                )}

                {/* User Dashboard */}
                {userRole === "user" && <UserDashboard data={dashboardData} />}
            </div>
        </div>
    );
}