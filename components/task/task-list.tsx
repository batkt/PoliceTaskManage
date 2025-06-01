import { getAllTasks } from '@/ssr/service/task';
import React from 'react';
import { MyTasksResponsiveView } from '../my-tasks-responsive-view';

const TaskList = async ({ status }: { status: string }) => {
  const res = await getAllTasks(status);

  return (
    <MyTasksResponsiveView
      status={status}
      data={res?.code === 200 ? res.data : []}
    />
  );
};

export default TaskList;
