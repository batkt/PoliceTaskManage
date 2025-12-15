import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { Task, TaskDetail } from '@/lib/types/task.types';
import { List } from '@/lib/types/global.types';

export const getAllTasks = async (status: string, token?: string) => {
  return ssrClient.get<Task[]>(`${BACKEND_URL}/api/task/all?status=${status}`, token);
};

export const getTaskDetail = async (taskId: string, token?: string) => {
  return ssrClient.get<TaskDetail>(`${BACKEND_URL}/api/task-v2/${taskId}`, token);
};

export const getMyTaskList = async (queryString?: string, token?: string) => {
  return ssrClient.get<List<Task>>(
    `${BACKEND_URL}/api/task-v2/my-list-week${queryString ? `?${queryString}` : ''}`,
    token
  );
};

export const getTaskList = async (queryString?: string, token?: string) => {
  return ssrClient.get<List<Task>>(
    `${BACKEND_URL}/api/task-v2/${queryString ? `?${queryString}` : ''}`,
    token
  );
};

export const getArchivedTaskList = async (queryString?: string, token?: string) => {
  return ssrClient.get<List<Task>>(
    `${BACKEND_URL}/api/task-v2/archived${queryString ? `?${queryString}` : ''}`,
    token
  );
};
