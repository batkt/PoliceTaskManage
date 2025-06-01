'use server';

import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { CreateMemoTaskType } from '@/lib/types/task.types';
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
