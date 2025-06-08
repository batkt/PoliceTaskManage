'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useDashboard } from '@/context/dashboard-context';
import { TaskStatus } from '@/lib/types/task.types';
import { CheckCheck, ClockAlert, Hourglass, ListChecks } from 'lucide-react';

const TaskCounts = () => {
  const { statsCount } = useDashboard();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Нийт даалгавар</CardTitle>
          <ListChecks />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statsCount?.total || 0}</div>
          {/* <p className="text-xs text-muted-foreground">+12.5% өмнөх сараас</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Хийгдэж буй</CardTitle>
          <Hourglass />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statsCount?.[TaskStatus.IN_PROGRESS] || 0}
          </div>
          {/* <p className="text-xs text-muted-foreground">
              33.8% нийт даалгавраас
            </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Дууссан</CardTitle>
          <CheckCheck />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statsCount?.[TaskStatus.COMPLETED] || 0}
          </div>
          {/* <p className="text-xs text-muted-foreground">
              61.3% нийт даалгавраас
            </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Хугацаа хэтэрсэн
          </CardTitle>
          <ClockAlert />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statsCount?.overdue || 0}</div>
          {/* <p className="text-xs text-muted-foreground">
              4.9% нийт даалгавраас
            </p> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCounts;
