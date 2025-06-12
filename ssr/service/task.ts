import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { Task } from '@/lib/types/task.types';
import { List } from '@/lib/types/global.types';

export const getAllTasks = async (status: string) => {
  return ssrClient.get<Task[]>(`${BACKEND_URL}/api/task/all?status=${status}`);
};

export const getTaskList = async (queryString?: string) => {
  return ssrClient.get<List<Task>>(
    `${BACKEND_URL}/api/task-v2/${queryString ? `?${queryString}` : ''}`
  );
};

export const getTaskListTest = async (queryString?: string) => {
  return ssrClient.get<List<Task>>(
    `${BACKEND_URL}/api/task-v2/list-test/${
      queryString ? `?${queryString}` : ''
    }`
  );
};
