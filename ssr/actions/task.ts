'use server';

import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import {
  CreateMemoTaskType,
  CreateWorkGroupTaskType,
  ICreateTaskInput,
  TaskStatus,
  TaskStatusChangeType,
} from '@/lib/types/task.types';
import { revalidatePath } from 'next/cache';

export const createMemoTask = async (
  data: CreateMemoTaskType,
  path: string
) => {
  const res = await ssrClient.post(
    `${BACKEND_URL}/api/task/createMemoTask`,
    data
  );
  revalidatePath(path);
  return res;
};

export const createWorkGroupTask = async (
  data: CreateWorkGroupTaskType,
  path: string
) => {
  const res = await ssrClient.post(
    `${BACKEND_URL}/api/task/createWorkGroupTask`,
    data
  );
  revalidatePath(path);
  return res;
};

export const changeStatusAction = async (
  data: TaskStatusChangeType,
  path?: string
) => {
  const { status, taskId } = data;
  let res;
  if (status === TaskStatus.COMPLETED) {
    res = await ssrClient.post(`${BACKEND_URL}/api/task-v2/complete`, {
      taskId,
    });
  } else {
    res = await ssrClient.post(`${BACKEND_URL}/api/task-v2/start`, {
      taskId,
    });
  }

  if (path) revalidatePath(path);
  return res;
};

export const createTask = async (data: ICreateTaskInput) => {
  const res = await ssrClient.post(`${BACKEND_URL}/api/task-v2/`, data);
  console.log(res);
  return res;
};
