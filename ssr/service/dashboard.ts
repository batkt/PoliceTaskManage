import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { StatsCount } from '@/lib/types/dashboard.types';

export const getTaskCounts = async () => {
  return ssrClient.get<StatsCount>(`${BACKEND_URL}/api/dashboard/taskCounts`);
};
