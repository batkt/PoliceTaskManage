'use client';

import { httpRequest } from '@/lib/http.utils';
import { Memo, Task, TaskDetail, WorkGroup } from '@/lib/types/task.types';

export const getMemoTask = async (taskId: string, token?: string) => {
  return httpRequest.get<Memo>('/task/getMemoByTaskId?taskId=' + taskId, token);
};

export const getWorkGroupTask = async (taskId: string, token?: string) => {
  return httpRequest.get<WorkGroup>(
    '/task/getWorkgroupByTaskId?taskId=' + taskId,
    token
  );
};

export const getTaskDetail = async (taskId: string, token?: string) => {
  return httpRequest.get<TaskDetail>('/task-v2/' + taskId, token);
};
