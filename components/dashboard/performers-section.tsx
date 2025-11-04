"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function PerformersSection({
    topPerformers,
    bottomPerformers,
    branches,
    selectedBranch,
    setSelectedBranch,
    fetchPerformers,
}: any) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Ажилчдын гүйцэтгэл</h3>
                {branches && branches.length > 0 && (
                    <Select
                        value={selectedBranch}
                        onValueChange={(value) => {
                            setSelectedBranch(value);
                            fetchPerformers(value === "all" ? undefined : value);
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Салбар сонгох" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Бүгд</SelectItem>
                            {branches.map((branch: any) => (
                                <SelectItem key={branch._id} value={branch._id}>
                                    {branch.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            Сайн гүйцэтгэл
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Нэр</TableHead>
                                    <TableHead>Албан тушаал</TableHead>
                                    <TableHead className="text-right">Гүйцэтгэл</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topPerformers?.map((emp: any, index: number) => (
                                    <TableRow key={emp.employeeId}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{index + 1}</Badge>
                                                {emp.employeeName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{emp.position}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="default">
                                                {emp.completionRate.toFixed(1)}%
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                            Муу гүйцэтгэл
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Нэр</TableHead>
                                    <TableHead>Албан тушаал</TableHead>
                                    <TableHead className="text-right">Гүйцэтгэл</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bottomPerformers?.map((emp: any) => (
                                    <TableRow key={emp.employeeId}>
                                        <TableCell>{emp.employeeName}</TableCell>
                                        <TableCell className="text-sm">{emp.position}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="destructive">
                                                {emp.completionRate.toFixed(1)}%
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default PerformersSection