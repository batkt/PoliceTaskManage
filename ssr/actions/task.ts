'use server';

import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import {
  CreateMemoTaskType,
  CreateWorkGroupTaskType,
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

export const changStatusAction = async (
  data: TaskStatusChangeType,
  path?: string
) => {
  const res = await ssrClient.post(
    `${BACKEND_URL}/api/task/changeStatus`,
    data
  );
  if (path) revalidatePath(path);
  return res;
};
