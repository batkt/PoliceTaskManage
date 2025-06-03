import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { TaskCounts } from '@/lib/types/dashboard.types';

export const getTaskCounts = async () => {
  return ssrClient.get<TaskCounts>(`${BACKEND_URL}/api/dashboard/taskCounts`);
};
