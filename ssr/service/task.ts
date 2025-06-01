import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { Task } from '@/lib/types/task.types';

export const getAllTasks = async (status: string) => {
  return ssrClient.get<Task[]>(`${BACKEND_URL}/api/task/all?status=${status}`);
};
